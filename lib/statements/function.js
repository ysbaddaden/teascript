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
    var rs, run, state;
    rs = null;
    run = function () {
        var __ref1, __ref2, __ref3, __ref4, __ref5, __ref6, fn;
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
    };
    if (options.objectName) {
        state = states.current();
        if (state && state.className) {
            states.withState({
                methodName: self.name.compile()
            }, run);
        }
    }
    if (!(rs)) {
        run();
    }
    return rs;
};
TFunction.prototype.compileFunction = function (options) {
    var self = this;
    var args, body, rs;
    args = self.prepareArguments();
    rs = [];
    rs.push(self.definition(options));
    rs.push('(' + args.definition.join(', ') + ') {');
    if (self.isPrototype(options)) {
        rs.push('var self = this;');
    }
    if (args.body.length > 0) {
        rs.push(args.body.join(''));
    }
    if (self.body) {
        body = self.body.compile({
            scope: true
        });
        if (body.length > 0) {
            rs.push(body);
        }
    }
    rs.push('}');
    if (!(self.isLambda() || self.isDirectDefinition(options))) {
        rs.push(';');
    }
    if (self.parent) {
        rs.push(self.fullname + '.prototype = new ' + self.parent.compile() + '();');
        rs.push(self.fullname + '.prototype.constructor = ' + self.fullname + ';');
    }
    return rs.join('');
};
TFunction.prototype.definition = function (options) {
    var self = this;
    self.prepareDefinition(options);
    if (self.isDirectDefinition(options)) {
        return 'function ' + self.fullname;
    }
    if (self.isLambda()) {
        return 'function ';
    }
    return self.fullname + ' = function ';
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
TFunction.prototype.isDirectDefinition = function (options) {
    var self = this;
    return !options.prefix && !options.objectName && self.name && !(self.name instanceof Dot);
};
module.exports = TFunction;