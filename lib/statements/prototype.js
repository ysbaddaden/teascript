var Identifier, TPrototype, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');
TPrototype = function (name, parent, methods) {
    var self = this;
    if (methods == null) methods = [];
    self.name = name;
    self.parent = parent || null;
    self.methods = methods.filter(function (method) {
        return method.type !== '+';
    });
    self.statics = methods.filter(function (method) {
        return method.type === '+';
    });
};
TPrototype.prototype.compile = function () {
    var self = this;
    var __ref1, __ref2, __ref3, __ref4, __ref5, __ref6, fn, name, rs;
    name = self.name.compile();
    rs = [];
    scopes.withScope(function () {
        if (self.simpleDeclaration() && scopes.isDefined(name)) {
            return;
        }
        rs.push(self.compileConstructor(name, self.getConstructor()));
        if (self.parent) {
            rs.push(("" + (name) + ".prototype = Object.create(" + (self.parent.compile()) + ".prototype);"));
        }
        rs.push(("" + (name) + ".prototype.constructor = " + (name) + ";"));
    });
    __ref1 = self.methods;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        fn = __ref1[__ref2];
        rs.push(fn.compile({
            proto: name
        }));
    }
    __ref4 = self.statics;
    for (__ref5 = 0, __ref6 = __ref4.length; __ref5 < __ref6; __ref5++) {
        fn = __ref4[__ref5];
        rs.push(fn.compile({
            prefix: name
        }));
    }
    return rs.join('');
};
TPrototype.prototype.compileConstructor = function (name, constr) {
    var self = this;
    var args, rs;
    args = constr ? constr.prepareArguments() : {
        body: [],
        definition: []
    };
    rs = [];
    if (self.simpleDeclaration()) {
        rs.push(("function " + (name) + "(" + (args.definition.join(', ')) + ") {"));
    } else {
        rs.push(("" + (name) + " = function (" + (args.definition.join(', ')) + ") {"));
    }
    if (constr && constr.body.statements.length) {
        rs.push('var self = this;');
    }
    rs.push(args.body.join(''));
    if (constr && constr.body) {
        rs.push(constr.body.compile({
            scope: true
        }));
    }
    rs.push('}');
    if (!(self.simpleDeclaration())) {
        rs.push(';');
    }
    return rs.join('');
};
TPrototype.prototype.simpleDeclaration = function () {
    var self = this;
    return self.name instanceof Identifier;
};
TPrototype.prototype.getConstructor = function () {
    var self = this;
    var __ref7, __ref8, i, method;
    __ref7 = self.methods;
    for (i = 0, __ref8 = __ref7.length; i < __ref8; i++) {
        method = __ref7[i];
        if (method.name.value === 'constructor') {
            self.methods.splice(i, 1);
            return method;
        }
    }
};
module.exports = TPrototype;