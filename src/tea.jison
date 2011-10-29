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
    : Body EOF {
        $$ = $1;
        console.log(JSON.stringify($$));
    }
    ;

Body
    : Body Terminator
    | Body Statement Terminator {
        // pushes the statement ($2) to the current body ($1)
        $1.push($2);
        $$ = $1;
    }
    | {
        // empty body => new body!
        $$ = [];
    }
    ;

Statement
    : PrimaryExpression     { $$ = $1; }
    | ConditionalStatement  { $$ = $1; }
    | CaseStatement         { $$ = $1; }
    | LoopStatement         { $$ = $1; }
    ;

CaseStatement
    : CASE Expression LF WhenStatement END {
        $$ = [ "case", $2, $4 ];
    }
    ;

WhenStatement
    : WHEN PrimaryExpression Body {
        $$ = [ "when", $2, $3 ];
    }
    | WhenStatement WHEN PrimaryExpression Body {
        $$ = [ $1, "when", $3, $4 ];
    }
    ;

ConditionalStatement
    : IF PrimaryExpression Body END {
        $$ = [ "if", $2, $3 ];
    }
    | IF PrimaryExpression Body ElseStatement END {
        $$ = [ "if", $2, $3, $4 ];
    }
    | IF PrimaryExpression Body ElsifStatement END {
        $$ = [ "if", $2, $3, $4 ];
    }
    | IF PrimaryExpression Body ElsifStatement ElseStatement END {
        $$ = [ "if", $2, $3, $4, $5 ];
    }
    | UNLESS PrimaryExpression Body END {
        $$ = [ "unless", $2, $3 ];
    }
    | PrimaryExpression IF PrimaryExpression {
        $$ = [ "if", $3, $1 ];
    }
    | PrimaryExpression UNLESS PrimaryExpression {
        $$ = [ "unless", $3, $1 ];
    }
    ;

ElseStatement
    : ELSE Body {
        $$ = [ "else", $2 ];
    }
    ;

ElsifStatement
    : ELSIF PrimaryExpression Body {
        $$ = [ "elsif", $2, $3 ];
    }
    | ELSIF PrimaryExpression Body ElsifStatement {
        $$ = [ "elsif", $2, $3, $4 ];
    }
    ;

LoopStatement
    : WHILE PrimaryExpression Body END {
        $$ = [ "while", $2, $3 ];
    }
    | UNTIL PrimaryExpression Body END {
        $$ = [ "until", $2, $3 ];
    }
    | PrimaryExpression WHILE PrimaryExpression {
        $$ = [ "while", $3, $1 ];
    }
    | PrimaryExpression UNTIL PrimaryExpression {
        $$ = [ "until", $3, $1 ];
    }
    | LOOP Body END {
        $$ = [ "loop", $2 ];
    }
    ;

PrimaryExpression
    : Expression                { $$ = $1; }
    | AssignExpression          { $$ = $1; }
    | BREAK                     { $$ = "break"; }
    | CONTINUE                  { $$ = "continue"; }
    ;

Expression
    : CONSTANT                  { $$ = [ "const", $1 ]; }
    | IDENTIFIER                { $$ = [ "ident", $1 ]; }
    | Array                     { $$ = $1; }
    | Object                    { $$ = $1; }
    | STRING_LITERAL            { $$ = $1.replace(/\n/g, "\\\n"); }
    | STRING                    { $$ = $1.replace(/\n/g, "\\\n"); }
    | MathExpression            { $$ = $1; }
    | BitwiseExpression         { $$ = $1; }
    | LogicalExpression         { $$ = $1; }
    | TYPEOF Expression         { $$ = [ "typeof", $2 ]; }
    | '(' Expression ')'        { $$ = [ "paren",  $2 ]; }
    | '(' Expression LF ')'     { $$ = [ "paren",  $2 ]; }
    | '(' LF Expression LF ')'  { $$ = [ "paren",  $3 ]; }
    | '(' LF Expression ')'     { $$ = [ "paren",  $3 ]; }
    ;

Array
    : '[' ']'                                           { $$ = [ "array" ]; }
    | '[' DeclarationList ']'                           { $$ = [ "array", $2 ]; }
    | '[' DeclarationList LF ']'                        { $$ = [ "array", $2 ]; }
    | '[' LF DeclarationList LF ']'                     { $$ = [ "array", $3 ]; }
    | '[' LF DeclarationList ']'                        { $$ = [ "array", $3 ]; }
    ;

DeclarationList
    : Expression                                        { $$ = $1; }
    | DeclarationList ',' Expression                    { $$ = [ "decl_list", $1, $3 ]; }
    | DeclarationList ',' LF Expression                 { $$ = [ "decl_list", $1, $4 ]; }
    | DeclarationList LF ',' LF Expression              { $$ = [ "decl_list", $1, $5 ]; }
    | DeclarationList LF ',' Expression                 { $$ = [ "decl_list", $1, $4 ]; }
    ;

Object
    : '{' '}'                                           { $$ = [ "object" ]; }
    | '{' ObjectDeclarationList '}'                     { $$ = [ "object", $2 ]; }
    | '{' ObjectDeclarationList LF '}'                  { $$ = [ "object", $2 ]; }
    | '{' LF ObjectDeclarationList LF '}'               { $$ = [ "object", $3 ]; }
    | '{' LF ObjectDeclarationList '}'                  { $$ = [ "object", $3 ]; }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = $1; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $$ = [ "object_decl_list", $1, $3 ]; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $$ = [ "object_decl_list", $1, $4 ]; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $$ = [ "object_decl_list", $1, $5 ]; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $$ = [ "object_decl_list", $1, $4 ]; }
    ;

ObjectDeclaration
    : Expression ':' Expression                         { $$ = [ "object_decl", $1, $3 ]; }
    | Expression ':' LF Expression                      { $$ = [ "object_decl", $1, $4 ]; }
    | Expression LF ':' LF Expression                   { $$ = [ "object_decl", $1, $5 ]; }
    | Expression LF ':' Expression                      { $$ = [ "object_decl", $1, $4 ]; }
    ;

AssignExpression
    : IDENTIFIER '=' Expression           { $$ = [ "assign",  "=",  $1, $3 ]; }
    | IDENTIFIER ADD_ASSIGN   Expression  { $$ = [ "assign", "+=",  $1, $3 ]; }
    | IDENTIFIER SUB_ASSIGN   Expression  { $$ = [ "assign", "-=",  $1, $3 ]; }
    | IDENTIFIER MUL_ASSIGN   Expression  { $$ = [ "assign", "*=",  $1, $3 ]; }
    | IDENTIFIER MOD_ASSIGN   Expression  { $$ = [ "assign", "%=",  $1, $3 ]; }
    | IDENTIFIER AND_ASSIGN   Expression  { $$ = [ "assign", "&=",  $1, $3 ]; }
    | IDENTIFIER OR_ASSIGN    Expression  { $$ = [ "assign", "|=",  $1, $3 ]; }
    | IDENTIFIER XOR_ASSIGN   Expression  { $$ = [ "assign", "^=",  $1, $3 ]; }
    | IDENTIFIER RIGHT_ASSIGN Expression  { $$ = [ "assign", ">>=", $1, $3 ]; }
    | IDENTIFIER LEFT_ASSIGN  Expression  { $$ = [ "assign", "<<=", $1, $3 ]; }
    ;

MathExpression
    : Expression '+' Expression           { $$ = [ "op", "+", $1, $3 ]; }
    | Expression '-' Expression           { $$ = [ "op", "-", $1, $3 ]; }
    | Expression '*' Expression           { $$ = [ "op", "*", $1, $3 ]; }
    | Expression '/' Expression           { $$ = [ "op", "/", $1, $3 ]; }
    | Expression '%' Expression           { $$ = [ "op", "%", $1, $3 ]; }
    ;

BitwiseExpression
    : Expression '&' Expression           { $$ = [ "op", "&", $1, $3 ]; }
    | Expression '|' Expression           { $$ = [ "op", "|", $1, $3 ]; }
    | Expression '^' Expression           { $$ = [ "op", "^", $1, $3 ]; }
    ;

LogicalExpression
    : Expression EQ_OP  Expression        { $$ = [ "op", "===", $1, $3 ]; }
    | Expression NE_OP  Expression        { $$ = [ "op", "!==", $1, $3 ]; }
    | Expression LT_OP  Expression        { $$ = [ "op", "<",   $1, $3 ]; }
    | Expression LE_OP  Expression        { $$ = [ "op", "<=",  $1, $3 ]; }
    | Expression GT_OP  Expression        { $$ = [ "op", ">",   $1, $3 ]; }
    | Expression GE_OP  Expression        { $$ = [ "op", ">=",  $1, $3 ]; }
    | Expression OR_OP  Expression        { $$ = [ "op", "||",  $1, $3 ]; }
    | Expression AND_OP Expression        { $$ = [ "op", "&&",  $1, $3 ]; }
    | NOT_OP Expression                   { $$ = [ "op", "!", null, $2 ]; }
    ;

Terminator
    : LF
    | ';'
    ;

%%

