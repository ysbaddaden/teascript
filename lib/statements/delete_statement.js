function DeleteStatement(primary) {
    var self = this;
    self.primary = primary;
}
DeleteStatement.prototype.constructor = DeleteStatement;
DeleteStatement.prototype.compile = function () {
    var self = this;
    return 'delete ' + self.primary.compile() + ';';
};
module.exports = DeleteStatement;