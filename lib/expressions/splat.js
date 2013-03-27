function Splat() {}
Splat.prototype.init = function (expression) {
    var self = this;
    self.expression = expression;
    return self;
};
Splat.prototype.compile = function () {
    var self = this;
    return self.expression.compile();
};
module.exports = Splat;