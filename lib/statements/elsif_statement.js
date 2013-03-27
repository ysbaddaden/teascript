function ElsifStatement() {}
ElsifStatement.prototype.init = function (test, body) {
    var self = this;
    self.test = test;
    self.body = body;
    return self;
};
ElsifStatement.prototype.compile = function () {
    var self = this;
    return '} else if (' + self.test.compile() + ') {' + self.body.compile();
};
module.exports = ElsifStatement;