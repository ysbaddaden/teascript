var TObject = function () {};
TObject.prototype.init = function (declarations) {
    var self = this;
    self.declarations = declarations || [];
    return self;
};
TObject.prototype.compile = function () {
    var self = this;
    var declarations;
    declarations = self.declarations.map(function (decl) {
        return decl.compile();
    });
    return "{" + declarations.join(", ") + "}";
};
module.exports = TObject;