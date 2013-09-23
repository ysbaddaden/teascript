function TRegExp(value) {
    var self = this;
    self.value = value;
}
TRegExp.prototype.constructor = TRegExp;
TRegExp.prototype.compile = function () {
    var self = this;
    return self.value;
};
module.exports = TRegExp;