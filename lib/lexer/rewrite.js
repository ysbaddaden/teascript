var OPERATORS, SKIP_LF_AFTER, SKIP_LF_BEFORE, Token, rewrite, words;
words = require('./words');
Token = require('./token');
OPERATORS = require('./definition').OPERATORS;
SKIP_LF_AFTER = OPERATORS.concat(words("and or not LF COMMENT ( { [ ,"));
SKIP_LF_AFTER.contains = function (value) {
    return this.indexOf(value) !== -1;
};
SKIP_LF_BEFORE = words(", : ) } ]");
SKIP_LF_BEFORE.contains = function (value) {
    return this.indexOf(value) !== -1;
};
rewrite = function (tokens) {
    var i, lst, next_token, prev, rs, s, skip, state, token;
    i = 0;
    rs = [];
    rs.last = function () {
        return this[this.length - 1];
    };
    state = [];
    state.is = function (name) {
        return this[this.length - 1] === name;
    };
    next_token = function () {
        if (tokens[i] && !tokens[i].is('whitespace')) {
            return tokens[i];
        } else {
            return tokens[i + 1];
        }
    };
    skip = function () {
        var lst;
        lst = rs.last();
        return (lst && SKIP_LF_AFTER.contains(lst.name)) || (next_token() && SKIP_LF_BEFORE.contains(next_token().name));
    };
    while (token = tokens[i]) {
        i += 1;
        switch (token.name) {
        case 'whitespace':
            lst = rs.last();
            if (lst && lst.is('identifier') && tokens[i]) {
                if (tokens[i].is('argument')) {
                    state.push('call');
                    rs.push(new Token('(', '(', token.line, token.column));
                } else if (words('- + ~ *').contains(tokens[i].name) && tokens[i + 1] && !tokens[i + 1].is('whitespace') && !tokens[i + 1].is('LF')) {
                    state.push('call');
                    rs.push(new Token('(', '(', token.line, token.column));
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
        case 'def':
        case 'delete':
        case 'then':
        case 'end':
        case 'loop':
        case 'own':
        case 'when':
        case 'next':
        case 'begin':
        case 'rescue':
        case 'ensure':
        case 'and':
        case 'or':
        case 'not':
            lst = rs.last();
            if ((lst && (lst.name === '.' || lst.name === 'def')) || (next_token() && next_token().name === ':')) {
                rs.push(new Token('identifier', token.name, token.line, token.column));
                continue;
            }
            prev = rs.slice(-2);
            if (prev.length === 2 && prev[0].name === 'def' && prev[1].name === '+') {
                rs.push(new Token('identifier', token.name, token.line, token.column));
                continue;
            }
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
module.exports = rewrite;