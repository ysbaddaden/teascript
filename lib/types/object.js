function TObject(declarations) {
    var self = this;
    self.declarations = declarations || [];
}
TObject.prototype.compile = function () {
    var self = this;
    declarations = self.declarations.map(function (decl) {
        return decl.compile();
    });
    return "{" + declarations.join(", ") + "}";
};
module.exports = TObject;