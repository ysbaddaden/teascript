var Splat;
Splat = require('./splat');

function Call(expression, args) {
    var self = this;
    self.init(expression, args);
}
Call.prototype.constructor = Call;
Call.prototype.init = function (expression, args) {
    var self = this;
    self.expression = expression;
    self.arguments = args || [];
};
Call.prototype.callerName = function () {
    var self = this;
    return self.expression.compile();
};
Call.prototype.compile = function () {
    var self = this;
    self.parseArguments();
    if (self.splat.length === 1 && self.args.length === 0) {
        return self.callerName() + '.apply(null, ' + self.splat[0] + ')';
    }
    if (self.splat.length > 0) {
        if (self.args.length > 0) {
            self.splat.push('[' + self.args.join(', ') + ']');
        }
        return self.callerName() + '.apply(null, Array.prototype.concat.call(' + self.splat.join(', ') + '))';
    }
    return self.callerName() + '(' + self.args.join(', ') + ')';
};
Call.prototype.parseArguments = function () {
    var self = this;
    var __ref1, __ref2, __ref3, decl;
    self.args = [];
    self.splat = [];
    __ref1 = self.arguments;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        decl = __ref1[__ref2];
        if (decl.constructor === Splat) {
            if (self.args.length > 0) {
                self.splat.push('[' + self.args.join(', ') + ']');
            }
            self.splat.push(decl.compile());
            self.args = [];
        } else {
            self.args.push(decl.compile());
        }
    }
};
module.exports = Call;