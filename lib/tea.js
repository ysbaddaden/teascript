var scopes = require("./scopes");
var parser = require("./parser");

exports.scopes = scopes;
exports.parser = parser;

exports.Program = require("./tea/program.js");
exports.Identifier = require("./tea/identifier");
exports.Keyword = require("./tea/keyword");

exports.Array = require("./tea/types/array");
exports.Assoc = require("./tea/types/assoc");
exports.Number = require("./tea/types/number");
exports.Object = require("./tea/types/object");
exports.String = require("./tea/types/string");
exports.Range = require("./tea/types/range");

exports.Call = require("./tea/expressions/call.js");
exports.Condition = require("./tea/expressions/condition.js");
exports.Dot = require("./tea/expressions/dot.js");
exports.Index = require("./tea/expressions/index.js");
exports.Operation = require("./tea/expressions/operation.js");
exports.Paren = require("./tea/expressions/paren.js");
exports.Splat = require("./tea/expressions/splat.js");
exports.UnaryExpression = require("./tea/expressions/unary_expression.js");

exports.Body = require("./tea/statements/body.js");
exports.CaseStatement = require("./tea/statements/case_statement.js");
exports.ElsifStatement = require("./tea/statements/elsif_statement.js");
exports.ElseStatement = require("./tea/statements/else_statement.js");
exports.Expression = require("./tea/statements/expression.js");
exports.ForStatement = require("./tea/statements/for_statement.js");
exports.Function = require("./tea/statements/function.js");
exports.IfStatement = require("./tea/statements/if_statement.js");
exports.LoopStatement = require("./tea/statements/loop_statement.js");
exports.ReturnStatement = require("./tea/statements/return_statement.js");
exports.UnlessStatement = require("./tea/statements/unless_statement.js");
exports.UntilStatement = require("./tea/statements/until_statement.js");
exports.WhenStatement = require("./tea/statements/when_statement.js");
exports.WhileStatement = require("./tea/statements/while_statement.js");

exports.parse = function (source) {
  return parser.parse(source);
}

exports.format = function (program) {
  return program.toJavaScript();
}

exports.toJavaScript = function (source) {
  return exports.parse(source).toJavaScript();
}
