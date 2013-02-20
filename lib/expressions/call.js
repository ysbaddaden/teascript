var Splat;
Splat = require('./splat');
var Call = function () {};
Call.prototype.init = function (expression, args) {
    var self = this;
    self.expression = expression;
    self.args = args || [];
    return self;
};
Call.prototype.callerName = function () {
    var self = this;
    return self.expression.compile();
};
Call.prototype.pushArg = function (arg) {
    var self = this;
    self.args.push(arg);
};
Call.prototype.compile = function () {
    var self = this;
    var __ref1, __ref2, __ref3, args, decl, splat;
    args = [];
    splat = [];
    __ref1 = self.args;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        decl = __ref1[__ref2];
        if (decl.constructor === Splat) {
            if (args.length > 0) {
                splat.push('[' + args.join(', ') + ']');
            }
            splat.push(decl.compile());
            args = [];
        } else {
            args.push(decl.compile());
        }
    }
    if (splat.length === 1 && args.length === 0) {
        return self.callerName() + '.apply(null, ' + splat[0] + ')';
    }
    if (splat.length > 0) {
        if (args.length > 0) {
            splat.push('[' + args.join(', ') + ']');
        }
        return self.callerName() + '.apply(null, Array.prototype.concat.call(' + splat.join(', ') + '))';
    }
    return self.callerName() + '(' + args.join(', ') + ')';
};
module.exports = Call;