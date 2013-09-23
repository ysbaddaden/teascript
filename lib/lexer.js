var RE, REGEXP, Token, rewrite, words;
words = require('./lexer/words');
rewrite = require('./lexer/rewrite');
Token = require('./lexer/token');
RE = require('./lexer/definition').RE;
REGEXP = require('./lexer/definition').REGEXP;

function Lexer(input) {
    var self = this;
    self.input = input;
    self.index = 0;
    self.line = 1;
    self.column = 1;
    self.tokens = [];
    self.state = [];
    self.state.is = function (name) {
        return this[this.length - 1] === name;
    };
}
Lexer.prototype.constructor = Lexer;
Lexer.prototype.tokenize = function () {
    var self = this;
    var str;
    while (true) {
        str = self.input.slice(self.index);
        if (!(str)) {
            self.tokens.push(self.token('EOF'));
            break;
        }
        if (self.state.is('embed') && self.match_embed(str)) {
            continue;
        }
        self.match(str);
    }
    return rewrite(self.tokens);
};
Lexer.prototype.match = function (str) {
    var self = this;
    var m, name;
    if (m = str.match(RE.COMMENT)) {
        name = 'COMMENT';
    } else if (str.match(RE.LINEFEED)) {
        self.linefeed();
        return;
    } else if (m = str.match(RE.SEMICOLON)) {
        name = m[0];
    } else if (m = str.match(RE.BOOL)) {
        name = 'BOOLEAN';
    } else if (m = str.match(RE.NIL)) {
        name = 'NIL';
    } else if (m = str.match(RE.FLOAT)) {
        name = 'NUMBER';
    } else if (m = str.match(RE.INTEGER)) {
        name = 'NUMBER';
    } else if (str.match(RE.REGEXP)) {
        self.regexp(str);
        return;
    } else if (m = str.match(RE.KEYWORDS)) {
        name = m[0];
    } else if (m = str.match(RE.OPERATORS)) {
        name = m[0];
    } else if (m = str.match(RE.PARENS)) {
        name = m[0];
    } else if (m = str.match(RE.IDENTIFIER)) {
        name = 'identifier';
    } else if (m = str.match(RE.WHITESPACE)) {
        name = 'whitespace';
    } else if (str.match(RE.STRING)) {
        self.string(str);
        return;
    } else if (str.match(RE.STRING2)) {
        self.embedable_string(str);
        return;
    } else {
        m = str.match(/^(.+)\b/);
        throw Error(("unknown token " + (m[0]) + " at " + (self.line) + "," + (self.column)));
    }
    if (name) {
        self.tokens.push(self.token(name, m[0]));
    }
};
Lexer.prototype.match_embed = function (str) {
    var self = this;
    if (str.match(/^#\{/)) {
        self.tokens.push(self.token('+', '+'));
        self.tokens.push(self.token('(', '('));
    } else if (str.match(/^\}/)) {
        if (str[1] === '"') {
            self.tokens.push(self.token(')', ')'));
            self.tokens.push(self.token(')', ')'));
            self.state.pop();
            self.state.pop();
        } else {
            self.tokens.push(self.token(')', ')'));
            self.tokens.push(self.token('+', '+'));
            self.consume(-1);
            self.unput('"');
            self.state.pop();
        }
    } else {
        return false;
    }
    return true;
};
Lexer.prototype.linefeed = function () {
    var self = this;
    self.line += 1;
    self.column = 0;
    self.consume(1);
    self.tokens.push(self.token('LF'));
};
Lexer.prototype.embedable_string = function (str) {
    var self = this;
    self.string(str);
    if (self.state.is('string')) {
        self.tokens.push(self.token(')', ')'));
        self.state.pop();
    }
};
Lexer.prototype.string = function (str) {
    var self = this;
    var idx, j, m, quote, re, text, value;
    quote = str[0];
    idx = 1;
    value = '';
    re = quote === '"' ? /^([^"]*")/ : /^([^']*')/;
    while (true) {
        if (m = str.slice(idx).match(re)) {
            text = m[0];
            if (quote === '"' && (j = text.match(/#\{/))) {
                value += text.slice(0, j.index) + quote;
                self.embed();
                break;
            } else {
                value += text;
                if (text.slice(-2) === ("\\" + (quote))) {
                    idx += text.length;
                } else {
                    break;
                }
            }
        } else {
            throw Error("unterminated string");
        }
    }
    self.tokens.push(self.token('STRING', quote + value));
    self.line += (value.match(/\n/g) || '').length;
    if (self.state.is('string')) {
        self.tokens.push(self.token(')', ')'));
        self.consume(-1);
        self.state.pop();
    }
};
Lexer.prototype.embed = function () {
    var self = this;
    if (self.state.is('string')) {
        self.consume(-1);
    } else {
        self.tokens.push(self.token('(', '('));
        self.state.push('string');
        self.consume(-2);
    }
    self.state.push('embed');
};
Lexer.prototype.regexp = function (str) {
    var self = this;
    var i, idx, m, mm;
    i = self.tokens.length - 1;
    idx = 1;
    while (self.tokens[i] && self.tokens[i].name === 'whitespace') {
        i -= 1;
    }
    if (!self.tokens[i] || REGEXP.contains(self.tokens[i].name)) {
        while (true) {
            m = str.slice(idx).indexOf('/');
            if (m === -1) {
                throw Error('unterminated regexp');
            } else {
                idx += m + 1;
                if (str.slice(idx - 2, idx) !== '\\/') {
                    if (mm = str.slice(idx).match(/^[gimy]*/)) {
                        idx += mm[0].length;
                    }
                    self.tokens.push(self.token('REGEXP', str.slice(0, idx)));
                    return;
                }
            }
        }
    }
    self.tokens.push(self.token('/', '/'));
};
Lexer.prototype.token = function (name, value) {
    var self = this;
    if (value == null) value = null;
    if (value) {
        self.consume(value.length);
    }
    return new Token(name, value, self.line, self.column);
};
Lexer.prototype.consume = function (size) {
    var self = this;
    self.index += size;
    self.column += size;
};
Lexer.prototype.unput = function (str) {
    var self = this;
    if (self.index > 0) {
        self.input = self.input.slice(0, self.index) + str + self.input.slice(self.index);
    } else {
        self.input = str + self.input.slice(self.index);
    }
};
module.exports = {
    setInput: function (input) {
        this.tokens = new Lexer(input).tokenize();
    },
    lex: function () {
        var token;
        token = this.tokens.shift();
        if (token) {
            this.yytext = token.value;
            this.yyleng = token.value ? token.value.length : 0;
            this.yylineno = token.line - 1;
            this.yycolumn = token.column;
            return token.name;
        } else {
            return 'EOF';
        }
    }
};