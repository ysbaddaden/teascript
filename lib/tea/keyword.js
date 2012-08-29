TKeyword = function (value) {
  this.value = value;
};

TKeyword.prototype.toJavaScript = function () {
  return this.value;
};

exports.Keyword = TKeyword;

