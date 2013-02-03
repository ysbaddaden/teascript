%right and or not typeof instanceof
%right '=' OP_ASGN
%right '..' '...'
%left  '+' '-' '|' '^' '&' '~'
%right '*' '/' '%'
%left  '>' '>=' '<' '<=' '==' '!='
%right '<<' '>>'
%left  '&&' '||'
%left  '?' ':'

%start PROGRAM

%%

PROGRAM
    : COMPSTMT EOF    { return new T.Program($1); }
    ;

ASTMT
    : STMT            { $$ = new T.Body($1); }
    | COMPSTMT        -> $1
    | COMPSTMT STMT {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    |                 { $$ = new T.Body(); }
    ;

COMPSTMT
    : TSTMT {
        $$ = new T.Body();
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
        $$ = new T.IfStatement($3, new T.Body($1));
    }
    | STMT unless EXPR {
        $$ = new T.UnlessStatement($3, new T.Body($1));
    }
    | STMT while EXPR {
        $$ = new T.WhileStatement($3, new T.Body($1));
    }
    | STMT until EXPR {
        $$ = new T.UntilStatement($3, new T.Body($1));
    }
    | STMT for IDENTIFIER of EXPR {
        $$ = new T.ForOfStatement($3, $5, new T.Body($1));
    }
    | STMT for IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(false, $3, null, $5, new T.Body($1));
    }
    | STMT for IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(false, $3, $5, $7, new T.Body($1));
    }
    | STMT for own IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(true, $4, null, $6, new T.Body($1));
    }
    | STMT for own IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(true, $4, $6, $8, new T.Body($1));
    }
    | if EXPR THEN ASTMT end {
        $$ = new T.IfStatement($2, $4);
    }
    | if EXPR THEN ASTMT else ASTMT end {
        $$ = new T.IfStatement($2, $4, [ new T.ElseStatement($6) ]);
    }
    | if EXPR THEN ASTMT ELSIF end {
        $$ = new T.IfStatement($2, $4, $5);
    }
    | if EXPR THEN ASTMT ELSIF else ASTMT end {
        $5.push(new T.ElseStatement($7));
        $$ = new T.IfStatement($2, $4, $5);
    }
    | unless EXPR THEN ASTMT end {
        $$ = new T.UnlessStatement($2, $4);
    }
    | while EXPR DO ASTMT end {
        $$ = new T.WhileStatement($2, $4);
    }
    | until EXPR DO ASTMT end {
        $$ = new T.UntilStatement($2, $4);
    }
    | loop DO ASTMT end {
        $$ = new T.LoopStatement($3);
    }
    | case EXPR WHEN end {
        $$ = new T.CaseStatement($2, $3);
    }
    | case EXPR WHEN else ASTMT end {
        $3.push(new T.ElseStatement($5));
        $$ = new T.CaseStatement($2, $3);
    }
    | for IDENTIFIER of EXPR DO ASTMT end {
        $$ = new T.ForOfStatement($2, $4, $6);
    }
    | for IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(false, $2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(false, $2, $4, $6, $8);
    }
    | for own IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(true, $3, null, $5, $7);
    }
    | for own IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(true, $3, $5, $7, $9);
    }
    | object LHS OSTMT end                { $$ = new T.Prototype($2, null, $3); }
    | object LHS '<' LHS OSTMT end { $$ = new T.Prototype($2, $4, $5); }
    | FUNCTION                                   -> $1
    | return                                     { $$ = new T.ReturnStatement(); }
    | return EXPR                                { $$ = new T.ReturnStatement($2); }
    | delete EXPR                                { $$ = new T.DeleteStatement($2); }
    | break                                      { $$ = new T.Statement(new T.Keyword("break")); }
    | continue                                   { $$ = new T.Statement(new T.Keyword("continue")); }
    | EXPR                                       { $$ = new T.Statement($1); }
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
    | STATIC                                -> $1
    ;

FUNCTION
    : def IDENTIFIER ARGDECL ASTMT end      { $$ = new T.Function($2, $3, $4); }
    ;

STATIC
    : def '+' IDENTIFIER ARGDECL ASTMT end  { $$ = new T.StaticFunction($3, $4, $5); }
    ;

ELSIF
    : elsif EXPR THEN ASTMT                 { $$ = [ new T.ElsifStatement($2, $4) ]; }
    | ELSIF elsif EXPR THEN ASTMT           { $1.push(new T.ElsifStatement($3, $5)); $$ = $1; }
    ;

WHEN
    : when ARGS THEN ASTMT                  { $$ = [ new T.WhenStatement($2, $4) ]; }
    | LF when ARGS THEN ASTMT               { $$ = [ new T.WhenStatement($3, $5) ]; }
    | WHEN when ARGS THEN ASTMT             { $1.push(new T.WhenStatement($3, $5)); $$ = $1; }
    ;

DO   : do   | LF do   | LF ;
THEN : then | LF then | LF ;

EXPR
    : LHS '=' EXPR                          { $$ = new T.Operation("=", $1, $3); }
    | LHS OP_ASGN EXPR                      { $$ = new T.Operation($2, $1, $3); }
    | EXPR '..' EXPR                        { $$ = new T.Range("inclusive", $1, $3); }
    | EXPR '...' EXPR                       { $$ = new T.Range("exclusive", $1, $3); }
    | EXPR '+'   EXPR                       { $$ = new T.Operation("+", $1, $3); }
    | EXPR '-'   EXPR                       { $$ = new T.Operation("-", $1, $3); }
    | EXPR '*'   EXPR                       { $$ = new T.Operation("*", $1, $3); }
    | EXPR '/'   EXPR                       { $$ = new T.Operation("/", $1, $3); }
    | EXPR '%'   EXPR                       { $$ = new T.Operation("%", $1, $3); }
    | EXPR '|'   EXPR                       { $$ = new T.Operation("|", $1, $3); }
    | EXPR '&'   EXPR                       { $$ = new T.Operation("&", $1, $3); }
    | EXPR '^'   EXPR                       { $$ = new T.Operation("^", $1, $3); }
    | EXPR '>>'  EXPR                       { $$ = new T.Operation(">>", $1, $3); }
    | EXPR '<<'  EXPR                       { $$ = new T.Operation("<<", $1, $3); }
    | EXPR '<'   EXPR                       { $$ = new T.Operation("<", $1, $3); }
    | EXPR '<='  EXPR                       { $$ = new T.Operation("<=", $1, $3); }
    | EXPR '>'   EXPR                       { $$ = new T.Operation(">", $1, $3); }
    | EXPR '>='  EXPR                       { $$ = new T.Operation(">=", $1, $3); }
    | EXPR '=='  EXPR                       { $$ = new T.Operation("===", $1, $3); }
    | EXPR '!='  EXPR                       { $$ = new T.Operation("!==", $1, $3); }
    | EXPR 'and' EXPR                       { $$ = new T.Operation("&&", $1, $3); }
    | EXPR 'or'  EXPR                       { $$ = new T.Operation("||", $1, $3); }
    | EXPR '?' EXPR ':' EXPR                { $$ = new T.Condition($1, $3, $5); }
    | UNARY                                 -> $1
    | PRIMARY                               -> $1
    | new PRIMARY                           {
        if ($2 instanceof T.Call) {
            $$ = new T.NewExpression($2.expression, $2.args);
        } else {
            $$ = new T.NewExpression($2);
        }
    }
    ;

PRIMARY
    : '(' EXPR ')'                          { $$ = new T.Paren($2); }
    | '[' ']'                               { $$ = new T.Array(); }
    | '[' ARGS ']'                          { $$ = ($2[0] instanceof T.Range) ? $2[0] : new T.Array($2) ; }
    | '[' ARGS ',' ']'                      { $$ = ($2[0] instanceof T.Range) ? $2[0] : new T.Array($2) ; }
    | '{' '}'                               { $$ = new T.Object(); }
    | '{' ASSOCS '}'                        { $$ = new T.Object($2); }
    | '{' ASSOCS ',' '}'                    { $$ = new T.Object($2); }
    | '->' '{' ASTMT '}'                    { $$ = new T.Function(null, [], $3); }
    | '->' '(' CALL_ARGS ')' '{' ASTMT '}'  { $$ = new T.Function(null, $3, $6); }
    | PRIMARY '(' CALL_ARGS ')'             { $$ = new T.Call($1, $3); }
    | LITERAL                               -> $1
    | LHS                                   -> $1
    ;

LHS
    : IDENTIFIER                            -> $1
    | PRIMARY '.' IDENTIFIER                { $$ = new T.Dot($1, $3); }
    | PRIMARY '[' EXPR ']'                  { $$ = new T.Index($1, $3); }
    ;

UNARY
    : not EXPR                              { $$ = new T.UnaryExpression("!", $2); }
    | '-' EXPR                              { $$ = new T.UnaryExpression("-", $2); }
    | '+' EXPR                              { $$ = new T.UnaryExpression("+", $2); }
    | '~' EXPR                              { $$ = new T.UnaryExpression("~", $2); }
    | typeof EXPR                           { $$ = new T.UnaryExpression("typeof", $2); }
    | instanceof EXPR                       { $$ = new T.UnaryExpression("instanceof", $2); }
    ;

UNARY_OP
    : not
    | '-'
    | '+'
    | '~'
    | typeof
    | instanceof
    ;

ARGDECL
    : '(' ARGLIST ')'                       -> $2
    | ARGLIST LF                            -> $1
    ;

ARGLIST
    : SUBARGLIST                            -> $1
    | SUBARGLIST ',' '*' IDENTIFIER         { $1.push(new T.Splat($4)); $$ = $1; }
    | '*' IDENTIFIER                        { $$ = [ new T.Splat($2) ]; }
    |                                       { $$ = []; }
    ;

SUBARGLIST
    : IDENTIFIER                            { $$ = [ $1 ]; }
    | IDENTIFIER '=' EXPR                   { $$ = [ new T.Operation("=", $1, $3) ]; }
    | SUBARGLIST ',' IDENTIFIER             { $1.push($3); $$ = $1; }
    | SUBARGLIST ',' IDENTIFIER '=' EXPR    {
        $1.push(new T.Operation("=", $3, $5));
        $$ = $1;
    }
    ;

CALL_ARGS
    : SUB_CALL_ARGS                         -> $1
    | SUB_CALL_ARGS ',' ASSOCS              { $1.push($3); $$ = $1; }
    | ASSOCS                                { $$ = [ $1 ]; }
    |
    ;

SUB_CALL_ARGS
    : EXPR                                  { $$ = [ $1 ]; }
    | '*' EXPR                              { $$ = [ new T.Splat($2) ]; }
    | SUB_CALL_ARGS ',' EXPR                { $1.push($3); $$ = $1; }
    | SUB_CALL_ARGS ',' '*' EXPR            { $1.push(new T.Splat($4)); $$ = $1; }
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
    : EXPR ':' EXPR     { $$ = new T.Assoc($1, $3); }
    ;

IDENTIFIER
    : identifier        { $$ = new T.Identifier($1); }
    ;

LITERAL
    : true              { $$ = new T.Keyword($1); }
    | false             { $$ = new T.Keyword($1); }
    | null              { $$ = new T.Keyword($1); }
    | undefined         { $$ = new T.Keyword($1); }
    | NUMBER            { $$ = new T.Number($1); }
    | STRING            { $$ = new T.String($1); }
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
    ;

