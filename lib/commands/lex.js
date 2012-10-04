#! /usr/bin/env node
var Lang   = require("../parser.js");
var parser = Lang.parser;
var lexer  = parser.lexer;

var args = process.argv.slice(1);
var source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
lexer.setInput(source);

var tokens = [];
var token;
while ((token = lexer.lex()) != lexer.EOF) {
  if (typeof token === "number") {
    //tokens.push([ parser.terminals_[token], lexer.yytext ]);
    tokens.push(lexer.yytext);
  } else {
    tokens.push(token);
  }
//  console.log(lexer.yytext);
}

console.log(tokens);

