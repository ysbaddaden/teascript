var scopes  = [];
var globals = [
  "arguments",
//  "this",
  "console",
  "exports", "module", "require",
  "global", "window", "document",
  "Array", "Boolean", "Date", "Function", "Iterator", "Number", "Object",
  "RegExp", "String", "JSON", "Math",
  "ArrayBuffer", "Float32Array", "Float64Array", "Int16Array", "Int32Array",
  "Int8Array", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray",
  "Error", "EvalError", "InternalError", "RangeError", "ReferenceError",
  "StopIteration", "SyntaxError", "TypeError", "URIError",
  "Infinity", "NaN", "undefined",
  "QName", "XML", "XMLList"
];
var ref = 0;

exports.push = function () {
  scopes.push([]);
};

exports.pull = function () {
  return scopes.pop();
};

exports.current = function () {
  return scopes[scopes.length - 1];
};

exports.withScope = function (callback) {
  exports.push();
  callback();
  return exports.pull();
};

exports.isDefined = function (ident) {
  var i = scopes.length;
  while (i--) {
    if (scopes[i].indexOf(ident) != -1) {
      return true;
    }
  }
  return false;
};

exports.pushIdentifier = function (ident) {
  if (globals.indexOf(ident) === -1 && !exports.isDefined(ident)) {
    exports.current().push(ident);
  }
};

exports.reference = function () {
  var ident = "__ref" + (ref += 1);
  exports.pushIdentifier(ident);
  return ident;
};

exports.clear = function () {
  scopes = [];
  ref = 0;
};

exports.run = function (callback) {
  exports.clear();
  callback();
  exports.clear();
};
