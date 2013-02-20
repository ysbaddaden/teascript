var Identifier, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');
var TPrototype = function () {};
TPrototype.prototype.init = function (name, parent, methods) {
    var self = this;
    self.objectName = name;
    self.parentName = parent;
    self.methods = methods || [];
    return self;
};
TPrototype.prototype.compile = function () {
    var self = this;
    var rs;
    rs = [];
    scopes.withScope(function () {
        var __ref1, __ref2, __ref3, fn, name;
        name = self.objectName.compile();
        if (self.objectName instanceof Identifier) {
            scopes.pushIdentifier(self.objectName.value);
            rs.push('var ' + name + ' = function () {};');
        } else {
            rs.push(name + ' = function () {};');
        }
        if (self.parentName) {
            rs.push(name + '.prototype = new ' + self.parentName.compile() + '();');
        }
        __ref1 = self.methods;
        for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
            fn = __ref1[__ref2];
            rs.push(fn.compile({
                objectName: name
            }) + ';');
        }
    });
    return rs.join('');
};
module.exports = TPrototype;