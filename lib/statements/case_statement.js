function CaseStatement() {}
CaseStatement.prototype.init = function (test, whenStatements) {
    var self = this;
    self.test = test;
    self.whenStatements = whenStatements || [];
    return self;
};
CaseStatement.prototype.compile = function () {
    var self = this;
    var rs;
    rs = self.whenStatements.reduce(function (rs, stmt) {
        return rs.concat(stmt.compile({
            'case': true
        }));
    }, []);
    return 'switch (' + self.test.compile() + ') {' + rs.join('') + '}';
};
module.exports = CaseStatement;