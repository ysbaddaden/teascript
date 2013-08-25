var ARGUMENT, BOOL_RE, COMMENT_RE, FLOAT_RE, IDENTIFIER_RE, INTEGER_RE, KEYWORDS, KEYWORDS_RE, LINEFEED_RE, NIL_RE, OPERATORS, OPERATORS_RE, PARENS, PARENS_RE, REGEXP, REGEXP_RE, SEMICOLON_RE, SKIP_LF_AFTER, SKIP_LF_BEFORE, STRING2_RE, STRING_RE, WHITESPACE_RE;

function escape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function re(ary, bound) {
    var map;
    map = ary.map(function (t) {
        return escape(t);
    }).join('|');
    return new RegExp('^(' + map + ')' + (bound ? '\\b' : ''));
}
function words(str) {
    var ary;
    ary = str.trim().split(/\s+/);
    ary.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    return ary;
}
function enhanced_array() {
    var ary;
    ary = [];
    ary.last = function () {
        return this[this.length - 1];
    };
    return ary;
}
KEYWORDS = words("\n  def delete return then do end\n  if unless else elsif case when while until loop for in own of\n  break next new throw begin rescue ensure\n  and or not typeof instanceof\n");
OPERATORS = words("\n  -> += -= *= /= %= &= |= ^= ||= >>= <<=\n  + - ~ * / % && || & | ^ << >> == != <= >= => < >\n  ... .. . , = : ? !\n");
PARENS = words("( ) { } [ ]");
REGEXP = words("\n  ( , = : [ ! & | ? { } ; ~ + - * % ^ < >\n  return when if else elsif unless\n");
ARGUMENT = words("\n  BOOLEAN NIL NUMBER STRING REGEXP identifier\n  ( [ \{ -> not typeof new\n");
SKIP_LF_AFTER = OPERATORS.concat(words("and or not LF COMMENT ( { [ ,"));
SKIP_LF_AFTER.contains = function (value) {
    return this.indexOf(value) !== -1;
};
SKIP_LF_BEFORE = words(", : ) } ]");
SKIP_LF_BEFORE.contains = function (value) {
    return this.indexOf(value) !== -1;
};
COMMENT_RE = /^((?:#.*\n\s*)*#[^\n]*)/;
LINEFEED_RE = /^\n/;
SEMICOLON_RE = /^(;)/;
BOOL_RE = /^(true|false)\b/;
NIL_RE = /^(null|nil|undefined)\b/;
FLOAT_RE = /^((\d+)?\.\d+)([eE][-+]?\d+)?\b/;
INTEGER_RE = /^(\d+)([eE][-+]?\d+)?\b/;
REGEXP_RE = /^\/[^=]/;
KEYWORDS_RE = re(KEYWORDS, true);
OPERATORS_RE = re(OPERATORS);
PARENS_RE = re(PARENS);
WHITESPACE_RE = /^([ \t\r]+)/;
STRING_RE = /^(')/;
STRING2_RE = /^(")/;
IDENTIFIER_RE = /^([$a-zA-Z_][$a-zA-Z0-9_]*)/;

function Token(name, value, line, column) {
    var self = this;
    if (line == null) line = null;
    if (column == null) column = null;
    self.name = name;
    self.value = value;
    self.line = line;
    self.column = column;
}
Token.prototype.inspect = function () {
    var self = this;
    value = self.value === null ? '' : (self.value === self.name ? '' : self.value);
    return "[" + self.name + (value ? ' ' + value : '') + "]";
};
Token.prototype.yylloc = function () {
    var self = this;
    var idx, lloc, m;
    lloc = {
        first_line: self.line,
        last_line: self.line,
        first_column: self.column,
        last_column: self.column
    };
    if (self.value) {
        if (m = self.value.match(/(\n)/g)) {
            lloc.last_line += m.length;
            idx = self.value.lastIndexOf('\n');
            if (idx === -1) {
                lloc.last_column += self.value.length;
            } else {
                lloc.last_column = self.value.slice(idx).length;
            }
        } else {
            lloc.last_column += self.value.length;
        }
    }
    return lloc;
};
Token.prototype.is = function (name) {
    var self = this;
    switch (name) {
    case 'keyword':
        return KEYWORDS.contains(self.name);
    case 'operator':
        return OPERATORS.contains(self.name);
    case 'argument':
        return ARGUMENT.contains(self.name);
    default:
        return self.name === name;
    }
};

function Lexer(input) {
    var self = this;
    self.input = input;
    self.index = 0;
    self.line = 1;
    self.column = 1;
    self.tokens = enhanced_array();
    self.state = enhanced_array();
}
Lexer.prototype.tokenize = function () {
    var self = this;
    var str;
    while (true) {
        str = self.input.slice(self.index);
        if (!(str)) {
            self.tokens.push(self.token('EOF'));
            break;
        }
        if (self.state.last() === 'embed' && self.match_embed(str)) {
            continue;
        }
        self.match(str);
    }
    return self.rewrite(self.tokens);
};
Lexer.prototype.rewrite = function (tokens) {
    var self = this;
    var i, next_token, rs, s, skip, state, token;
    i = 0;
    rs = enhanced_array();
    state = enhanced_array();
    state.is = function (name) {
        return this.last() === name;
    };
    next_token = function () {
        if (tokens[i] && !tokens[i].is('whitespace')) {
            return tokens[i];
        } else {
            return tokens[i + 1];
        }
    };
    skip = function () {
        return (rs.last() && SKIP_LF_AFTER.contains(rs.last().name)) || (next_token() && SKIP_LF_BEFORE.contains(next_token().name));
    };
    while (token = tokens[i]) {
        i += 1;
        switch (token.name) {
        case 'whitespace':
            if (rs.last() && rs.last().is('identifier')) {
                if (tokens[i]) {
                    if (tokens[i].is('argument')) {
                        state.push('call');
                        rs.push(new Token('(', '(', token.line, token.column));
                    } else {
                        if (words('- + ~ *').contains(tokens[i].name) && tokens[i + 1] && !tokens[i + 1].is('whitespace') && !tokens[i + 1].is('LF')) {
                            state.push('call');
                            rs.push(new Token('(', '(', token.line, token.column));
                        }
                    }
                }
            }
            continue;
            break;
        case 'LF':
        case 'if':
        case 'unless':
        case 'while':
        case 'until':
        case 'for':
            if (state.is('call')) {
                state.pop();
                rs.push(new Token(')', ')', token.line, token.column));
            }
            if (token.name === 'LF' && skip()) {
                continue;
            }
            break;
        case '{':
            if (state.is('lambda_def')) {
                state.pop();
                state.push('lambda');
            } else {
                state.push('object');
            }
            break;
        case '}':
            state.pop();
            break;
        case '(':
            state.push('paren');
            break;
        case ')':
            state.pop();
            break;
        case '->':
            state.push('lambda_def');
            break;
        case 'COMMENT':
            continue;
            break;
        case ';':
            rs.push(new Token('LF', null, token.line, token.column));
            continue;
            break;
        case 'EOF':
            while (s = state.pop()) {
                if (s === 'call') {
                    rs.push(new Token(')', ')', token.line, token.column));
                }
                rs.push(token);
            }
            return rs;
        }
        rs.push(token);
    }
    return rs;
};
Lexer.prototype.match = function (str) {
    var self = this;
    var m, name;
    if (m = str.match(COMMENT_RE)) {
        name = 'COMMENT';
    } else if (m = str.match(LINEFEED_RE)) {
        self.linefeed();
        return;
    } else if (m = str.match(SEMICOLON_RE)) {
        name = m[0];
    } else if (m = str.match(BOOL_RE)) {
        name = 'BOOLEAN';
    } else if (m = str.match(NIL_RE)) {
        name = 'NIL';
    } else if (m = str.match(FLOAT_RE)) {
        name = 'NUMBER';
    } else if (m = str.match(INTEGER_RE)) {
        name = 'NUMBER';
    } else if (str.match(REGEXP_RE)) {
        self.regexp(str);
        return;
    } else if (m = str.match(KEYWORDS_RE)) {
        name = m[0];
    } else if (m = str.match(OPERATORS_RE)) {
        name = m[0];
    } else if (m = str.match(PARENS_RE)) {
        name = m[0];
    } else if (m = str.match(IDENTIFIER_RE)) {
        name = 'identifier';
    } else if (m = str.match(WHITESPACE_RE)) {
        name = 'whitespace';
    } else if (str.match(STRING_RE)) {
        self.string(str);
        return;
    } else if (str.match(STRING2_RE)) {
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
    if (self.state.last() === 'string') {
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
    if (self.state.last() === 'string') {
        self.tokens.push(self.token(')', ')'));
        self.consume(-1);
        self.state.pop();
    }
};
Lexer.prototype.embed = function () {
    var self = this;
    if (self.state.last() === 'string') {
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