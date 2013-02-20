var UnlessStatement = function () {};
UnlessStatement.prototype.init = function (test, body, alternative) {
    var self = this;
    self.test = test;
    self.body = body || new T.Body();
    self.alternative = alternative;
    return self;
};
UnlessStatement.prototype.compile = function () {
    var self = this;
    var rs;
    rs = [];
    rs.push('if (!(' + self.test.compile() + ')) {');
    rs.push(self.body.compile());
    if (typeof self.alternative !== 'undefined') {
        rs = rs.concat(self.alternative.compile());
    }
    rs.push('}');
    return rs.join('');
};
module.exports = UnlessStatement;