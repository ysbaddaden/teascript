var scopes  = [];
var globals = [ "global", "window", "document" ];

function pushScope() {
  scopes.push([]);
}

function pullScope() {
  return scopes.pop();
}

function currentScope() {
  return scopes[scopes.length - 1];
}

function withScope(callback) {
  pushScope();
  callback();
  return pullScope();
}

function identifierDefined(ident) {
  var i = scopes.length;
  while (i--) {
    if (scopes[i].indexOf(ident) != -1) {
      return true;
    }
  }
  return false;
}

function pushIdentifier(ident) {
  if (globals.indexOf(ident) == -1 && !identifierDefined(ident)) {
    currentScope().push(ident);
  }
}

// Indents a preformated AST (as nested arrays).
function indent(ary, deep) {
  var _indent = "";
  for (var i = 0, l = deep * 4; i < l; i++) {
    _indent += " ";
  }
  var rs = [];
  ary.forEach(function (line) {
    if (typeof line.forEach === "function") {
      rs.push(indent(line, deep + 1));
    } else {
      rs.push(_indent + line);
    }
  });
  return rs.join("\n");
}

// Main entry point for formatting the AST of a given file.
function parseProgram(ast) {
  var rs = [];
  rs.push("(function () {");
  rs.push(parseBodyWithScope(ast));
  rs.push("}());");
  return indent(rs, 0);
}

function parseBodyWithScope(ast) {
  var body;
  var scope = withScope(function () {
    body = parseBody(ast);
  });
  if (scope.length) {
    body.unshift("var " + scope.sort().join(", ") + ";");
  }
  return body;
}

function parseBody(ast) {
  var rs = [];
  ast.forEach(function (expr) {
    parseStatement(rs, expr);
  });
  return rs;
}

function parseStatement(rs, expr) {
  switch (expr[0]) {
  case "case":
    rs.push("switch (" + parseExpression(expr[1]) + ") {");
    if (typeof expr[2] != "undefined") {
      expr[2].forEach(function (stmt) {
        parseWhenStatement(rs, stmt);
      });
    }
    rs.push("}");
    break;
  
  case 'if':
    rs.push("if (" + parseExpression(expr[1]) + ") {");
    rs.push(parseBody(expr[2]));
    
    if (typeof expr[3] != "undefined") {
      expr[3].forEach(function (stmt) {
        parseElseStatement(rs, stmt);
      });
    }
    
    rs.push("}");
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
  
  case 'def':
    parseFunctionDeclaration(rs, expr);
    break;
  
//  case 'linefeed':
//    rs.push("");
//    break;
  
  default:
    rs.push(parseExpression(expr) + ";");
  }
}

function parseFunctionDeclaration(rs, expr) {
  withScope(function () { // we scope to skip method arguments
    var args = parseArgumentDeclarations(expr[2]);
    var body = (typeof expr[3] === "undefined") ? [] : parseBodyWithScope(expr[3]);
    
    if (args[1].length) {
      body = args[1].concat(body);
    }
    rs.push("function " + expr[1] + "(" + args[0].join(', ') + ") {" );
    if (body.length > 0) {
      rs.push(body);
    }
    rs.push("}");
  });
}

function parseArgumentDeclarations(args) {
  var a = [];
  var b = [];
  
  args.forEach(function (arg) {
    var ident;
    
    switch (arg[0]) {
    case "assign":
      ident = arg[2][1];
      a.push(ident);
      b.push("if (typeof " + ident + " === 'undefined') {");
      b.push([ parseExpression(arg)+ ";" ]);
      b.push("}");
    break;
    
    case "splat":
      if (a.length > 0) {
        b.push("var " + arg[1][1] + " = Array.prototype.slice.call(arguments, " + a.length + ") || [];");
      } else {
        b.push("var " + arg[1][1] + " = arguments;");
      }
    break;
    
    default:
      a.push(parseExpression(arg));
    }
  });
  
  return [ a, b ];
}

function parseElseStatement(rs, stmt) {
  switch (stmt[0]) {
  case "else":
    rs.push("} else {");
    if (typeof stmt[1] != "undefined") {
      rs.push(parseBody(stmt[1]));
    }
  break;
  
  case "elsif":
    rs.push("} else if (" + parseExpression(stmt[1]) + ") {");
    if (typeof stmt[2] != "undefined") {
      rs.push(parseBody(stmt[2]));
    }
  break;
  }
}

function parseWhenStatement(rs, stmt) {
  switch (stmt[0]) {
  case 'when':
    stmt[1].forEach(function (when) {
      rs.push("case " + parseExpression(when) + ":");
    });
    rs.push(parseBody(stmt[2]).concat(['break;']));
    break;
  case 'else':
    rs.push("default:");
    rs.push(parseBody(stmt[1]));
  }
}

function parseExpression(expr) {
  var rs = [];
  
  switch (expr[0]) {
  case "const":
    if (expr[1][0] == ".") {
      rs.push("0" + expr[1]); // disambiguates float numbers like .125
    } else {
      rs.push(expr[1]);
    }
    break;
  
  case "keyword":
    rs.push(expr[1]);
    break;
  
//  case "var":
//    if (expr[1].match(/^__/)) {
//      throw new Error("Invalid identifier '" + expr[1] + "'; identifiers starting with '__' are reserved.");
//    }
//    pushIdentifier(expr[1]);
//    rs.push(expr[1]);
//    break;
  
  case "ident":
    if (expr[1].match(/^__/)) {
      throw new Error("ERROR: invalid identifier '" + expr[1] + "'; identifiers starting with '__' are reserved.");
//    } else if (!identifierDefined(expr[1])) {
//      console.warn("WARNING: undefined identifier '" + expr[1] + "'.");
    }
    pushIdentifier(expr[1]);
    rs.push(expr[1]);
    break;
  
  case "string":
    rs.push(expr[1].replace(/\n/g, '\\n'));
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
  
  case "dot":
    rs.push(parseExpression(expr[1]) + '.' + expr[2]);
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
    rs.push("!" + parseExpression(expr[1]));
    break;
  
  case "cond":
    rs.push(parseExpression(expr[1]));
    rs.push("?")
    rs.push(parseExpression(expr[2]));
    rs.push(":")
    rs.push(parseExpression(expr[3]));
    break;
  
  case "access":
    rs.push(parseExpression(expr[1]) + "[" + parseExpression(expr[2]) + "]");
    break;
  
  case "call":
    rs.push(parseCallExpression(expr));
    break;
  
  case "return":
    rs.push("return");
    if (typeof expr[1] != "undefined") {
      rs.push(parseExpression(expr[1]));
    }
    break;
  }
  
  return rs.join(" ");
}

function parseCallExpression(expr) {
  var args = [];
  var splat;
  
  expr[2].forEach(function (decl) {
    if (decl[0] === "splat") {
      if (args.length > 0) {
        splat = "[" + args.join(", ") + "].concat(" + parseExpression(decl[1]) + ")";
      } else {
        splat = parseExpression(decl[1]);
      }
    } else {
      args.push(parseExpression(decl));
    }
  });
  
  if (splat) {
    return parseFunctionName(expr[1]) + ".call(null, " + splat + ")";
  } else {
    return parseFunctionName(expr[1]) + "(" + args.join(", ") + ")";
  }
}

function parseFunctionName(expr) {
  return (expr[0] === "ident") ? expr[1] : parseExpression(expr);
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
  var left = (decl[1][0] === "ident") ? decl[1][1] : parseExpression(decl[1]);
  return [ left, parseExpression(decl[2]) ].join(": ");
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
  
//  console.log(ast);
//  console.log(JSON.stringify(ast));
//  console.log("=============================================================")
  console.log(parseProgram(ast));
}

main(typeof process !== "undefined" ? process.argv.slice(1) : require("system").args);

