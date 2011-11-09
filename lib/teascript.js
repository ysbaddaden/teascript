var fs = require("fs");
var path = require("path");
var parser = require("./parser");
var formatter = require("./formatter");

function main(args) {
  if (!args[1]) {
    console.error("Usage: " + args[0] + " <file>");
    return;
  }
  var source = fs.readFileSync(path.join(process.cwd(), args[1]), "utf8");
  var ast = parser.parse(source);
//  console.log(ast);
//  console.log(JSON.stringify(ast));
//  console.log("=============================================================")
  console.log(formatter.toJavaScript(ast));
}
main(process.argv.slice(1));

