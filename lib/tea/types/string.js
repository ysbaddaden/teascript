var TString = function (value) {
  this.value = value;
}

TString.prototype.toJavaScript = function () {
  return this.value.replace(/\n/g, '\\n');
}

module.exports = TString;

