var TFunction;
TFunction = require('./function');
var StaticFunction = function () {};
StaticFunction.prototype.init = function (name, args, body) {
    var self = this;
    self.fn = (new TFunction()).init(name, args, body);
    return self;
};
StaticFunction.prototype.compile = function (options) {
    var self = this;
    return self.fn.compile({
        prefix: options.objectName
    });
};
module.exports = StaticFunction;