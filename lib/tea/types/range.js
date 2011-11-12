var TNumber = require("./number");

var TRange = function (type, left, right) {
  if (type == "inclusive") {
    this.inclusive = true;
    this.exclusive = false;
  } else {
    this.inclusive = false;
    this.exclusive = true;
  }
  this.left  = left;
  this.right = right;
}

TRange.prototype.numbers = function () {
  return (this.left.constructor === TNumber && this.right.constructor === TNumber);
}

TRange.prototype.up = function () {
  return this.numbers() && parseInt(this.left.value, 10) <= parseInt(this.right.value, 10);
}

TRange.prototype.from = function () {
  return this.left.toJavaScript();
}

TRange.prototype.to = function () {
  if (this.inclusive) {
    if (this.right.constructor === TNumber) {
      return (parseInt(this.right.value, 10) + 1).toString();
    } else {
      return this.right.toJavaScript() + " + 1";
    }
  } else {
    return this.right.toJavaScript();
  }
}

module.exports = TRange;

