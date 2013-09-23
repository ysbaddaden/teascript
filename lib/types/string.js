var Tea;
Tea = require('../tea');

function TString(value) {
    var self = this;
    self.value = value;
}
TString.prototype.constructor = TString;
TString.prototype.compile = function () {
    var self = this;
    return self.value.replace(/\n/g, '\\n');
};
module.exports = TString;