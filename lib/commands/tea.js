var T = require("../tea");

if (typeof console === "undefined") {
  console = {
    log: function (msg) {
      system.stdout.write(msg + "\n");
      system.stdout.flush();
    },
    error: function (msg) {
      system.stderr.write(msg + "\n");
      system.stderr.flush();
    }
  };
}

function main(args) {
  var source;

  if (!args[1]) {
    console.error("Usage: " + args[0] + " <file>");
    return;
  }

  if (typeof process !== "undefined") {
    // node
    var fs   = require("fs");
    var path = require("path");
    var util = require("util");
    source = fs.readFileSync(path.join(process.cwd(), args[1]), "utf8");
  } else {
    // narwhal
    var cwd = require("file").path(require("file").cwd());
    source = cwd.join(args[1]).read({ charset: "utf-8" });
  }

  // DEBUG
//  var ast = T.parse(source);
//  console.log(util.inspect(ast, false, null));
//  console.log("=============================================================");
//  console.log(T.format(ast));
//  console.log("=============================================================");

  // FINAL
  var dest = T.toJavaScript(source, { 'amd': args[2] == "--amd", 'scoped': args[2] == "--scope" });
  console.log(dest);
}

main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);

