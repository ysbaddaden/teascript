var Splat, splatConstructorTemplate;
Splat = require('./splat');
splatConstructorTemplate = "(function (fn, args, ctor) {\n      ctor.constructor = fn.constructor;\n      var child = new ctor(), result = fn.apply(child, args), t = typeof result;\n      return (t == 'object' || t == 'function') result || child : child;\n  }(%{FUNCTION}, %{ARGS}, function () {}))";

function NewExpression() {}
NewExpression.prototype.init = function (expression, args) {
    var self = this;
    self.expression = expression;
    self.args = args || [];
    return self;
};
NewExpression.prototype.compile = function () {
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
    if (splat.length > 0) {
        if (args.length > 0) {
            splat.push('[' + args.join(', ') + ']');
        }
        return splatConstructorTemplate.replace(/(%\{(.+?)\})/g, function (x) {
            switch (x) {
            case '%{FUNCTION}':
                return self.expression.compile();
            case '%{ARGS}':
                return '[].concat(' + splat.join(',') + ')';
            }
        });
    }
    return 'new ' + self.expression.compile() + '(' + args.join(', ') + ')';
};
module.exports = NewExpression;