var Dot = function () {};
Dot.prototype.init = function (left, right) {
    var self = this;
    self.left = left;
    self.right = right;
    return self;
};
Dot.prototype.compile = function () {
    var self = this;
    return self.left.compile() + '.' + self.right.compile();
};
module.exports = Dot;