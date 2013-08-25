var Program, scopes;
scopes = require('./scopes');
Program = function (body) {
    var self = this;
    self.body = body;
};
Program.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var body;
    body = scopes.run(function () {
        return self.body.compile({
            scope: true
        });
    });
    if (options.scoped) {
        return '(function () {' + body + '}());';
    }
    if (options.amd) {
        return 'function (require, module, exports) {' + body + '});';
    }
    return body;
};
module.exports = Program;