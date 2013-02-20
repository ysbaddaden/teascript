var Keyword = function () {};
Keyword.prototype.init = function (value) {
    var self = this;
    self.value = value;
    return self;
};
Keyword.prototype.compile = function () {
    var self = this;
    return self.value === 'nil' ? 'null' : self.value;
};
module.exports = Keyword;