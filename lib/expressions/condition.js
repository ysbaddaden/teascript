var Condition = function () {};
Condition.prototype.init = function (condition, a, b) {
    var self = this;
    self.condition = condition;
    self.a = a;
    self.b = b;
    return self;
};
Condition.prototype.compile = function () {
    var self = this;
    return self.condition.compile() + ' ? ' + self.a.compile() + ' : ' + self.b.compile();
};
module.exports = Condition;