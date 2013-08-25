var UntilStatement;
UntilStatement = function (test, body) {
    var self = this;
    self.test = test;
    self.body = body;
};
UntilStatement.prototype.compile = function () {
    var self = this;
    return 'while (!(' + self.test.compile() + ')) {' + self.body.compile() + '}';
};
module.exports = UntilStatement;