function UnlessStatement() {}
UnlessStatement.prototype.init = function (test, body) {
    var self = this;
    self.test = test;
    self.body = body;
    return self;
};
UnlessStatement.prototype.compile = function () {
    var self = this;
    var rs;
    rs = [];
    rs.push('if (!(' + self.test.compile() + ')) {');
    rs.push(self.body.compile());
    rs.push('}');
    return rs.join('');
};
module.exports = UnlessStatement;