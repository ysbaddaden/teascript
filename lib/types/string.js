var Tea;
Tea = require('../tea');

function TString() {}
TString.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};
TString.prototype.compile = function () {
    var self = this;
    return self.value.replace(/\n/g, '\\n');
};
module.exports = TString;