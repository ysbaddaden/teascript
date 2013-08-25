var Paren;
Paren = function (expression) {
    var self = this;
    self.expression = expression;
};
Paren.prototype.compile = function () {
    var self = this;
    return '(' + self.expression.compile() + ')';
};
module.exports = Paren;