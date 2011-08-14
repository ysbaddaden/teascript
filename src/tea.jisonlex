D  [0-9]
L  [a-zA-Z_]
E  [eE][-+]?{D}+

%{
    if (typeof pushScope == 'undefined') {
        Array.prototype.pull = function () {
            var index = scopes.length - 1,
                value = scopes[index];
            delete scopes[index];
            return value;
        }
        
        global.scopes = [[]];
        
        global.pushScope = function () {
            scopes.push([]);
        }
        global.pullScope = function () {
            return scopes.pull();
        }
        global.currentScope = function () {
            return scopes[scopes.length - 1];
        }
        global.identifierExistsInScope = function (identifier) {
            var i = scopes.length;
            while (i--) {
              if (scopes[i].indexOf(identifier) != -1) {
                return true;
              }
            }
            return false;
        }
        global.pushIdentifier = function (identifier) {
          if (!identifierExistsInScope(identifier)) {
            currentScope().push(identifier);
          }
        }
        
        global.indentValue = 1;
        
        global.indentBody = function (str, by) {
            var _indent = "";
            for (i = 0; i < indentValue + (by || 0); i++) {
                _indent += "  ";
            }
            return _indent + str;
        }
        global.pushIndent = function () {
            global.indentValue += 1;
        }
        global.pullIndent = function () {
            global.indentValue -= 1;
        }
    }
%}

%%

"#".*                                ; // skip comments

"true"                               return 'CONSTANT';
"false"                              return 'CONSTANT';
"null"                               return 'CONSTANT';
[-+~]?{D}+(\.{D}+)?({E})?            return 'CONSTANT';
[-+~]?\.{D}+({E})?                   return 'CONSTANT';
\"(\\.|[^\\"])*\"	                   return 'STRING_LITERAL';
\'(\\.|[^\\'])*\'	                   return 'STRING';

"end"                                { pullIndent(); return 'END'; }

"if"                                 { pushIndent(); return 'IF'; }
"unless"                             { pushIndent(); return 'UNLESS'; }
"else"                               return 'ELSE';
"elsif"                              return 'ELSIF';
"case"                               return 'CASE';
"when"                               return 'WHEN';

"while"                              { pushIndent(); return 'WHILE'; }
"until"                              { pushIndent(); return 'UNTIL'; }
"loop"                               { pushIndent(); return 'LOOP'; }
"break"                              return 'BREAK';
"next"                               return 'CONTINUE';
"continue"                           return 'CONTINUE';

"+="                                 return 'ADD_ASSIGN';
"-="                                 return 'SUB_ASSIGN';
"*="                                 return 'MUL_ASSIGN';
"%="                                 return 'MOD_ASSIGN';
"&="                                 return 'AND_ASSIGN';
"|="                                 return 'OR_ASSIGN';
"^="                                 return 'XOR_ASSIGN';
//"||="                                return 'OR_OR_ASSIGN';
">>="                                return 'RIGHT_ASSIGN';
"<<="                                return 'LEFT_ASSIGN';

"typeof"                             return 'TYPEOF';
"!"                                  return 'NOT_OP';
"not"                                return 'NOT_OP';
"and"                                return 'AND_OP';
"&&"                                 return 'AND_OP';
"or"                                 return 'OR_OP';
"||"                                 return 'OR_OP';
[-+*%/&|^]                           return yytext;
">>"                                 return 'RIGHT_OP';
"<<"                                 return 'LEFT_OP';
"!="                                 return 'NEQ_OP';
"<="                                 return 'LE_OP';
"<"                                  return 'LT_OP';
">="                                 return 'GE_OP';
">"                                  return 'GT_OP';
"=="                                 return 'EQ_OP';
[()=;,:\[\]\{\}]                      return yytext;

{L}({L}|{D})*                        { pushIdentifier(yytext); return 'IDENTIFIER'; }

[ \t]+                               ; // skip whitespace
\n+                                  return 'LF';
<<EOF>>                              return 'EOF';

.                                    throw 'Invalid character: "' + yytext + '"';

%%

