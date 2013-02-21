var globals, ref, scopes;
scopes = [];
ref = 0;
globals = ['arguments', 'console', 'exports', 'module', 'require', 'global', 'window', 'document', 'Array', 'Boolean', 'Date', 'Function', 'Iterator', 'Number', 'Object', 'RegExp', 'String', 'JSON', 'Math', 'ArrayBuffer', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'Error', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'StopIteration', 'SyntaxError', 'TypeError', 'URIError', 'Infinity', 'NaN', 'undefined', 'QName', 'XML', 'XMLList'];

function push() {
    scopes.push([]);
}
function pull() {
    return scopes.pop();
}
function current() {
    return scopes[scopes.length - 1];
}
function withScope(callback) {
    push();
    callback();
    return pull();
}
function isDefined(ident) {
    var __ref1, __ref2, scope;
    for (__ref1 = 0, __ref2 = scopes.length; __ref1 < __ref2; __ref1++) {
        scope = scopes[__ref1];
        if (scope.indexOf(ident) !== -1) {
            return true;
        }
    }
    return false;
}
function isGlobal(ident) {
    return globals.indexOf(ident) !== -1;
}
function pushIdentifier(ident) {
    if (!(isGlobal(ident) || isDefined(ident))) {
        current().push(ident);
    }
}
function reference(options) {
    if (options == null) options = {};
    var ident;
    ident = '__ref' + (ref += 1);
    if (!(options.push === false)) {
        pushIdentifier(ident);
    }
    return ident;
}
function clear() {
    scopes = [];
    ref = 0;
}
function run(callback) {
    var ret;
    clear();
    ret = callback();
    clear();
    return ret;
}
module.exports = {
    push: push,
    pull: pull,
    current: current,
    withScope: withScope,
    isDefined: isDefined,
    isGlobal: isGlobal,
    pushIdentifier: pushIdentifier,
    reference: reference,
    clear: clear,
    run: run
};