var TRange;
TRange = require('../types/range');

function Index() {}
Index.prototype.init = function (left, index) {
    var self = this;
    self.left = left;
    self.index = index;
    return self;
};
Index.prototype.compile = function () {
    var self = this;
    if (self.index.constructor === TRange) {
        return 'Array.prototype.slice.call(' + self.left.compile() + ', ' + self.index.from() + ', ' + self.index.to() + ')';
    }
    return self.left.compile() + '[' + self.index.compile() + ']';
};
module.exports = Index;