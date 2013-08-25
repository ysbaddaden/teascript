var Keyword;
Keyword = function (value) {
    var self = this;
    self.value = value;
};
Keyword.prototype.compile = function () {
    var self = this;
    return self.value === 'nil' ? 'null' : self.value;
};
module.exports = Keyword;