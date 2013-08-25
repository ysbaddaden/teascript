var Call, NewExpression, Splat, splatConstructorTemplate;
Splat = require('./splat');
Call = require('./call');
splatConstructorTemplate = "(function (fn, args, ctor) {\n      ctor.constructor = fn.constructor;\n      var child = new ctor(), result = fn.apply(child, args), t = typeof result;\n      return (t == 'object' || t == 'function') result || child : child;\n  }(%{FUNCTION}, %{ARGS}, function () {}))";
NewExpression = function (expression, args) {
    var self = this;
    self.init(expression, args);
};
NewExpression.prototype = new Call();
NewExpression.prototype.constructor = NewExpression;
NewExpression.prototype.compile = function () {
    var self = this;
    self.parseArguments();
    if (self.splat.length > 0) {
        if (self.args.length > 0) {
            self.splat.push('[' + self.args.join(', ') + ']');
        }
        return splatConstructorTemplate.replace(/(%\{(.+?)\})/g, function (x) {
            switch (x) {
            case '%{FUNCTION}':
                return self.expression.compile();
            case '%{ARGS}':
                return '[].concat(' + self.splat.join(',') + ')';
            }
        });
    }
    return 'new ' + self.expression.compile() + '(' + self.args.join(', ') + ')';
};
module.exports = NewExpression;