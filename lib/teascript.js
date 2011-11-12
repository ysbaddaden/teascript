var fs = require("fs");
var path = require("path");
var util = require("util");

//var parser = require("./parser");
//var formatter = require("./formatter");

var T = require("./tea")

function main(args) {
  if (!args[1]) {
    console.error("Usage: " + args[0] + " <file>");
    return;
  }
  var source = fs.readFileSync(path.join(process.cwd(), args[1]), "utf8");
//  var ast = parser.parse(source);
//  console.log(ast);
//  console.log(JSON.stringify(ast));
//  console.log("=============================================================")
//  console.log(formatter.toJavaScript(ast));

  // DEBUG
//  var ast = T.parse(source);
//  console.log(util.inspect(ast, false, null));
//  console.log("=============================================================")
//  console.log(T.format(ast));
  
  // FINAL
  console.log(T.toJavaScript(source));
}
main(process.argv.slice(1));

