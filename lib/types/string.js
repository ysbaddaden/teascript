var Tea;
Tea = require('../tea');
var TString = function () {};
TString.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};;
TString.prototype.compile = function () {
    var self = this;
    return self.value.replace(/\n/g, '\\n');
};;
module.exports = TString;