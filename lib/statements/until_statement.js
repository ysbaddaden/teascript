var UntilStatement = function () {};
UntilStatement.prototype.init = function (test, body) {
    var self = this;
    self.test = test;
    self.body = body;
    return self;
};
UntilStatement.prototype.compile = function () {
    var self = this;
    return 'while (!(' + self.test.compile() + ')) {' + self.body.compile() + '}';
};
module.exports = UntilStatement;