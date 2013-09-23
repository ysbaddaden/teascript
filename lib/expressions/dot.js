function Dot(left, right) {
    var self = this;
    self.left = left;
    self.right = right;
}
Dot.prototype.constructor = Dot;
Dot.prototype.compile = function () {
    var self = this;
    return self.left.compile() + '.' + self.right.compile();
};
module.exports = Dot;