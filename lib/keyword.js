function Keyword(value) {
    var self = this;
    self.value = value;
}
Keyword.prototype.constructor = Keyword;
Keyword.prototype.compile = function () {
    var self = this;
    return self.value === 'nil' ? 'null' : self.value;
};
module.exports = Keyword;