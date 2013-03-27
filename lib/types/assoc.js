var Identifier;
Identifier = require('../identifier');

function TAssoc() {}
TAssoc.prototype.init = function (left, right) {
    var self = this;
    self.left = left;
    self.right = right;
    return self;
};
TAssoc.prototype.compile = function () {
    var self = this;
    var left;
    left = self.left instanceof Identifier ? self.left.value : self.left.compile();
    return left + ": " + self.right.compile();
};
module.exports = TAssoc;