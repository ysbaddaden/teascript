var DeleteStatement;
DeleteStatement = function (primary) {
    var self = this;
    self.primary = primary;
};
DeleteStatement.prototype.compile = function () {
    var self = this;
    return 'delete ' + self.primary.compile() + ';';
};
module.exports = DeleteStatement;