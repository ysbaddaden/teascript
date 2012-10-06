var scopes = require("./scopes");
var parser = require("./parser");

exports.scopes = scopes;
exports.parser = parser;

exports.Program = require("./tea/program.js").Program;
exports.Identifier = require("./tea/identifier").Identifier;
exports.Keyword = require("./tea/keyword").Keyword;

exports.Array = require("./tea/types/array").Array;
exports.Assoc = require("./tea/types/assoc").Assoc;
exports.Number = require("./tea/types/number").Number;
exports.Object = require("./tea/types/object").Object;
exports.String = require("./tea/types/string").String;
exports.Range = require("./tea/types/range").Range;

exports.Call = require("./tea/expressions/call.js").Call;
exports.Condition = require("./tea/expressions/condition.js").Condition;
exports.Dot = require("./tea/expressions/dot.js").Dot;
exports.Index = require("./tea/expressions/index.js").Index;
exports.Operation = require("./tea/expressions/operation.js").Operation;
exports.Paren = require("./tea/expressions/paren.js").Paren;
exports.Splat = require("./tea/expressions/splat.js").Splat;
exports.UnaryExpression = require("./tea/expressions/unary_expression.js").UnaryExpression;

exports.Body = require("./tea/statements/body.js").Body;
exports.CaseStatement = require("./tea/statements/case_statement.js").CaseStatement;
exports.DeleteStatement = require("./tea/statements/delete_statement.js").DeleteStatement;
exports.ElsifStatement = require("./tea/statements/elsif_statement.js").ElsifStatement;
exports.ElseStatement = require("./tea/statements/else_statement.js").ElseStatement;
exports.Statement = require("./tea/statements/statement.js").Statement;
exports.ForOfStatement = require("./tea/statements/for_of_statement.js").ForOfStatement;
exports.ForInStatement = require("./tea/statements/for_in_statement.js").ForInStatement;
exports.Function = require("./tea/statements/function.js").Function;
exports.IfStatement = require("./tea/statements/if_statement.js").IfStatement;
exports.LoopStatement = require("./tea/statements/loop_statement.js").LoopStatement;
exports.RequireStatement = require("./tea/statements/require_statement.js").RequireStatement;
exports.ReturnStatement = require("./tea/statements/return_statement.js").ReturnStatement;
exports.UnlessStatement = require("./tea/statements/unless_statement.js").UnlessStatement;
exports.UntilStatement = require("./tea/statements/until_statement.js").UntilStatement;
exports.WhenStatement = require("./tea/statements/when_statement.js").WhenStatement;
exports.WhileStatement = require("./tea/statements/while_statement.js").WhileStatement;

exports.parse = function (source) {
  return parser.parse(source + "\n\n");
};

exports.format = function (program, options) {
  var beautify = require("js-beautify").js_beautify;
  return beautify(program.toJavaScript(options), {
    jslint_happy: true
  });
};

exports.toJavaScript = function (source, options) {
  return exports.parse(source).toJavaScript(options);
};
exports.compile = exports.toJavaScript;

