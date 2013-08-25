var Statement;
Statement = function (value) {
    var self = this;
    self.value = value;
};
Statement.prototype.compile = function () {
    var self = this;
    return self.value.compile() + ';';
};
module.exports = Statement;