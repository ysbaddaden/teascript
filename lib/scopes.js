var clear, current, globals, isDefined, isGlobal, parent, pull, push, pushIdentifier, ref, reference, run, scopes, withScope;
scopes = [];
ref = 0;
globals = ['arguments', 'console', 'exports', 'module', 'require', 'global', 'window', 'document', 'Array', 'Boolean', 'Date', 'Function', 'Iterator', 'Number', 'Object', 'RegExp', 'String', 'JSON', 'Math', 'ArrayBuffer', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'Error', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'StopIteration', 'SyntaxError', 'TypeError', 'URIError', 'Infinity', 'NaN', 'undefined', 'QName', 'XML', 'XMLList'];
push = function () {
    scopes.push([]);
};
pull = function () {
    return scopes.pop();
};
parent = function (level) {
    if (level == null) level = 1;
    var idx;
    idx = Math.max(0, scopes.length - level - 1);
    return scopes[idx];
};
current = function () {
    return scopes[scopes.length - 1];
};
withScope = function (callback) {
    push();
    callback();
    return pull();
};
isDefined = function (ident) {
    var __ref1, __ref2, scope;
    for (__ref1 = 0, __ref2 = scopes.length; __ref1 < __ref2; __ref1++) {
        scope = scopes[__ref1];
        if (scope.indexOf(ident) !== -1) {
            return true;
        }
    }
    return false;
};
isGlobal = function (ident) {
    return globals.indexOf(ident) !== -1;
};
pushIdentifier = function (ident, options) {
    if (options == null) options = {};
    var scope;
    scope = parent(options.level || 0);
    if (!(isGlobal(ident) || isDefined(ident))) {
        scope.push(ident);
    }
};
reference = function (options) {
    if (options == null) options = {};
    var ident;
    ident = '__ref' + (ref += 1);
    if (!(options.push === false)) {
        pushIdentifier(ident);
    }
    return ident;
};
clear = function () {
    scopes = [];
    ref = 0;
};
run = function (callback) {
    var ret;
    clear();
    ret = callback();
    clear();
    return ret;
};
module.exports = {
    push: push,
    pull: pull,
    current: current,
    parent: parent,
    withScope: withScope,
    isDefined: isDefined,
    isGlobal: isGlobal,
    pushIdentifier: pushIdentifier,
    reference: reference,
    clear: clear,
    run: run
};