var TCall, states;
states = require('../states');
TCall = require('./call');

function Super() {}
Super.prototype.setArguments = function (args) {
    var self = this;
    self.arguments = args;
};
Super.prototype.compile = function () {
    var self = this;
    var method, state;
    state = states.current();
    method = ("" + (state.className) + ".superclass.prototype." + (state.methodName));
    if (self.arguments === undefined) {
        return method + ".apply(self, arguments)";
    }
    TCall.prototype.parseArguments.call(self);
    if (self.splat.length === 1 && self.args.length === 0) {
        return method + '.apply(self, ' + self.splat[0] + ')';
    }
    if (self.splat.length > 0) {
        if (self.args.length > 0) {
            self.splat.push('[' + self.args.join(', ') + ']');
        }
        return method + '.apply(self, Array.prototype.concat.call(' + self.splat.join(', ') + '))';
    }
    if (self.args.length > 0) {
        return method + (".call(self, " + (self.args.join(', ')) + ")");
    }
    return method + ".call(self)";
};
module.exports = Super;