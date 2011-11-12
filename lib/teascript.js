var fs = require("fs");
var path = require("path");
var util = require("util");

var T = require("./tea")

function main(args) {
  var source;
  
  if (!args[1]) {
    console.error("Usage: " + args[0] + " <file>");
    return;
  }
  var source = fs.readFileSync(path.join(process.cwd(), args[1]), "utf8");

  // DEBUG
//  var ast = T.parse(source);
//  console.log(util.inspect(ast, false, null));
//  console.log("=============================================================")
//  console.log(T.format(ast));
  
  // FINAL
  console.log(T.toJavaScript(source));
}

main(process.argv.slice(1));

