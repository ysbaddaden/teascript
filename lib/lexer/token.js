var ARGUMENT, KEYWORDS, OPERATORS, Token;
KEYWORDS = require('./definition').KEYWORDS;
OPERATORS = require('./definition').OPERATORS;
ARGUMENT = require('./definition').ARGUMENT;
Token = function (name, value, line, column) {
    var self = this;
    if (line == null) line = null;
    if (column == null) column = null;
    self.name = name;
    self.value = value;
    self.line = line;
    self.column = column;
};
Token.prototype.inspect = function () {
    var self = this;
    var value;
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
module.exports = Token;