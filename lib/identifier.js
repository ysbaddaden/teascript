var Identifier = function () {};
Identifier.prototype.init = function (value) {
    var self = this;
    if (new RegExp('^__').test(value)) {
        throw Error("ERROR: invalid identifier '" + value + "'; identifiers starting with '__' are reserved.");
    }
    self.value = value;
    return self;
};
Identifier.prototype.compile = function () {
    var self = this;
    return self.value;
};
module.exports = Identifier;