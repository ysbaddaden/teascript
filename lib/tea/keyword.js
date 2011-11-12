TKeyword = function (value) {
  this.value = value;
}

TKeyword.prototype.toJavaScript = function () {
  return this.value;
}

module.exports = TKeyword;

