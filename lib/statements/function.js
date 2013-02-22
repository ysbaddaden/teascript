var Dot, Operation, Splat, scopes;
scopes = require('../scopes');
Splat = require('../expressions/splat');
Dot = require('../expressions/dot');
Operation = require('../expressions/operation');
var TFunction = function () {};
TFunction.prototype.init = function (name, args, body, parent) {
    var self = this;
    self.name = name;
    self.args = args || [];
    self.body = body;
    self.parent = parent;
    return self;
};
TFunction.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var rs;
    rs = null;
    scopes.withScope(function () {
        rs = self.compileFunction(options);
    });
    return rs;
};
TFunction.prototype.compileFunction = function (options) {
    var self = this;
    var __ref1, __ref2, __ref3, a, arg, b, body, ident, name, rs, v;
    rs = [];
    a = [];
    b = [];
    body = [];
    __ref1 = self.args;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        arg = __ref1[__ref2];
        switch (arg.constructor) {
        case Operation:
            ident = arg.left.compile();
            a.push(ident);
            b.push('if (' + ident + ' == null) ' + arg.compile() + ';');
            break;
        case Splat:
            scopes.pushIdentifier(ident = arg.compile());
            v = 'Array.prototype.slice.call(arguments, ' + a.length + ') || []';
            b.push('var ' + ident + ' = ' + v + ';');
            break;
        default:
            scopes.pushIdentifier(arg.compile());
            a.push(arg.compile());
        }
    }
    if (options.objectName) {
        name = self.name.compile();
        rs.push(options.objectName + '.prototype.' + name + ' = function (' + a.join(', ') + ') {');
        rs.push('var self = this;');
    } else if (options.prefix) {
        name = self.name.compile();
        rs.push(options.prefix + '.' + name + ' = function (' + a.join(', ') + ') {');
    } else if (self.name && self.name instanceof Dot) {
        name = self.name.compile();
        rs.push(name + ' = function (' + a.join(', ') + ') {');
    } else {
        name = self.name ? self.name.compile() : '';
        rs.push('function ' + name + '(' + a.join(', ') + ') {');
    }
    if (self.body) {
        body = self.body.compile({
            scope: true
        });
    }
    if (body.length > 0 || b.length > 0) {
        rs.push(b.join(''));
        rs.push(body);
    }
    if (self.name && self.name instanceof Dot) {
        rs.push('};');
    } else {
        rs.push('}');
    }
    return rs.join('');
};
module.exports = TFunction;