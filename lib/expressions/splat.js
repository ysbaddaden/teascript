function Splat(expression) {
    var self = this;
    self.expression = expression;
}
Splat.prototype.compile = function () {
    var self = this;
    return self.expression.compile();
};
module.exports = Splat;