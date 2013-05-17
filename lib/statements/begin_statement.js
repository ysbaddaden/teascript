var scopes;
scopes = require('../scopes');

function BeginStatement() {}
BeginStatement.prototype.init = function (body, rescues, _ensure) {
    var self = this;
    self.body = body;
    self.rescues = rescues || [];
    self._ensure = _ensure;
    return self;
};
BeginStatement.prototype.compile = function () {
    var self = this;
    var __ref1, __ref2, _rescue, i, ref, rs;
    rs = [];
    rs.push('try {');
    rs.push(self.body.compile());
    if (self.rescues.length > 0) {
        ref = self.findReference() || scopes.reference({
            push: false
        });
        rs.push('} catch (' + ref + ') {');
        __ref1 = self.rescues;
        for (i = 0, __ref2 = __ref1.length; i < __ref2; i++) {
            _rescue = __ref1[i];
            if (i === 0) {
                rs.push(_rescue.compile(ref));
            } else {
                rs.push('else ' + _rescue.compile(ref));
            }
        }
    }
    if (self._ensure) {
        rs.push('} finally {');
        rs.push(self._ensure.compile());
    }
    rs.push('}');
    return rs.join('\n');
};
BeginStatement.prototype.findReference = function () {
    var self = this;
    var __ref3, __ref4, _rescue, i, ref;
    __ref3 = self.rescues;
    for (i = 0, __ref4 = __ref3.length; i < __ref4; i++) {
        _rescue = __ref3[i];
        if (!(_rescue.identifier)) {
            return;
        }
        if (!ref) {
            ref = _rescue.identifier.value;
        } else if (ref !== _rescue.identifier.value) {
            return;
        }
    }
    return ref;
};
module.exports = BeginStatement;