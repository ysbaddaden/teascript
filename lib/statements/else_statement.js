function ElseStatement(body) {
    var self = this;
    self.body = body;
}
ElseStatement.prototype.constructor = ElseStatement;
ElseStatement.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    if (options['case']) {
        return 'default:' + self.body.compile() + '\n';
    } else {
        return '} else {' + self.body.compile() + '\n';
    }
};
module.exports = ElseStatement;