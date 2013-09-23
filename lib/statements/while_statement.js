function WhileStatement(test, body) {
    var self = this;
    self.test = test;
    self.body = body;
}
WhileStatement.prototype.constructor = WhileStatement;
WhileStatement.prototype.compile = function () {
    var self = this;
    return 'while (' + self.test.compile() + ') {' + self.body.compile() + '}';
};
module.exports = WhileStatement;