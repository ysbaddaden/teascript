var Dot, Operation, Splat, scopes, states;
scopes = require('../scopes');
states = require('../states');
Splat = require('../expressions/splat');
Dot = require('../expressions/dot');
Operation = require('../expressions/operation');

function TFunction(name, args, body, parent, type) {
    var self = this;
    self.name = name;
    self.args = args || [];
    self.body = body;
    self.parent = parent;
    self.type = type;
    self.methods = name ? self.extract('-') : [];
    self.statics = name ? self.extract('+') : [];
}
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
};
TFunction.prototype.compileFunction = function (options) {
    var self = this;
    var a, b, rs;
    rs = [];
    a = [];
    b = [];
    self.compileArguments(a, b);
    name = self.compileDefinition(rs, a, options);
    if (self.isPrototype(options)) {
        rs.push('var self = this;');
    }
    self.compileBody(rs, b, options);
    if (self.parent) {
        rs.push(name + '.prototype = new ' + self.parent.compile() + '();');
        rs.push(name + '.prototype.constructor = ' + name + ';');
    }
    self.compileMethods(rs, name);
    states.pull();
    return rs.join('');
};
TFunction.prototype.compileArguments = function (a, b) {
    var self = this;
    var __ref1, __ref2, __ref3, arg, ident, v;
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
};
TFunction.prototype.compileDefinition = function (rs, a, options) {
    var self = this;
    var state;
    if (options.objectName) {
        name = self.name.compile();
        state = states.current();
        if (state && state.className && !state.methodName) {
            states.push({
                methodName: name
            });
        }
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
    return name;
};
TFunction.prototype.compileBody = function (rs, b, options) {
    var self = this;
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
};
TFunction.prototype.compileMethods = function (rs, name) {
    var self = this;
    var __ref4, __ref5, __ref6, __ref7, __ref8, __ref9, fn;
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
};
TFunction.prototype.isPrototype = function (options) {
    var self = this;
    return options.objectName || ((self.parent || self.methods.length > 0) && self.body.statements.length > 0);
};
module.exports = TFunction;