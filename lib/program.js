var scopes;
scopes = require('./scopes');

function Program(body) {
    var self = this;
    self.body = body;
}
Program.prototype.constructor = Program;
Program.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var body;
    body = scopes.run(function () {
        return self.body.compile({
            scope: true
        });
    });
    if (options.scope) {
        return '(function () {' + body + '}());';
    }
    if (options.amd) {
        return 'function (require, module, exports) {' + body + '});';
    }
    return body;
};
module.exports = Program;