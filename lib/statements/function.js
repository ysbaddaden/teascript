var Dot, Operation, Splat, scopes;
scopes = require('../scopes');
Splat = require('../expressions/splat');
Dot = require('../expressions/dot');
Operation = require('../expressions/operation');
var TFunction = function () {};
TFunction.prototype.init = function (name, args, body, parent, type) {
    var self = this;
    self.name = name;
    self.args = args || [];
    self.body = body;
    self.parent = parent;
    self.type = type;
    self.methods = self.extract('-');
    self.statics = self.extract('+');
    return self;
};;
TFunction.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var rs;
    rs = null;
    scopes.withScope(function () {
        rs = self.compileFunction(options);
    });
    return rs;
};;
TFunction.prototype.extract = function (type) {
    var self = this;
    var i, rs, stmt;
    rs = [];
    i = self.body.statements.length;
    while (!(i < 0)) {
        i -= 1;
        stmt = self.body.statements[i];
        if (stmt && stmt instanceof TFunction) {
            if (!(stmt.type)) {
                stmt.type = '-';
            }
            if (stmt.type === type) {
                rs.unshift(stmt);
                self.body.statements.splice(i, 1);
            }
        }
    }
    return rs;
};;
TFunction.prototype.compileFunction = function (options) {
    var self = this;
    var __ref1, __ref2, __ref3, __ref4, __ref5, __ref6, __ref7, __ref8, __ref9, a, arg, b, body, fn, ident, name, rs, v;
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
    if (options.objectName || ((self.parent || self.methods.length > 0) && self.body.statements.length > 0)) {
        rs.push('var self = this;');
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
    if (options.objectName || options.prefix || (self.name && self.name instanceof Dot)) {
        rs.push('};');
    } else {
        rs.push('}');
    }
    if (self.parent) {
        rs.push(name + '.prototype = new ' + self.parent.compile() + '();');
    }
    __ref4 = self.methods;
    for (__ref5 = 0, __ref6 = __ref4.length; __ref5 < __ref6; __ref5++) {
        fn = __ref4[__ref5];
        rs.push(fn.compile({
            objectName: name
        }));
    }
    __ref7 = self.statics;
    for (__ref8 = 0, __ref9 = __ref7.length; __ref8 < __ref9; __ref8++) {
        fn = __ref7[__ref8];
        rs.push(fn.compile({
            prefix: name
        }));
    }
    return rs.join('');
};;
module.exports = TFunction;