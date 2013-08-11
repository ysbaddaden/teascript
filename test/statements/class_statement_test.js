var assert = require("assert");
var T = require("../../lib/tea");

exports["test empty class statement"] = function () {
    assert.equal("var Document, __klass;" + T.CLASS_DEFINITION + "\nDocument = __klass();",
        T.compile("class Document;end"));

    assert.equal("var Post, __klass;" + T.CLASS_DEFINITION + "\nPost = __klass(Resource.Model);",
        T.compile("class Post < Resource.Model\nend"));
};

exports["test class definition statement"] = function () {
    assert.equal(
        "var Document, __klass;" + T.CLASS_DEFINITION + "\n" +
        "Document = __klass();\n" +
        "Document.prototype.initialize = function (options) {\n" +
        "    var self = this;\n" +
        "    if (options == null) options = {};\n" +
        "    self.title = options.title;\n" +
        "};\n" +
        "Document.prototype.getTitle = function () {\n" +
        "    var self = this;\n" +
        "    return self.title;\n" +
        "};",
        T.compile(
            "class Document\n" +
            "  def initialize options = {}\n" +
            "    self.title = options.title\n" +
            "  end\n" +
            "\n" +
            "  def getTitle\n" +
            "    return self.title;\n" +
            "  end\n" +
            "end"));
};

if (module === require.main) {
    require("../test").run(exports);
}
