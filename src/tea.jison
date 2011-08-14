%token LF EOF
%token CONSTANT STRING_LITERAL IDENTIFIER
%token EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP
%token END
%token IF UNLESS ELSE ELSEIF
%token WHILE UNTIL LOOP BREAK CONTINUE

%right '=' ADD_ASSIGN SUB_ASSIGN MUL_ASSIGN MOD_ASSIGN AND_ASSIGN OR_ASSIGN XOR_ASSIGN
%left  '+' '-' '*' '/' '%'
%left  '&' '|' '^'
%right EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP NOT_OP
%right TYPEOF

%start Program

%%

Program
    : Body EOF                      {
        $$ = "(function() {\n";
        var identifiers = global.pullScope();
        if (identifiers.length) {
            $$ += indentBody("var " + identifiers.join(", ") + ";\n");
        }
        $$ += $1;
        $$ += "})();";
        console.log($$);
    }
    ;

Body
    : Body Terminator
    | Body Statement Terminator { $$ = $1 ? $1 + $2 : $2; }
    | 
    ;

Statement
    : PrimaryExpression     { $$ = indentBody($1) + ";\n"; }
    | ConditionalStatement  { $$ = "\n" + indentBody($1) + "\n"; }
    | LoopStatement         { $$ = "\n" + indentBody($1) + "\n"; }
    | CaseStatement         { $$ = "\n" + indentBody($1) + "\n"; }
    ;

CaseStatement
    : CASE Expression LF WhenStatement END {
        $$ = "switch (" + $2 + ") {\n" + $4 + "}";
    }
    ;

WhenStatement
    : WHEN PrimaryExpression Body {
        $$ = "case " + $2 + ":\n" + $3 + "break;\n";
    }
    | WhenStatement WHEN PrimaryExpression Body {
        $$ = $1 + "case " + $3 + ":\n" + $4 + "break;\n";
    }
    ;

ConditionalStatement
    : IF PrimaryExpression Body END {
        $$ = "if (" + $2 + ") {\n" + $3 + indentBody("}");
    }
    | IF PrimaryExpression Body ElseStatement END {
        $$ = "if (" + $2 + ") {\n" + $3 + indentBody("} ") + $4;
    }
    | IF PrimaryExpression Body ElsifStatement END {
        $$ = "if (" + $2 + ") {\n" + $3 + indentBody("} ") + $4;
    }
    | IF PrimaryExpression Body ElsifStatement ElseStatement END {
        $$ = "if (" + $2 + ") {\n" + $3 + indentBody("} ") + $4 + " " + $5;
    }
    | UNLESS PrimaryExpression Body END {
        $$ = "if (!(" + $2 + ")) {\n" + $3 + indentBody("}");
    }
    | PrimaryExpression IF PrimaryExpression {
        pullIndent();
        $$ = "if (" + $3 + ") {\n" + indentBody($1, 1) + ";\n" + indentBody("}");
    }
    | PrimaryExpression UNLESS PrimaryExpression {
        pullIndent();
        $$ = "if (!(" + $3 + ")) {\n" + indentBody($1, 1) + ";\n" + indentBody("}");
    }
    ;

ElseStatement
    : ELSE Body { $$ = "else {\n" + $2 + indentBody("}"); }
    ;

ElsifStatement
    : ELSIF PrimaryExpression Body {
        $$ = "else if (" + $2 + ") {\n" + $3 + indentBody("}", -1);
    }
    | ELSIF PrimaryExpression Body ElsifStatement {
        $$ = "else if (" + $2 + ") {\n" + $3 + indentBody("} ", -1) + $4;
    }
    ;

LoopStatement
    : WHILE PrimaryExpression Body END {
        $$ = "while (" + $2 + ") {\n" + $3 + indentBody("}");
    }
    | UNTIL PrimaryExpression Body END {
        $$ = "while (!(" + $2 + ")) {\n" + $3 + indentBody("}");
    }
    | PrimaryExpression WHILE PrimaryExpression {
        pullIndent();
        $$ = "while (" + $3 + ") {\n" + indentBody($1, 1) + ";\n" + indentBody("}");
    }
    | PrimaryExpression UNTIL PrimaryExpression {
        pullIndent();
        $$ = "while (!(" + $3 + ")) {\n" + indentBody($1, 1) + ";\n" + indentBody("}");
    }
    | LOOP Body END {
        $$ = "while (true) {\n" + $2 + indentBody("}");
    }
    ;

PrimaryExpression
    : Expression                { $$ = $1; }
    | AssignExpression          { $$ = $1; }
    | BREAK                     { $$ = "break"; }
    | CONTINUE                  { $$ = "continue"; }
    ;

Expression
    : CONSTANT                  { $$ = $1; }
    | IDENTIFIER                { $$ = $1; }
    | Array                     { $$ = $1; }
    | Object                    { $$ = $1; }
    | STRING_LITERAL            { $$ = $1.replace(/\n/g, "\\\n"); }
    | STRING                    { $$ = $1.replace(/\n/g, "\\\n"); }
    | MathExpression            { $$ = $1; }
    | BitwiseExpression         { $$ = $1; }
    | LogicalExpression         { $$ = $1; }
    | TYPEOF Expression         { $$ = "typeof " + $2; }
    | '(' Expression ')'        { $$ = "(" + $2 + ")"; }
    | '(' Expression LF ')'     { $$ = "(" + $2 + ")"; }
    | '(' LF Expression LF ')'  { $$ = "(" + $3 + ")"; }
    | '(' LF Expression ')'     { $$ = "(" + $3 + ")"; }
    ;

Array
    : '[' ']'                                           { $$ = "[]"; }
    | '[' DeclarationList ']'                           { $$ = "[" + $2 + "]"; }
    | '[' DeclarationList LF ']'                        { $$ = "[" + $2 + "]"; }
    | '[' LF DeclarationList LF ']'                     { $$ = "[" + $3 + "]"; }
    | '[' LF DeclarationList ']'                        { $$ = "[" + $3 + "]"; }
    ;

DeclarationList
    : Expression                                        { $$ = $1; }
    | DeclarationList ',' Expression                    { $$ = $1 + ", " + $3; }
    | DeclarationList ',' LF Expression                 { $$ = $1 + ", " + $4; }
    | DeclarationList LF ',' LF Expression              { $$ = $1 + ", " + $5; }
    | DeclarationList LF ',' Expression                 { $$ = $1 + ", " + $4; }
    ;

Object
    : '{' '}'                                           { $$ = "{}"; }
    | '{' ObjectDeclarationList '}'                     { $$ = "{" + $2 + "}"; }
    | '{' ObjectDeclarationList LF '}'                  { $$ = "{" + $2 + "}"; }
    | '{' LF ObjectDeclarationList LF '}'               { $$ = "{" + $3 + "}"; }
    | '{' LF ObjectDeclarationList '}'                  { $$ = "{" + $3 + "}"; }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = $1; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $$ = $1 + ", " + $3; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $$ = $1 + ", " + $4; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $$ = $1 + ", " + $5; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $$ = $1 + ", " + $4; }
    ;

ObjectDeclaration
    : Expression ':' Expression                         { $$ = $1 + ": " + $3; }
    | Expression ':' LF Expression                      { $$ = $1 + ": " + $4; }
    | Expression LF ':' LF Expression                   { $$ = $1 + ": " + $5; }
    | Expression LF ':' Expression                      { $$ = $1 + ": " + $4; }
    ;

AssignExpression
    : IDENTIFIER '=' Expression           { $$ = $1 + " = "   + $3; }
    | IDENTIFIER ADD_ASSIGN   Expression  { $$ = $1 + " += "  + $3; }
    | IDENTIFIER SUB_ASSIGN   Expression  { $$ = $1 + " -= "  + $3; }
    | IDENTIFIER MUL_ASSIGN   Expression  { $$ = $1 + " *= "  + $3; }
    | IDENTIFIER MOD_ASSIGN   Expression  { $$ = $1 + " %= "  + $3; }
    | IDENTIFIER AND_ASSIGN   Expression  { $$ = $1 + " &= "  + $3; }
    | IDENTIFIER OR_ASSIGN    Expression  { $$ = $1 + " |= "  + $3; }
    | IDENTIFIER XOR_ASSIGN   Expression  { $$ = $1 + " ^= "  + $3; }
    | IDENTIFIER RIGHT_ASSIGN Expression  { $$ = $1 + " >>= " + $3; }
    | IDENTIFIER LEFT_ASSIGN  Expression  { $$ = $1 + " <<= " + $3; }
    ;

MathExpression
    : Expression '+' Expression           { $$ = $1 + " + " + $3; }
    | Expression '-' Expression           { $$ = $1 + " - " + $3; }
    | Expression '*' Expression           { $$ = $1 + " * " + $3; }
    | Expression '/' Expression           { $$ = $1 + " / " + $3; }
    | Expression '%' Expression           { $$ = $1 + " % " + $3; }
    ;

BitwiseExpression
    : Expression '&' Expression           { $$ = $1 + " & " + $3; }
    | Expression '|' Expression           { $$ = $1 + " | " + $3; }
    | Expression '^' Expression           { $$ = $1 + " ^ " + $3; }
    ;

LogicalExpression
    : Expression EQ_OP  Expression        { $$ = $1 + " === " + $3; }
    | Expression NE_OP  Expression        { $$ = $1 + " !== " + $3; }
    | Expression LT_OP  Expression        { $$ = $1 + " < "   + $3; }
    | Expression LE_OP  Expression        { $$ = $1 + " <= "  + $3; }
    | Expression GT_OP  Expression        { $$ = $1 + " > "   + $3; }
    | Expression GE_OP  Expression        { $$ = $1 + " >= "  + $3; }
    | Expression OR_OP  Expression        { $$ = $1 + " || "  + $3; }
    | Expression AND_OP Expression        { $$ = $1 + " && "  + $3; }
    | NOT_OP Expression                   { $$ = "!"  + $2; }
    ;

Terminator
    : LF
    | ';'
    ;

%%

