function LoopStatement() {}
LoopStatement.prototype.init = function (body) {
    var self = this;
    self.body = body;
    return self;
};
LoopStatement.prototype.compile = function () {
    var self = this;
    return 'while (true) {' + self.body.compile() + '}';
};
module.exports = LoopStatement;