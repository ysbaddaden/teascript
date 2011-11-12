var TRange = require("./../types/range");

var TIndex = function (left, index) {
  this.left  = left;
  this.index = index;
}

TIndex.prototype.toJavaScript = function () {
  if (this.index.constructor === TRange) {
    return "Array.prototype.slice.call(" +
      this.left + ", " + this.index.from() + ", " + this.index.to() + ")";
  } else {
    return this.left.toJavaScript() + "[" + this.index.toJavaScript() + "]";
  }
}

module.exports = TIndex;

