var TNumber = function () {};
TNumber.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};
TNumber.prototype.compile = function () {
    var self = this;
    if (self.value.charAt(0) === '.') {
        return '0' + self.value.trim();
    }
    return self.value.trim();
};
module.exports = TNumber;