var TRegExp;
TRegExp = function (value) {
    var self = this;
    self.value = value;
};
TRegExp.prototype.compile = function () {
    var self = this;
    return self.value;
};
module.exports = TRegExp;