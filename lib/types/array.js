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
module.exports = TArray;