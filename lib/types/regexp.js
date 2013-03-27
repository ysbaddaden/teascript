function TRegExp() {}
TRegExp.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};
TRegExp.prototype.compile = function () {
    var self = this;
    return self.value;
};
module.exports = TRegExp;