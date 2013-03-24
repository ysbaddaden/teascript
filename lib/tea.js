var beautify, parser;
exports.scopes = require('./scopes');
exports.Program = require('./program.js');
exports.Identifier = require('./identifier');
exports.Keyword = require('./keyword');
exports.Array = require('./types/array');
exports.Assoc = require('./types/assoc');
exports.Number = require('./types/number');
exports.Object = require('./types/object');
exports.String = require('./types/string');
exports.Range = require('./types/range');
exports.RegExp = require('./types/regexp');
exports.Call = require('./expressions/call.js');
exports.Condition = require('./expressions/condition.js');
exports.Dot = require('./expressions/dot.js');
exports.Index = require('./expressions/index.js');
exports.Operation = require('./expressions/operation.js');
exports.Paren = require('./expressions/paren.js');
exports.Splat = require('./expressions/splat.js');
exports.Unary = require('./expressions/unary.js');
exports.NewExpression = require('./expressions/new_expression.js');
exports.Body = require('./statements/body.js');
exports.CaseStatement = require('./statements/case_statement.js');
exports.DeleteStatement = require('./statements/delete_statement.js');
exports.ElsifStatement = require('./statements/elsif_statement.js');
exports.ElseStatement = require('./statements/else_statement.js');
exports.Statement = require('./statements/statement.js');
exports.ForOfStatement = require('./statements/for_of_statement.js');
exports.ForInStatement = require('./statements/for_in_statement.js');
exports.Function = require('./statements/function.js');
exports.IfStatement = require('./statements/if_statement.js');
exports.LoopStatement = require('./statements/loop_statement.js');
exports.Prototype = require('./statements/prototype.js');
exports.ReturnStatement = require('./statements/return_statement.js');
exports.StaticFunction = require('./statements/static_function.js');
exports.UnlessStatement = require('./statements/unless_statement.js');
exports.UntilStatement = require('./statements/until_statement.js');
exports.WhenStatement = require('./statements/when_statement.js');
exports.WhileStatement = require('./statements/while_statement.js');
exports.ThrowStatement = require('./statements/throw_statement.js');
exports.BeginStatement = require('./statements/begin_statement.js');
exports.RescueStatement = require('./statements/rescue_statement.js');
parser = require('./parser');
exports.parser = parser;
beautify = require('js-beautify').js_beautify;
exports.lex = function (source) {
    var token, tokens;
    parser.lexer.setInput(source);
    tokens = [];
    while ((token = lexer.lex()) !== lexer.EOF) {
        if (typeof token === number) {
            tokens.push(lexer.yytext);
        } else {
            tokens.push(token);
        }
    }
    return tokens;
};
exports.ast = function (source) {
    return parser.parse(source + '\n\n');
};
exports.compile = function (source, options) {
    return beautify(exports.ast(source).compile(options), {
        jslint_happy: true
    });
};