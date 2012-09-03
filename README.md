# TeaScript

Tea is yet another pseudo-language that compiles to JavaScript, inspired by the
Ruby language specs.

## Features

Lighter syntax:

  - less visual noise;
  - semicolons are *really* optional;
  - parenthesis are only required for method call (and for expression precedence);
  - curly braces are only for object declarations (and maybe lambdas);
  - blocks are delimited with the `end` keyword.

Richer feature set:

  - strict equality where `==` and `!=` respectively compile to `===` and `!==`;
  - default values for method arguments;
  - argument splats in method definitions and calls;
  - variables are scoped automatically to the current function unless the
    variable exists in a parent scope;
  - multiline strings;
  - statement modifiers like `a = "0" + a if a < 10`;
  - `unless` and `until` statements;
  - etc.

Fully prototype based: no classical inheritance enforced.

## Syntax

### Types

All variable type definitions are the same than JavaScript's, with just a few
exceptions.

#### Strings

Strings behave like in JavaScript but are allowed to span on multiple lines.
Examples:

    a = "lorem"
    b = "ipsum"
    c = a + " " + b
    
    multistr = "lorem ipsum
    dolor sir amet"

#### Ranges

Definition:

    [<expression>..<expression>]    # up or down to the last element (included)
    [<expression>...<expression>]   # up to the n-1 or down to n+1 element

Notes:

  - expressions are expected to be or return integers;
  - ranges aren't expressions by themselves but used within certain statements,
    which means you can't have a statement like `x = [0..10]`.

Examples:

    # slicing array-like objects:
    ary = [ 1, 2, 3 ]
    ary[0..1]             # => [ 1, 2 ]
    ary[1...2]            # => [ 2 ]
    b = 2
    ary[b..ary.length]    # => [ 3 ]
    ary[b...ary.length]   # => []

### Conditionals

#### IF

    if <expression> [then]
      <statements>
    [elsif <expression> [then]
      <statements>]
    [else
      <statements>]
    end
    
    if <expression> then <statement> [elsif <expression> then <statement>] [else <statement>] end
    
    <statement> if <expression>

#### UNLESS

    unless <expression> [then]
      <statements>
    [else
      <statements>]
    end
    
    unless <expression> then <statement> [else <statement>] end
    
    <statement> unless <expression>

#### CASE

    case <expression>
    when <expression>[, <expression>] [then]
      <statements>
    [else
      <statements>]
    end

### Iterations

Please note you may exit any iteration at will with the `break` keyword.

#### WHILE

    while <expression> [do]
      <statements>
    end
    
    <statement> while <expression>

#### UNTIL

    until <expression> [do]
      <statements>
    end
    
    <statement> until <expression>

#### LOOP

    loop [do]
      <statements>
    end

#### FOR

Iterating within a range:

    for <identifier> of <range> [do]
      <statements>
    end

    <statement> for <identifier> of <range>

Examples:

    j += Math.pow(i) for i of [0...100]

    for i of [0..ary.length]
      item = ary[i]
    end

    for i of [ary.length..0]
      item = ary[i]
    end


### Functions

Definition:

    def <identifier>[(] [<arg>][, <arg> = <expression>][, *<args>] [)]
      <statements>
    end

Call:

    [<expression>.]<identifier>([<arg>][, <arg>][, *<args>])

Splat arguments:

There may be only one splat argument in function definition, and it must be
the last of the declaration. Function calls do not have that limitation and
may splat any number of arguments at any place.

Examples:

    def incr(value)
      return incrby(value, 1)
    end

    def incrby value, by = 1
      return value + by
    end

    def concat(a, b, *ary)
      return [a, b].concat(ary)
    end

    args = [1, 2]
    concat(a, b, *args, *[3, 4, 5])

### Lambdas

Definition:

    -> [(<arguments>)] {
      <statements>
    }

    -> [(<arguments>)] { <statements> }

Assignments:

    <left> = -> [(arguments)] {}

Assocs:

    <expression>: -> [(arguments)] {}

Method call argument:

    method([<method arguments>,] ->[(<lambda arguments>)] {
      <statements>
    }[, <method arguments>])
    
    method[(<method arguments>)] ->[(<lambda arguments>)] {
      <statements>
    }

Examples:

    ary.each ->(item) {
    }
    
    elm.on("click", "a") ->(e) {
    }


## Author

- Julien Portalier

