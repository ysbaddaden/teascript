var TString, Tea;
Tea = require('../tea');
TString = function (value) {
    var self = this;
    self.value = value;
};
TString.prototype.compile = function () {
    var self = this;
    return self.value.replace(/\n/g, '\\n');
};
module.exports = TString;