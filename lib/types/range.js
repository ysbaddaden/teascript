var TNumber;
TNumber = require('./number');
var TRange = function () {};
TRange.prototype.init = function (type, left, right) {
    var self = this;
    self.exclusive = !(self.inclusive = type === 'inclusive');
    self.left = left;
    self.right = right;
    return self;
};
TRange.prototype.numbers = function () {
    var self = this;
    return (self.left.constructor === TNumber && self.right.constructor === TNumber);
};
TRange.prototype.up = function () {
    var self = this;
    return (self.numbers() && parseInt(self.left.value, 10) <= parseInt(self.right.value, 10));
};
TRange.prototype.from = function () {
    var self = this;
    return self.left.compile();
};
TRange.prototype.to = function () {
    var self = this;
    if (!(self.inclusive)) {
        return self.right.compile();
    }
    if (!(self.right.constructor === TNumber)) {
        return self.right.compile() + " + 1";
    }
    return (parseInt(self.right.value, 10) + 1).toString();
};
module.exports = TRange;