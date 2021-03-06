var assert = require("assert");
var T = require("../../lib/tea");

exports['test dot expression'] = function () {
    assert.equal("req.delete('/posts/1.json');", T.compile("req.delete('/posts/1.json')"));
    assert.equal("req.loop(function () {});", T.compile("req.loop(-> {})"));
    assert.equal("req.next();", T.compile("req.next()"));
    assert.equal("req.then().then;", T.compile("req.then().then"));

    assert.equal("Array.prototype.any = function () {\n    return this.length > 0;\n};",
        T.compile("Array.prototype.any = -> { return this.length > 0 }"));
};

exports['test assoc definition'] = function () {
    assert.equal("{\n    delete: 1,\n    then: function (callback) {}\n};",
        T.compile("{ delete: 1, then: ->(callback) {} }"));
};

exports['test function declaration'] = function () {
    assert.equal("var then;\nthen = function (callback) {};", T.compile("def then(callback);end"));
    assert.equal("var loop;\nloop = function () {};", T.compile("def loop;end"));
};

exports['test method declaration'] = function () {
    assert.equal("Request.delete = function () {};", T.compile("def Request.delete;end"));

    assert.equal(
        "function Request() {}\n" +
        "Request.prototype.constructor = Request;\n" +
        "Request.prototype.delete = function () {\n    var self = this;\n};",
        T.compile("prototype Request;def delete;end;end"));

    assert.equal(
        "function Request() {}\n" +
        "Request.prototype.constructor = Request;\n" +
        "Request.delete = function () {};",
        T.compile("prototype Request;def +delete;end;end"));
};

exports['test function call'] = function () {
    assert.equal("Request.delete();", T.compile("Request.delete()"));
    //assert.equal("loop(function () {});", T.compile("loop(-> {})"));
};

if (module === require.main) {
    require("../test").run(exports);
}
