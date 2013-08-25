var Dot, Operation, Splat, TFunction, scopes;
scopes = require('../scopes');
Splat = require('../expressions/splat');
Dot = require('../expressions/dot');
Operation = require('../expressions/operation');
TFunction = function (name, args, body, parent, type) {
    var self = this;
    self.name = name;
    self.args = args || [];
    self.body = body;
    self.parent = parent;
    self.type = type;
    self.methods = name ? self.extract('-') : [];
    self.statics = name ? self.extract('+') : [];
};
TFunction.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var __ref1, __ref2, __ref3, __ref4, __ref5, __ref6, fn, rs;
    rs = null;
    scopes.withScope(function () {
        rs = self.compileFunction(options);
    });
    __ref1 = self.methods;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        fn = __ref1[__ref2];
        rs += fn.compile({
            objectName: self.fullname
        });
    }
    __ref4 = self.statics;
    for (__ref5 = 0, __ref6 = __ref4.length; __ref5 < __ref6; __ref5++) {
        fn = __ref4[__ref5];
        rs += fn.compile({
            prefix: self.fullname
        });
    }
    return rs;
};
TFunction.prototype.compileFunction = function (options) {
    var self = this;
    var args, rs;
    self.prepareDefinition(options);
    args = self.prepareArguments();
    rs = [];
    if (!(self.isLambda())) {
        rs.push(self.fullname + ' = ');
    }
    rs.push('function ');
    rs.push('(' + args.definition.join(', ') + ') {');
    if (self.isPrototype(options)) {
        rs.push('var self = this;');
    }
    rs.push(args.body.join(''));
    if (self.body) {
        rs.push(self.body.compile({
            scope: true
        }));
    }
    rs.push('}');
    if (!(self.isLambda())) {
        rs.push(';');
    }
    if (self.parent) {
        rs.push(self.fullname + '.prototype = new ' + self.parent.compile() + '();');
        rs.push(self.fullname + '.prototype.constructor = ' + self.fullname + ';');
    }
    return rs.join('');
};
TFunction.prototype.prepareDefinition = function (options) {
    var self = this;
    var name;
    if (self.isLambda()) {
        return;
    }
    name = self.name.compile();
    if (options.objectName) {
        self.fullname = options.objectName + '.prototype.' + name;
    } else if (options.prefix) {
        self.fullname = options.prefix + '.' + name;
    } else if (self.name && self.name instanceof Dot) {
        self.fullname = name;
    } else {
        scopes.pushIdentifier(name, {
            level: 1
        });
        self.fullname = name;
    }
};
TFunction.prototype.prepareArguments = function () {
    var self = this;
    var __ref7, __ref8, __ref9, arg, body, definition, ident, v;
    definition = [];
    body = [];
    __ref7 = self.args;
    for (__ref8 = 0, __ref9 = __ref7.length; __ref8 < __ref9; __ref8++) {
        arg = __ref7[__ref8];
        switch (arg.constructor) {
        case Operation:
            ident = arg.left.compile();
            definition.push(ident);
            body.push('if (' + ident + ' == null) ' + arg.compile() + ';');
            break;
        case Splat:
            scopes.pushIdentifier(ident = arg.compile());
            v = 'Array.prototype.slice.call(arguments, ' + definition.length + ') || []';
            body.push('var ' + ident + ' = ' + v + ';');
            break;
        default:
            scopes.pushIdentifier(arg.compile());
            definition.push(arg.compile());
        }
    }
    return {
        definition: definition,
        body: body
    };
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
TFunction.prototype.isPrototype = function (options) {
    var self = this;
    return options.objectName || ((self.parent || self.methods.length > 0) && self.body.statements.length > 0);
};
TFunction.prototype.isLambda = function () {
    var self = this;
    return !self.name;
};
module.exports = TFunction;