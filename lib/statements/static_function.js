var TFunction;
TFunction = require('./function');

function StaticFunction(name, args, body) {
    var self = this;
    self.fn = new TFunction(name, args, body);
}
StaticFunction.prototype.compile = function (options) {
    var self = this;
    return self.fn.compile({
        prefix: options.objectName
    });
};
module.exports = StaticFunction;