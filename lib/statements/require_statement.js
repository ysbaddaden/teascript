var RequireStatement = function () {};
RequireStatement.prototype.init = function (expression) {
    var self = this;
    self.expression = expression;
    return self;
};
RequireStatement.prototype.compile = function () {
    var self = this;
    return 'require(' + self.expression.compile() + ')';
};
module.exports = RequireStatement;