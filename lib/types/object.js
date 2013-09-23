function TObject(declarations) {
    var self = this;
    self.declarations = declarations || [];
}
TObject.prototype.constructor = TObject;
TObject.prototype.compile = function () {
    var self = this;
    var declarations;
    declarations = self.declarations.map(function (decl) {
        return decl.compile();
    });
    return "{" + declarations.join(", ") + "}";
};
module.exports = TObject;