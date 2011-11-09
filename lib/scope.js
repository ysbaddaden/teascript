var scopes  = [];
var globals = [ "exports", "require", "global", "window", "document", "console" ];

exports.push = function () {
  scopes.push([]);
}

exports.pull = function () {
  return scopes.pop();
}

exports.current = function () {
  return scopes[scopes.length - 1];
}

exports.withScope = function (callback) {
  exports.push();
  callback();
  return exports.pull();
}

exports.isDefined = function (ident) {
  var i = scopes.length;
  while (i--) {
    if (scopes[i].indexOf(ident) != -1) {
      return true;
    }
  }
  return false;
}

exports.pushIdentifier = function (ident) {
  if (globals.indexOf(ident) == -1 && !exports.isDefined(ident)) {
    exports.current().push(ident);
  }
}

