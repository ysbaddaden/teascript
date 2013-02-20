var WhenStatement = function () {};
WhenStatement.prototype.init = function (tests, body) {
    var self = this;
    self.tests = tests;
    self.body = body;
    return self;
};
WhenStatement.prototype.compile = function () {
    var self = this;
    var body, rs;
    body = self.body.compile() + 'break;';
    rs = self.tests.map(function (expr) {
        return 'case ' + expr.compile() + ':';
    });
    return rs.join('') + body;
};
module.exports = WhenStatement;