var ReturnStatement;
ReturnStatement = require('./return_statement');

function WhenStatement(tests, body) {
    var self = this;
    self.tests = tests;
    self.body = body;
}
WhenStatement.prototype.constructor = WhenStatement;
WhenStatement.prototype.compile = function () {
    var self = this;
    var _break, body, rs;
    body = self.body.compile();
    _break = self.body.lastStatement() instanceof ReturnStatement ? '' : 'break;';
    rs = self.tests.map(function (expr) {
        return 'case ' + expr.compile() + ':';
    });
    return rs.join('') + body + _break;
};
module.exports = WhenStatement;