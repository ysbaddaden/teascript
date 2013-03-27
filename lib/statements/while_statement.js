function WhileStatement() {}
WhileStatement.prototype.init = function (test, body) {
    var self = this;
    self.test = test;
    self.body = body;
    return self;
};
WhileStatement.prototype.compile = function () {
    var self = this;
    return 'while (' + self.test.compile() + ') {' + self.body.compile() + '}';
};
module.exports = WhileStatement;