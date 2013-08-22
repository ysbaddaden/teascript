var Identifier;
Identifier = require('../identifier');

function TAssoc(left, right) {
    var self = this;
    self.left = left;
    self.right = right;
}
TAssoc.prototype.compile = function () {
    var self = this;
    var left;
    left = self.left instanceof Identifier ? self.left.value : self.left.compile();
    return left + ": " + self.right.compile();
};
module.exports = TAssoc;