var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyObject = function () {
  assert.equal("var A = function () {};", T.toJavaScript("object A\nend"));
  assert.equal("var Model = function () {};", T.toJavaScript("object Model\nend"));
};

exports.testWithLHS = function () {
  assert.equal("Backbone.Model = function () {};", T.toJavaScript("object Backbone.Model\nend"));
  assert.equal("Coll[name] = function () {};", T.toJavaScript("object Coll[name]\nend"));
};

exports.testInheritance = function () {
  assert.equal("var Post = function () {};\nPost.prototype = new Model();", T.toJavaScript("object Post < Model\nend"));
  assert.equal("App.Post = function () {};\nApp.Post.prototype = new BB.Model();", T.toJavaScript("object App.Post < BB.Model\nend"));
};

exports.testMethods = function () {
  assert.equal("var Post = function () {};\n" +
               "Post.prototype.init = function (attributes) {\n" +
               "    var self = this;\n" +
               "    return self;\n" +
               "};\n" +
               "Post.create = function (attributes) {\n" +
               "    return new Post().init(attributes);\n" +
               "};",
          T.toJavaScript("object Post\n" +
            "  def init(attributes)\n"  +
            "    return self\n" +
            "  end\n"  +
            "\n" +
            "  def +create(attributes)\n"  +
            "    return new Post().init(attributes)\n" +
            "  end\n"  +
            "end"
          ));
};

if (module === require.main) {
  require("../test").run(exports);
}
