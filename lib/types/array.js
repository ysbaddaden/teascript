function TArray() {}
TArray.prototype.init = function (declaration) {
    var self = this;
    self.declaration = declaration || [];
    return self;
};
TArray.prototype.compile = function () {
    var self = this;
    var declaration;
    declaration = self.declaration.map(function (decl) {
        return decl.compile();
    });
    return "[" + declaration.join(", ") + "]";
};

function TArray2(declaration) {
    self.declaration = declaration;
}
TArray2.prototype.compile = function () {
    var self = this;
    declaration = self.declaration.map(function (decl) {
        return decl.compile();
    });
    return "[" + declaration.join(", ") + "]";
};
module.exports = TArray;