var assert = require("assert");
var T = require("../../lib/tea");

exports["test empty object"] = function () {
    assert.equal("function A() {}\nA.prototype.constructor = A;",
        T.compile("prototype A\nend"));

    assert.equal("function Model() {}\nModel.prototype.constructor = Model;",
        T.compile("prototype Model\nend"));
};

exports["test with LHS"] = function () {
    assert.equal("Backbone.Model = function () {};\nBackbone.Model.prototype.constructor = Backbone.Model;",
        T.compile("prototype Backbone.Model\nend"));
};

exports["test won't redefine constructor if already defined"] = function () {
    assert.equal("var Post;\nPost = Backbone.Model.extend();",
       T.compile(
           "Post = Backbone.Model.extend()\n" +
           "prototype Post\nend"));

    assert.equal(
        "var Post;\n" +
        "Post = Backbone.Model.extend();\n" +
        "Post.prototype.doSomething = function () {\n    var self = this;\n};",
        T.compile(
            "Post = Backbone.Model.extend();\n" +
            "prototype Post\n" +
            "  def doSomething;end\n" +
            "end"));
};

exports["test inheritance"] = function () {
    assert.equal(
        "function Post() {}\n" +
        "Post.prototype = Object.create(Model.prototype);\n" +
        "Post.prototype.constructor = Post;",
        T.compile("prototype Post < Model\nend"));

    assert.equal(
        "App.Post = function () {};\n" +
        "App.Post.prototype = Object.create(BB.Model.prototype);\n" +
        "App.Post.prototype.constructor = App.Post;",
        T.compile("prototype App.Post < BB.Model\nend"));
};

exports["test constructor"] = function () {
    assert.equal("function Model() {}\nModel.prototype.constructor = Model;",
        T.compile("prototype Model\n  def constructor();end\nend"));

    assert.equal("function Model() {\n    var self = this;\n    return self;\n}\nModel.prototype.constructor = Model;",
        T.compile("prototype Model\n  def constructor(); return self; end\nend"));

    assert.equal("function Model(attributes) {}\nModel.prototype.constructor = Model;",
        T.compile("prototype Model\n  def constructor(attributes);end\nend"));
};

exports["test constructor with default arguments"] = function () {
    assert.equal(
        "function Model(attributes, options) {\n" +
        "    var self = this;\n" +
        "    if (options == null) options = {};\n" +
        "    console.log(attributes, options);\n" +
        "}\n" +
        "Model.prototype.constructor = Model;",
        T.compile(
            "prototype Model\n" +
            "  def constructor(attributes, options = {})\n" +
            "    console.log(attributes, options)\n" +
            "  end\n" +
            "end"));
};

exports["test methods"] = function () {
    assert.equal(
        "function Post(attributes) {\n" +
        "    var self = this;\n" +
        "    if (attributes) {\n" +
        "        self.set(attributes);\n" +
        "    }\n" +
        "    return self;\n" +
        "}\n" +
        "Post.prototype.constructor = Post;\n" +
        "Post.prototype.set = function (attributes) {\n" +
        "    var self = this;\n" +
        "};\n" +
        "Post.create = function (attributes) {\n" +
        "    return new Post(attributes);\n" +
        "};",
        T.compile(
            "prototype Post\n" +
            "  def constructor(attributes)\n"  +
            "    self.set(attributes) if attributes\n" +
            "    return self\n" +
            "  end\n"  +
            "\n" +
            "  def set(attributes)\n"  +
            "  end\n"  +
            "\n" +
            "  def +create(attributes)\n"  +
            "    return new Post(attributes)\n" +
            "  end\n"  +
            "end"
            ));
};

if (module === require.main) {
    require("../test").run(exports);
}
