var Dot, Operation, Splat, scopes;
scopes = require('../scopes');
Splat = require('../expressions/splat');
Dot = require('../expressions/dot');
Operation = require('../expressions/operation');

function TFunction(name, args, body, type) {
    var self = this;
    self.name = name;
    self.args = args || [];
    self.body = body;
    self.type = type;
}
TFunction.prototype.constructor = TFunction;
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
    var args, rs;
    self.prepareDefinition(options);
    args = self.prepareArguments();
    rs = [];
    if (!(self.isLambda())) {
        rs.push(self.fullname + ' = ');
    }
    rs.push('function ');
    rs.push('(' + args.definition.join(', ') + ') {');
    if (options.proto) {
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
    return rs.join('');
};
TFunction.prototype.prepareDefinition = function (options) {
    var self = this;
    var name;
    if (self.isLambda()) {
        return;
    }
    name = self.name.compile();
    if (options.proto) {
        self.fullname = options.proto + '.prototype.' + name;
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
    var __ref1, __ref2, __ref3, arg, body, definition, ident, v;
    definition = [];
    body = [];
    __ref1 = self.args;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        arg = __ref1[__ref2];
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
TFunction.prototype.isLambda = function () {
    var self = this;
    return !self.name;
};
module.exports = TFunction;