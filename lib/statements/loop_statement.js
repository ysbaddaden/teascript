var LoopStatement;
LoopStatement = function (body) {
    var self = this;
    self.body = body;
};
LoopStatement.prototype.compile = function () {
    var self = this;
    return 'while (true) {' + self.body.compile() + '}';
};
module.exports = LoopStatement;