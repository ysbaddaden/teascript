//function computeIndent(deep) {
//  var indent = "";
//  for (var i = 0; i < deep * 2; i++) {
//    indent += " ";
//  }
//  return indent;
//}

//function indent() {
//  return "  ";
//}

function parseProgram(ast) {
  return "(function () {\n" + parseBody(ast) + "})();";
}

function parseBody(ast) {
  var rs = [];
  ast.forEach(function (expr) {
    rs.push(parsePrimaryExpression(expr));
  });
  return rs.join("\n");
}

function parsePrimaryExpression(expr) {
  var rs = [];
  
  switch (expr[0]) {
  case "case":
    rs.push("switch (" + parseExpression(expr[1]) + ") {");
    if (typeof expr[2] != "undefined") {
      expr[2].forEach(function (stmt) {
        rs.push(parseWhenStatement(stmt));
      });
    }
    rs.push("}");
  break;

  case 'if':
    rs.push("if (" + parseExpression(expr[1]) + ") {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
    
    if (typeof expr[3] != "undefined") {
      expr[3].forEach(function (stmt) {
        rs.push(parseElseStatement(stmt));
      });
    }
  break;
  
  case 'unless':
    rs.push("if (!(" + parseExpression(expr[1]) + ")) {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
  break;
  
  case 'while':
    rs.push("while (" + parseExpression(expr[1]) + ") {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
  break;
  
  case 'until':
    rs.push("while (!(" + parseExpression(expr[1]) + ")) {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
  break;
  
  case 'loop':
    rs.push("while (true) {");
    rs.push(parseBody(expr[1]));
    rs.push("}");
  break;
  
  default:
    rs.push(parseExpression(expr) + ";");
//    return parseExpression(expr) + ";"
  }
  
  return rs.join("\n");
}

function parseElseStatement(stmt) {
  var rs = [];
  
  switch (stmt[0]) {
  case "else":
    rs.push("else {");
    if (typeof stmt[1] != "undefined") {
      rs.push(parseBody(stmt[1]));
    }
    rs.push("}");
  break;
  
  case "elsif":
    rs.push("else if (" + parseExpression(stmt[1]) + ") {");
    if (typeof stmt[2] != "undefined") {
      rs.push(parseBody(stmt[2]));
    }
    rs.push("}");
  break;
  }
  
  return rs.join("\n");
}

function parseWhenStatement(stmt) {
  var rs = [];
  rs.push("case " + parseExpression(stmt[1]) + ":");
  rs.push(parseBody(stmt[2]));
  rs.push("break;");
  return rs.join("\n");
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

