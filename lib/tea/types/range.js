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

TRange.prototype.from = function () {
  return this.left;
}

TRange.prototype.from = function () {
  if (inclusive) {
    return this.right;
  } else {
    return this.right + " + 1";
  }
}

module.exports = TRange;

