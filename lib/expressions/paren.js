var Paren = function () {};
Paren.prototype.init = function (expression) {
    var self = this;
    self.expression = expression;
    return self;
};
Paren.prototype.compile = function () {
    var self = this;
    return '(' + self.expression.compile() + ')';
};
module.exports = Paren;