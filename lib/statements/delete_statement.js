var DeleteStatement = function () {};
DeleteStatement.prototype.init = function (primary) {
    var self = this;
    self.primary = primary;
    return self;
};
DeleteStatement.prototype.compile = function () {
    var self = this;
    return 'delete ' + self.primary.compile() + ';';
};
module.exports = DeleteStatement;