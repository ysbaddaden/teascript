var Tea, scopes, states;
scopes = require('../scopes');
states = require('../states');
Tea = require('../tea');

function ClassStatement(name, inherit, methods) {
    var self = this;
    self.name = name;
    self.inherit = inherit;
    self.methods = methods || [];
}
ClassStatement.prototype.compile = function () {
    var self = this;
    var name, rs;
    rs = [];
    name = self.name.value;
    states.withState({
        className: name
    }, function () {
        var __ref1, __ref2, __ref3, method;
        if (!(scopes.isDefined('__klass'))) {
            scopes.pushIdentifier('__klass');
            rs.push(Tea.CLASS_DEFINITION);
        }
        if (!(scopes.isDefined(name))) {
            scopes.pushIdentifier(name);
            if (self.inherit) {
                rs.push(("" + (name) + " = __klass(" + (self.inherit.compile()) + ");"));
            } else {
                rs.push(("" + (name) + " = __klass();"));
            }
        }
        __ref1 = self.methods;
        for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
            method = __ref1[__ref2];
            if (method) {
                rs.push(method.compile({
                    objectName: self.name.value
                }));
            }
        }
    });
    return rs.join("\n");
};
module.exports = ClassStatement;