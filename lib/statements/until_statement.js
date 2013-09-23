function UntilStatement(test, body) {
    var self = this;
    self.test = test;
    self.body = body;
}
UntilStatement.prototype.constructor = UntilStatement;
UntilStatement.prototype.compile = function () {
    var self = this;
    return 'while (!(' + self.test.compile() + ')) {' + self.body.compile() + '}';
};
module.exports = UntilStatement;