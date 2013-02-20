var IfStatement = function () {};
IfStatement.prototype.init = function (test, body, alternatives) {
    var self = this;
    self.test = test;
    self.body = body;
    self.alternatives = alternatives || [];
    return self;
};
IfStatement.prototype.compile = function () {
    var self = this;
    var __ref1, __ref2, __ref3, alternative, rs;
    rs = [];
    rs.push('if (' + self.test.compile() + ') {');
    if (self.body) {
        rs.push(self.body.compile());
    }
    __ref1 = self.alternatives;
    for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {
        alternative = __ref1[__ref2];
        rs = rs.concat(alternative.compile());
    }
    rs.push('}');
    return rs.join('');
};
module.exports = IfStatement;