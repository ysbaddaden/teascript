var Statement = function () {};
Statement.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};
Statement.prototype.compile = function () {
    var self = this;
    return self.value.compile() + ';';
};
module.exports = Statement;