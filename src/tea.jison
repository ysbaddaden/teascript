%left     '.'
%right    '!' '~' new not typeof delete
%left     '*' '/' '%'
%left     '+' '-'
%left     '<<' '>>' '>>>'
%left     in of instanceof
%left     '==' '!=' '<' '>' '<=' '>='
%left     '&&' '||' '&' '|' '^' and or
%right    '=' OP_ASGN return throw
%right    '..' '...'
%nonassoc '?' ':'

%start PROGRAM

%%

PROGRAM
    : COMPSTMT EOF    { return (new Tea.Program).init($1); }
    ;

ASTMT
    : STMT            { $$ = (new Tea.Body).init($1); }
    | COMPSTMT        -> $1
    | COMPSTMT STMT {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    |                 { $$ = (new Tea.Body).init(); }
    ;

COMPSTMT
    : TSTMT {
        $$ = (new Tea.Body).init();
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | COMPSTMT TSTMT {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    ;

TSTMT
    : LF
    | STMT LF         -> $1
    ;

STMT
    : STMT if EXPR {
        $$ = (new Tea.IfStatement).init($3, new Tea.Body().init($1));
    }
    | STMT unless EXPR {
        $$ = (new Tea.UnlessStatement).init($3, new Tea.Body().init($1));
    }
    | STMT while EXPR {
        $$ = (new Tea.WhileStatement).init($3, new Tea.Body().init($1));
    }
    | STMT until EXPR {
        $$ = (new Tea.UntilStatement).init($3, new Tea.Body().init($1));
    }
    | STMT for IDENTIFIER of EXPR {
        $$ = (new Tea.ForOfStatement).init($3, null, $5, new Tea.Body().init($1));
    }
    | STMT for IDENTIFIER ',' IDENTIFIER of EXPR {
        $$ = (new Tea.ForOfStatement).init($3, $5, $7, new Tea.Body().init($1));
    }
    | STMT for IDENTIFIER in EXPR {
        $$ = (new Tea.ForInStatement).init(false, $3, null, $5, new Tea.Body().init($1));
    }
    | STMT for IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = (new Tea.ForInStatement).init(false, $3, $5, $7, new Tea.Body().init($1));
    }
    | STMT for own IDENTIFIER in EXPR {
        $$ = (new Tea.ForInStatement).init(true, $4, null, $6, new Tea.Body().init($1));
    }
    | STMT for own IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = (new Tea.ForInStatement).init(true, $4, $6, $8, new Tea.Body().init($1));
    }
    | if EXPR THEN ASTMT end {
        $$ = (new Tea.IfStatement).init($2, $4);
    }
    | if EXPR THEN ASTMT else ASTMT end {
        $$ = (new Tea.IfStatement).init($2, $4, [ new Tea.ElseStatement().init($6) ]);
    }
    | if EXPR THEN ASTMT ELSIF end {
        $$ = (new Tea.IfStatement).init($2, $4, $5);
    }
    | if EXPR THEN ASTMT ELSIF else ASTMT end {
        $5.push((new Tea.ElseStatement).init($7));
        $$ = (new Tea.IfStatement).init($2, $4, $5);
    }
    | unless EXPR THEN ASTMT end {
        $$ = (new Tea.UnlessStatement).init($2, $4);
    }
    | while EXPR DO ASTMT end {
        $$ = (new Tea.WhileStatement).init($2, $4);
    }
    | until EXPR DO ASTMT end {
        $$ = (new Tea.UntilStatement).init($2, $4);
    }
    | loop DO ASTMT end {
        $$ = (new Tea.LoopStatement).init($3);
    }
    | case EXPR WHEN end {
        $$ = (new Tea.CaseStatement).init($2, $3);
    }
    | case EXPR WHEN else ASTMT end {
        $3.push((new Tea.ElseStatement).init($5));
        $$ = (new Tea.CaseStatement).init($2, $3);
    }
    | for IDENTIFIER of EXPR DO ASTMT end {
        $$ = (new Tea.ForOfStatement).init($2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER of EXPR DO ASTMT end {
        $$ = (new Tea.ForOfStatement).init($2, $4, $6, $8);
    }
    | for IDENTIFIER in EXPR DO ASTMT end {
        $$ = (new Tea.ForInStatement).init(false, $2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = (new Tea.ForInStatement).init(false, $2, $4, $6, $8);
    }
    | for own IDENTIFIER in EXPR DO ASTMT end {
        $$ = (new Tea.ForInStatement).init(true, $3, null, $5, $7);
    }
    | for own IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = (new Tea.ForInStatement).init(true, $3, $5, $7, $9);
    }
    | object LHS OSTMT end                       { $$ = (new Tea.Prototype).init($2, null, $3); }
    | object LHS '<' LHS OSTMT end               { $$ = (new Tea.Prototype).init($2, $4, $5); }
    | FUNCTION                                   -> $1
    | return                                     { $$ = (new Tea.ReturnStatement).init(); }
    | return EXPR                                { $$ = (new Tea.ReturnStatement).init($2); }
    | delete EXPR                                { $$ = (new Tea.DeleteStatement).init($2); }
    | break                                      { $$ = (new Tea.Statement).init(new Tea.Keyword().init("break")); }
    | next                                       { $$ = (new Tea.Statement).init(new Tea.Keyword().init("continue")); }
    | continue                                   { $$ = (new Tea.Statement).init(new Tea.Keyword().init("continue")); }
    | EXPR                                       { $$ = (new Tea.Statement).init($1); }
    | throw EXPR                                 { $$ = (new Tea.ThrowStatement).init($2); }
    | begin LF ASTMT RESCUE end                  { $$ = (new Tea.BeginStatement).init($3, $4); }
    | begin LF ASTMT RESCUE ensure LF ASTMT end  { $$ = (new Tea.BeginStatement).init($3, $4, $7); }
    | begin LF ASTMT ensure LF ASTMT end         { $$ = (new Tea.BeginStatement).init($3, null, $6); }
    ;

RESCUE
    : rescue LF ASTMT                                    { $$ = [ (new Tea.RescueStatement).init([], null, $3) ]; }
    | rescue '=>' IDENTIFIER LF ASTMT                    { $$ = [ (new Tea.RescueStatement).init([], $3, $5) ]; }
    | rescue RESCUE_ARGS LF ASTMT                        { $$ = [ (new Tea.RescueStatement).init($2, null, $4) ]; }
    | rescue RESCUE_ARGS '=>' IDENTIFIER LF ASTMT        { $$ = [ (new Tea.RescueStatement).init($2, $4, $6) ]; }
    | RESCUE rescue LF ASTMT                             { $1.push((new Tea.RescueStatement).init([], null, $4)); $$ = $1; }
    | RESCUE rescue '=>' IDENTIFIER LF ASTMT             { $1.push((new Tea.RescueStatement).init([], $4, $6));   $$ = $1; }
    | RESCUE rescue RESCUE_ARGS LF ASTMT                 { $1.push((new Tea.RescueStatement).init($3, null, $5)); $$ = $1; }
    | RESCUE rescue RESCUE_ARGS '=>' IDENTIFIER LF ASTMT { $1.push((new Tea.RescueStatement).init($3, $5, $7));   $$ = $1; }
    ;

RESCUE_ARGS
    : IDENTIFIER                            { $$ = [ $1 ]; }
    | RESCUE_ARGS ',' IDENTIFIER            { $1.push($3); $$ = $1; }
    ;

OSTMT
    : OFUNC                                 { $$ = [ $1 ]; }
    | COMPFUNC                              -> $1
    | COMPFUNC OFUNC                        {  $1.push($2); $$ = $1; }
    ;

COMPFUNC
    : TFUNC {
        $$ = [];
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | COMPFUNC TFUNC {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    ;

TFUNC
    : LF
    | OFUNC LF                              -> $1
    ;

OFUNC
    : FUNCTION                              -> $1
    ;

FUNCTION
    : def FUNCNAME LF ASTMT end                          { $$ = (new Tea.Function).init($2, null, $4); }
    | def FUNCNAME INHERIT LF ASTMT end                  { $$ = (new Tea.Function).init($2, null, $5, $3); }
    | def FUNCNAME '(' ARGLIST ')' ASTMT end             { $$ = (new Tea.Function).init($2, $4,   $6); }
    | def FUNCNAME '(' ARGLIST ')' INHERIT LF ASTMT end  { $$ = (new Tea.Function).init($2, $4,   $8, $6); }
    | def '-' FUNCNAME LF ASTMT end                      { $$ = (new Tea.Function).init($3, null, $5, null, "-"); }
    | def '-' FUNCNAME '(' ARGLIST ')' ASTMT end         { $$ = (new Tea.Function).init($3, $5,   $7, null, "-"); }
    | def '+' FUNCNAME LF ASTMT end                      { $$ = (new Tea.Function).init($3, null, $5, null, "+"); }
    | def '+' FUNCNAME '(' ARGLIST ')' ASTMT end         { $$ = (new Tea.Function).init($3, $5,   $7, null, "+"); }
    ;

INHERIT
    : '<' FUNCNAME  -> $2
    ;

FUNCNAME
    : IDENTIFIER                            { $$ = $1; }
    | FUNCNAME '.' IDENTIFIER               { $$ = (new Tea.Dot).init($1, $3); }
    ;

ELSIF
    : elsif EXPR THEN ASTMT                 { $$ = [ (new Tea.ElsifStatement).init($2, $4) ]; }
    | ELSIF elsif EXPR THEN ASTMT           { $1.push((new Tea.ElsifStatement).init($3, $5)); $$ = $1; }
    ;

WHEN
    : when ARGS THEN ASTMT                  { $$ = [ (new Tea.WhenStatement).init($2, $4) ]; }
    | LF when ARGS THEN ASTMT               { $$ = [ (new Tea.WhenStatement).init($3, $5) ]; }
    | WHEN when ARGS THEN ASTMT             { $1.push((new Tea.WhenStatement).init($3, $5)); $$ = $1; }
    ;

DO   : do   | LF do   | LF ;
THEN : then | LF then | LF ;

EXPR
    : CONDITIONAL                           -> $1
    | LHS '=' EXPR                          { $$ = (new Tea.Operation).init("=", $1, $3); }
    | LHS OP_ASGN EXPR                      { $$ = (new Tea.Operation).init($2,  $1, $3); }
    | EXPR 'instanceof' EXPR                { $$ = (new Tea.Operation).init("instanceof", $1, $3); }
    ;

CONDITIONAL
    : LOGICAL                               -> $1
    | LOGICAL '?' EXPR ':' CONDITIONAL      { $$ = (new Tea.Condition).init($1, $3, $5); }
    ;

LOGICAL
    : RELATIONAL                            -> $1
    | LOGICAL '||' LOGICAL                  { $$ = (new Tea.Operation).init("||", $1, $3); }
    | LOGICAL or   LOGICAL                  { $$ = (new Tea.Operation).init("||", $1, $3); }
    | LOGICAL '&&' LOGICAL                  { $$ = (new Tea.Operation).init("&&", $1, $3); }
    | LOGICAL and  LOGICAL                  { $$ = (new Tea.Operation).init("&&", $1, $3); }
    | LOGICAL '|'  LOGICAL                  { $$ = (new Tea.Operation).init("|",  $1, $3); }
    | LOGICAL '^'  LOGICAL                  { $$ = (new Tea.Operation).init("^",  $1, $3); }
    | LOGICAL '&'  LOGICAL                  { $$ = (new Tea.Operation).init("&",  $1, $3); }
    ;

RELATIONAL
    : OPERATION                             -> $1
    | RELATIONAL '==' RELATIONAL            { $$ = (new Tea.Operation).init("===", $1, $3); }
    | RELATIONAL '!=' RELATIONAL            { $$ = (new Tea.Operation).init("!==", $1, $3); }
    | RELATIONAL '<'  RELATIONAL            { $$ = (new Tea.Operation).init("<",   $1, $3); }
    | RELATIONAL '>'  RELATIONAL            { $$ = (new Tea.Operation).init(">",   $1, $3); }
    | RELATIONAL '<=' RELATIONAL            { $$ = (new Tea.Operation).init("<=",  $1, $3); }
    | RELATIONAL '>=' RELATIONAL            { $$ = (new Tea.Operation).init(">=",  $1, $3); }
    ;

OPERATION
    : UNARY                                 -> $1
    | OPERATION '<<'  OPERATION             { $$ = (new Tea.Operation).init("<<",  $1, $3); }
    | OPERATION '>>'  OPERATION             { $$ = (new Tea.Operation).init(">>",  $1, $3); }
    | OPERATION '>>>' OPERATION             { $$ = (new Tea.Operation).init(">>>", $1, $3); }
    | OPERATION '+'   OPERATION             { $$ = (new Tea.Operation).init("+",   $1, $3); }
    | OPERATION '-'   OPERATION             { $$ = (new Tea.Operation).init("-",   $1, $3); }
    | OPERATION '*'   OPERATION             { $$ = (new Tea.Operation).init("*",   $1, $3); }
    | OPERATION '/'   OPERATION             { $$ = (new Tea.Operation).init("/",   $1, $3); }
    | OPERATION '%'   OPERATION             { $$ = (new Tea.Operation).init("%",   $1, $3); }
    ;

UNARY
    : PRIMARY                               -> $1
    | '+'    PRIMARY                        { $$ = (new Tea.Unary).init("+",      $2); }
    | '-'    PRIMARY                        { $$ = (new Tea.Unary).init("-",      $2); }
    | '~'    PRIMARY                        { $$ = (new Tea.Unary).init("~",      $2); }
    | not    PRIMARY                        { $$ = (new Tea.Unary).init("!",      $2); }
    | typeof PRIMARY                        { $$ = (new Tea.Unary).init("typeof", $2); }
    | new    PRIMARY                        {
        if ($2 instanceof Tea.Call) {
            $$ = (new Tea.NewExpression).init($2.expression, $2.args);
        } else {
            $$ = (new Tea.NewExpression).init($2);
        }
    }
    ;

PRIMARY
    : LHS                                   -> $1
    | LITERAL                               -> $1
    | ARRAY                                 -> $1
    | OBJECT                                -> $1
    | LAMBDA                                -> $1
    | '(' EXPR ')'                          { $$ = (new Tea.Paren).init($2); }
    | PRIMARY '(' CALL_ARGS ')'             { $$ = (new Tea.Call).init($1, $3); }
    ;

ARRAY
    : '[' ']'                               { $$ = (new Tea.Array).init(); }
    | '[' ARGS ']'                          { $$ = (new Tea.Array).init($2); }
    | '[' ARGS ',' ']'                      { $$ = (new Tea.Array).init($2); }
    ;

OBJECT
    : '{' '}'                               { $$ = (new Tea.Object).init(); }
    | '{' ASSOCS '}'                        { $$ = (new Tea.Object).init($2); }
    | '{' ASSOCS ',' '}'                    { $$ = (new Tea.Object).init($2); }
    ;

LAMBDA
    : '->' '{' ASTMT '}'                    { $$ = (new Tea.Function).init(null, [], $3); }
    | '->' '(' CALL_ARGS ')' '{' ASTMT '}'  { $$ = (new Tea.Function).init(null, $3, $6); }
    ;

RANGE
    : EXPR '..'  EXPR                       { $$ = (new Tea.Range).init("inclusive", $1, $3); }
    | EXPR '...' EXPR                       { $$ = (new Tea.Range).init("exclusive", $1, $3); }
    ;

LHS
    : IDENTIFIER                            -> $1
    | PRIMARY '.' DOTABLE                   { $$ = (new Tea.Dot).init($1, $3); }
    | PRIMARY '[' EXPR ']'                  { $$ = (new Tea.Index).init($1, $3); }
    | PRIMARY '[' RANGE ']'                 { $$ = (new Tea.Index).init($1, $3); }
    ;

DOTABLE
    : IDENTIFIER                            -> $1
    | delete                                { $$ = (new Tea.Identifier).init('delete'); }
    | loop                                  { $$ = (new Tea.Identifier).init('loop'); }
    | next                                  { $$ = (new Tea.Identifier).init('next'); }
    | object                                { $$ = (new Tea.Identifier).init('object'); }
    | own                                   { $$ = (new Tea.Identifier).init('own'); }
    | then                                  { $$ = (new Tea.Identifier).init('then'); }
    | when                                  { $$ = (new Tea.Identifier).init('when'); }
    ;

ARGLIST
    : SUBARGLIST                            -> $1
    | SUBARGLIST ',' '*' IDENTIFIER         { $1.push((new Tea.Splat).init($4)); $$ = $1; }
    | '*' IDENTIFIER                        { $$ = [ (new Tea.Splat).init($2) ]; }
    |                                       { $$ = []; }
    ;

SUBARGLIST
    : IDENTIFIER                            { $$ = [ $1 ]; }
    | IDENTIFIER '=' EXPR                   { $$ = [ (new Tea.Operation).init("=", $1, $3) ]; }
    | SUBARGLIST ',' IDENTIFIER             { $1.push($3); $$ = $1; }
    | SUBARGLIST ',' IDENTIFIER '=' EXPR    {
        $1.push((new Tea.Operation).init("=", $3, $5));
        $$ = $1;
    }
    ;

CALL_ARGS
    : SUB_CALL_ARGS                         -> $1
    | SUB_CALL_ARGS ',' ASSOCS              { $1.push((new Tea.Object).init($3)); $$ = $1; }
    | ASSOCS                                { $$ = [ (new Tea.Object).init($1) ]; }
    |
    ;

SUB_CALL_ARGS
    : EXPR                                  { $$ = [ $1 ]; }
    | '*' EXPR                              { $$ = [ (new Tea.Splat).init($2) ]; }
    | SUB_CALL_ARGS ',' EXPR                { $1.push($3); $$ = $1; }
    | SUB_CALL_ARGS ',' '*' EXPR            { $1.push((new Tea.Splat).init($4)); $$ = $1; }
    ;

ARGS
    : EXPR              { $$ = [ $1 ]; }
    | ARGS ',' EXPR     { $1.push($3); $$ = $1; }
    ;

ASSOCS
    : ASSOC             { $$ = [ $1 ]; }
    | ASSOCS ',' ASSOC  { $1.push($3); $$ = $1; }
    ;

ASSOC
    : EXPR ':' EXPR     { $$ = (new Tea.Assoc).init($1, $3); }
    ;

IDENTIFIER
    : identifier        { $$ = (new Tea.Identifier).init($1); }
    ;

LITERAL
    : true              { $$ = (new Tea.Keyword).init($1); }
    | false             { $$ = (new Tea.Keyword).init($1); }
    | nil               { $$ = (new Tea.Keyword).init($1); }
    | null              { $$ = (new Tea.Keyword).init($1); }
    | undefined         { $$ = (new Tea.Keyword).init($1); }
    | NUMBER            { $$ = (new Tea.Number).init($1); }
    | STRING            { $$ = (new Tea.String).init($1); }
    | REGEXP            { $$ = (new Tea.RegExp).init($1); }
    ;

OP_ASGN
    : '+='  -> $1
    | '-='  -> $1
    | '*='  -> $1
    | '/='  -> $1
    | '%='  -> $1
    | '|='  -> $1
    | '&='  -> $1
    | '^='  -> $1
    | '>>=' -> $1
    | '<<=' -> $1
    | '||=' -> $1
    ;

