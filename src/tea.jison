%token LF EOF
%token CONSTANT STRING IDENTIFIER
%token EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP
%token END
%token IF UNLESS ELSE ELSEIF
%token WHILE UNTIL LOOP BREAK CONTINUE

//%right '=' ADD_ASSIGN SUB_ASSIGN MUL_ASSIGN MOD_ASSIGN AND_ASSIGN OR_ASSIGN XOR_ASSIGN
//%left  '+' '-' '*' '/' '%'
//%left  '&' '|' '^'
//%right EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP NOT_OP
//%right TYPEOF

%start Program

%%

Program
    : Body EOF                   { return $1; }
    ;

Body
    : Statement {
        $$ = [];
        if (typeof $1 != "string") {
            $$.push($1);
        }
    }
    | Body Statement {
        if (typeof $2 != "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    ;

Statement
    : ExpressionStatement             { $$ = $1; }
    | SelectionStatement              { $$ = $1; }
    | IterationStatement              { $$ = $1; }
    | JumpStatement                   { $$ = $1; }
    ;

UnterminatedStatement
    : Expression                      { $$ = $1; }
//    | UnterminatedSelectionStatement  { $$ = $1; }
//    | UnterminatedIterationStatement  { $$ = $1; }
    | Jump       { $$ = $1; }
    ;

ExpressionStatement
    : Terminator
    | Expression Terminator           { $$ = $1; }
    ;

PrimaryExpression
    : IDENTIFIER                                         { $$ = [ "ident",  $1 ]; }
    | CONSTANT                                           { $$ = [ "const",  $1 ]; }
    | STRING                                             { $$ = [ "string", $1 ]; }
    | Array                                              { $$ = $1; }
    | Object                                             { $$ = $1; }
    | '(' Expression ')'                                 { $$ = [ "paren",  $2 ]; }
    | '(' Expression LF ')'                              { $$ = [ "paren",  $2 ]; }
    | '(' LF Expression LF ')'                           { $$ = [ "paren",  $3 ]; }
    | '(' LF Expression ')'                              { $$ = [ "paren",  $3 ]; }
    ;

PostfixExpression
    : PrimaryExpression                                  { $$ = $1; }
//    | PostfixExpression '[' Expression ']'               { $$ = [ "access", $1, $3 ]; }
//    | PostfixExpression '(' ')'                          { $$ = [ "invoke", $1 ]; }
//    | PostfixExpression '(' ArgumentExpressionList ')'   { $$ = [ "invoke", $1, $3 ]; }
    ;

//ArgumentExpressionList
//    : AssignmentExpression                               { $$ = []; }
//    | ArgumentExpressionList ',' AssignmentExpression    { $1.push($3); $$ = $1; }
//    ;

UnaryExpression
    : PostfixExpression                                  { $$ = $1; }
    | NOT_OP UnaryExpression                             { $$ = [ "not", $2 ]; }
    | TYPEOF UnaryExpression                             { $$ = [ "typeof", $2 ]; }
    ;

MultiplicativeExpression
	: UnaryExpression                                    { $$ = $1; }
	| MultiplicativeExpression '*' UnaryExpression       { $$ = [ "op", "*", $1, $3 ]; }
	| MultiplicativeExpression '/' UnaryExpression       { $$ = [ "op", "/", $1, $3 ]; }
	| MultiplicativeExpression '%' UnaryExpression       { $$ = [ "op", "%", $1, $3 ]; }
	;

AdditiveExpression
	: MultiplicativeExpression                           { $$ = $1; }
	| AdditiveExpression '+' MultiplicativeExpression    { $$ = [ "op", "+", $1, $3 ]; }
	| AdditiveExpression '-' MultiplicativeExpression    { $$ = [ "op", "-", $1, $3 ]; }
	;

ShiftExpression
	: AdditiveExpression                                 { $$ = $1; }
	| ShiftExpression LEFT_OP  AdditiveExpression        { $$ = [ "op", "<<", $1, $3 ]; }
	| ShiftExpression RIGHT_OP AdditiveExpression        { $$ = [ "op", ">>", $1, $3 ]; }
	;

RelationalExpression
	: ShiftExpression                                    { $$ = $1; }
	| RelationalExpression LT_OP ShiftExpression         { $$ = [ "op", "<", $1, $3 ]; }
	| RelationalExpression GT_OP ShiftExpression         { $$ = [ "op", ">", $1, $3 ]; }
	| RelationalExpression LE_OP ShiftExpression         { $$ = [ "op", "<=", $1, $3 ]; }
	| RelationalExpression GE_OP ShiftExpression         { $$ = [ "op", ">=", $1, $3 ]; }
	;

EqualityExpression
	: RelationalExpression                               { $$ = $1; }
	| EqualityExpression EQ_OP RelationalExpression      { $$ = [ "op", "===", $1, $3 ]; }
	| EqualityExpression NE_OP RelationalExpression      { $$ = [ "op", "!==", $1, $3 ]; }
	;

AndExpression
	: EqualityExpression                                 { $$ = $1; }
	| AndExpression '&' EqualityExpression               { $$ = [ "op", "&", $1, $3 ]; }
	;

ExclusiveOrExpression
	: AndExpression                                      { $$ = $1; }
	| ExclusiveOrExpression '^' AndExpression            { $$ = [ "op", "^", $1, $3 ]; }
	;

InclusiveOrExpression
	: ExclusiveOrExpression                              { $$ = $1; }
	| InclusiveOrExpression '|' ExclusiveOrExpression    { $$ = [ "op", "|", $1, $3 ]; }
	;

LogicalAndExpression
	: InclusiveOrExpression                              { $$ = $1; }
	| LogicalAndExpression AND_OP InclusiveOrExpression  { $$ = [ "op", "&&", $1, $3 ]; }
	;

LogicalOrExpression
	: LogicalAndExpression                               { $$ = $1; }
	| LogicalOrExpression OR_OP LogicalAndExpression     { $$ = [ "op", "||", $1, $3 ]; }
	;

ConditionalExpression
    : LogicalOrExpression                                          { $$ = $1; }
    | LogicalOrExpression '?' Expression ':' ConditionalExpression { $$ = [ "cond", $1, $3, $5 ]; }
    ;

AssignmentExpression
    : ConditionalExpression                                        { $$ = $1; }
    | PostfixExpression AssignmentOperator AssignmentExpression    { $$ = [ "assign", $2, $1, $3 ] }
    ;

AssignmentOperator
	: '='           { $$ = $1; }
	| MUL_ASSIGN    { $$ = $1; }
	| DIV_ASSIGN    { $$ = $1; }
	| MOD_ASSIGN    { $$ = $1; }
	| ADD_ASSIGN    { $$ = $1; }
	| SUB_ASSIGN    { $$ = $1; }
	| LEFT_ASSIGN   { $$ = $1; }
	| RIGHT_ASSIGN  { $$ = $1; }
	| AND_ASSIGN    { $$ = $1; }
	| XOR_ASSIGN    { $$ = $1; }
	| OR_ASSIGN     { $$ = $1; }
	;

Expression
    : AssignmentExpression  { $$ = $1; }
    ;

Array
    : '[' ']'                                           { $$ = [ "array" ]; }
    | '[' DeclarationList ']'                           { $$ = [ "array", $2 ]; }
    | '[' DeclarationList LF ']'                        { $$ = [ "array", $2 ]; }
    | '[' LF DeclarationList LF ']'                     { $$ = [ "array", $3 ]; }
    | '[' LF DeclarationList ']'                        { $$ = [ "array", $3 ]; }
    ;

DeclarationList
    : Expression                            { $$ = [ $1 ]; }
    | DeclarationList ',' Expression        { $1.push($3); $$ = $1; }
    | DeclarationList ',' LF Expression     { $1.push($4); $$ = $1; }
    | DeclarationList LF ',' LF Expression  { $1.push($5); $$ = $1; }
    | DeclarationList LF ',' Expression     { $1.push($4); $$ = $1; }
    ;

Object
    : '{' '}'                                           { $$ = [ "object" ]; }
    | '{' ObjectDeclarationList '}'                     { $$ = [ "object", $2 ]; }
    | '{' ObjectDeclarationList LF '}'                  { $$ = [ "object", $2 ]; }
    | '{' LF ObjectDeclarationList LF '}'               { $$ = [ "object", $3 ]; }
    | '{' LF ObjectDeclarationList '}'                  { $$ = [ "object", $3 ]; }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = [ $1 ]; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $1.push($3); $$ = $1; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $1.push($4); $$ = $1; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $1.push($5); $$ = $1; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $1.push($4); $$ = $1; }
    ;

ObjectDeclaration
    : Expression ':' Expression                         { $$ = [ "assoc", $1, $3 ]; }
    | Expression ':' LF Expression                      { $$ = [ "assoc", $1, $4 ]; }
    | Expression LF ':' LF Expression                   { $$ = [ "assoc", $1, $5 ]; }
    | Expression LF ':' Expression                      { $$ = [ "assoc", $1, $4 ]; }
    ;

SelectionStatement
    : IF Expression Then Body END                               { $$ = [ "if", $2, $4 ]; }
    | IF Expression Then Body ElseStatement END                 { $$ = [ "if", $2, $4, [ $5 ] ]; }
    | IF Expression Then Body ElsifStatement END                { $$ = [ "if", $2, $4, $5 ]; }
    | IF Expression Then Body ElsifStatement ElseStatement END  { $5.push($6); $$ = [ "if", $2, $4, $5 ]; }
    | UNLESS Expression Then Body END                           { $$ = [ "unless", $2, $4 ]; }
    | UNLESS Expression Then Body ElseStatement END             { $$ = [ "unless", $2, $4, [ $5 ] ]; }
//    | Statement IF Expression Terminator                        { $$ = [ "if", $3, [ $1 ] ]; }
//    | Statement UNLESS Expression Terminator                    { $$ = [ "unless", $3, [ $1 ] ]; }
    | UnterminatedStatement IF Expression Terminator                       { $$ = [ "if", $3, [ $1 ] ]; }
    | UnterminatedStatement UNLESS Expression Terminator                   { $$ = [ "unless", $3, [ $1 ] ]; }
    | CASE Expression Terminator WhenStatement END              { $$ = [ "case", $2, $4 ]; }
    ;

ElsifStatement
    : ELSIF Expression Then Body                 { $$ = [ [ "elsif", $2, $4 ] ]; }
    | ElsifStatement ELSIF Expression Then Body  { $1.push([ "elsif", $3, $5 ]); $$ = $1; }
    ;

ElseStatement
    : ELSE Body  { $$ = [ "else", $2 ]; }
    ;

WhenStatement
    : WHEN DeclarationList Then Body                { $$ = [ [ "when", $2, $4 ] ]; }
    | WhenStatement WHEN DeclarationList Then Body  { $1.push([ "when", $3, $5 ]); $$ = $1; } }
    | WhenStatement ElseStatement                   { $1.push($2); $$ = $1; }
    | ElseStatement                                 { $$ = [ $1 ]; }
    ;

IterationStatement
    : WHILE Expression Do Body END            { $$ = [ "while", $2, $4 ]; }
    | UNTIL Expression Do Body END            { $$ = [ "until", $2, $4 ]; }
//    | Statement WHILE Expression Terminator   { $$ = [ "while", $3, [ $1 ] ]; }
//    | Statement UNTIL Expression Terminator   { $$ = [ "until", $3, [ $1 ] ]; }
    | UnterminatedStatement WHILE Expression Terminator  { $$ = [ "while", $3, [ $1 ] ]; }
    | UnterminatedStatement UNTIL Expression Terminator  { $$ = [ "until", $3, [ $1 ] ]; }
    | LOOP Do Body END                        { $$ = [ "loop", $3 ]; }
    ;

JumpStatement
    : Jump Terminator    { $$ = $1; }
    ;

Jump
    : BREAK                  { $$ = [ "keyword", "break" ]; }
    | CONTINUE               { $$ = [ "keyword", "continue" ]; }
    ;

Then
    : THEN
    | Terminator
    ;

Do
    : DO
    | Terminator
    ;

Terminator
    : LF
    | ';'
    ;

%%

