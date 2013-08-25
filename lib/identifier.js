var Identifier;
Identifier = function (value) {
    var self = this;
    self.value = value;
    self.refute_reserved();
};
Identifier.prototype.refute_reserved = function () {
    var self = this;
    if (/^__/.test(self.value)) {
        throw new Error("ERROR: invalid identifier '" + self.value + "'; identifiers starting with '__' are reserved.");
    }
};
Identifier.prototype.compile = function () {
    var self = this;
    return self.value;
};
module.exports = Identifier;