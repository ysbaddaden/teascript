var scopes;
scopes = require('../scopes');

function Body() {}
Body.prototype.init = function (statement) {
    var self = this;
    self.statements = [];
    if (statement) {
        self.push(statement);
    }
    return self;
};
Body.prototype.push = function (statement) {
    var self = this;
    self.statements.push(statement);
};
Body.prototype.parseStatements = function () {
    var self = this;
    self.body = self.statements.reduce(function (body, statement) {
        if (statement) {
            return body.concat(statement.compile());
        } else {
            return body;
        }
    }, []);
};
Body.prototype.lastStatement = function () {
    var self = this;
    return self.statements[self.statements.length - 1];
};
Body.prototype.compile = function (options) {
    var self = this;
    if (options == null) options = {};
    var identifiers;
    if (options.scope) {
        identifiers = scopes.withScope(function () {
            self.parseStatements();
        });
        if (identifiers && identifiers.length > 0) {
            self.body.unshift('var ' + identifiers.sort().join(', ') + ';');
        }
    } else {
        self.parseStatements();
    }
    return self.body.join('');
};
module.exports = Body;