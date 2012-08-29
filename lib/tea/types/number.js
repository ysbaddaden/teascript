var TNumber = function (value) {
  this.value = value;
};

TNumber.prototype.toJavaScript = function () {
  if (this.value.match(/^\./)) {
    return "0" + this.value; // disambiguates float numbers like .125
  } else {
    return this.value;
  }
};

exports.Number = TNumber;

