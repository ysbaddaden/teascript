function computeIndent(deep) {
  var indent = "";
  for (var i = 0; i < deep * 2; i++) {
    indent += " ";
  }
  return indent;
}

function parseProgram(ast) {
  return "(function () {\n" + parseBody(ast, 1) + "\n})();";
}

function parseBody(ast, deep) {
  var rs = [];
  ast.forEach(function (expr) {
    rs.push(parseExpression(expr));
  });
  indent = computeIndent(deep);
  return indent + rs.join(";\n" + indent);
}

function parseExpression(expr) {
  var rs = [];
  
  switch (expr[0]) {
  case "const":
  case "keyword":
    rs.push(expr[1]);
  break;
  
  case "ident":
    if (expr[1].match(/^__/)) {
      throw new Error("Invalid identifier: " + expr[1] + "; variables starting with '__' are reserved.");
    }
    rs.push(expr[1]);
  break;
  
  case "string":
    rs.push(expr[1].replace(/\n/, "\\\n"));
  break;
  
  case "array":
    if (typeof expr[1] != "undefined") {
      rs.push("[");
      rs.push(parseDeclarationList(expr[1]));
      rs.push("]");
    } else {
      rs.push("[]");
    }
  break;
  
  case "object":
    if (typeof expr[1] != "undefined") {
      rs.push("{");
      rs.push(parseObjectDeclarationList(expr[1]));
      rs.push("}");
    } else {
      rs.push("{}");
    }
  break;
  
  case "paren":
    rs.push('(' + parseExpression(expr[1]) + ')');
  break;
  
  case "typeof":
    rs.push('typeof');
    rs.push(parseExpression(expr[1]));
  break;
  
  case "assign":
    rs.push(parseExpression(expr[2]));
    rs.push(expr[1]);
    rs.push(parseExpression(expr[3]));
  break;
  
  case "op":
    rs.push(parseExpression(expr[2]));
    rs.push(expr[1]);
    rs.push(parseExpression(expr[3]));
  break;
  
  case "not":
    rs.push("!");
    rs.push(parseExpression(expr[1]));
  break;
  }
  
  return rs.join(" ");
}

function parseDeclarationList(list) {
  var rs = [];
  list.forEach(function (decl) {
    rs.push(parseExpression(decl));
  });
  return rs.join(", ");
}

function parseObjectDeclarationList(list) {
  var rs = [];
  list.forEach(function (decl) {
    rs.push(parseObjectDeclaration(decl));
  });
  return rs.join(", ");
}

function parseObjectDeclaration(decl) {
  return [ parseExpression(decl[1]), parseExpression(decl[2]) ].join(": ");
}


function main(args) {
  if (!args[1]) {
    console.error("Usage: " + args[0] + " <file>");
    return;
  }
  
  if (typeof process !== "undefined") {
    var fs = require("fs");
    var path = require("path");
    var source = fs.readFileSync(path.join(process.cwd(), args[1]), "utf8");
  } else {
    var file = require("file");
    var cwd = file.path(file.cwd());
    var source = cwd.join(args[1]).read({charset: "utf-8"});
  }
  
  var tea = require("./tea");
  var ast = tea.parse(source);
  
  console.log(JSON.stringify(ast));
  console.log("=============================================================")
  console.log(parseProgram(ast));
}

main(typeof process !== "undefined" ? process.argv.slice(1) : require("system").args);

