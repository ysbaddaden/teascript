var Tea;
Tea = require('../tea');
var TString = function () {};
TString.prototype.init = function (value) {
    var self = this;
    self.type = value.charAt(0);
    self.value = value;
    return self;
};;
TString.prototype.compile = function () {
    var self = this;
    return self.type === '"' ? self.interpolate() : self.escape();
};;
TString.prototype.interpolate = function () {
    var self = this;
    return self.escape().replace(/#\{(.+?)\}/g, function (_, code) {
        var stmt;
        stmt = Tea.compile(code).replace(/;$/, '');
        return self.type + ' + (' + stmt + ') + ' + self.type;
    });
};;
TString.prototype.escape = function () {
    var self = this;
    return self.value.replace(/\n/g, '\\n');
};;
module.exports = TString;