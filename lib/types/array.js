function TArray(declaration) {
    var self = this;
    self.declaration = declaration || [];
}
TArray.prototype.constructor = TArray;
TArray.prototype.compile = function () {
    var self = this;
    var declaration;
    declaration = self.declaration.map(function (decl) {
        return decl.compile();
    });
    return "[" + declaration.join(", ") + "]";
};
module.exports = TArray;