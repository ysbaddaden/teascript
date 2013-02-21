# Tea Script

Tea is a language that transcompiles to JavaScript. It leverages the actual
syntax of JavaScript for a Ruby-like one, in order to reduce visual noise,
enhance readability, and fix some shortcomings of JavaScript.

Table of Content:

  - [About](#about)
    - [Limitations](#limitations)
  - [Language Reference](#language-reference)
    - [Significant Line Feeds](#significant-line-feeds)
    - [Blocks](#blocks)
    - [Types](#types)
      - [Strings](#strings)
    - [Identifiers](#identifiers)
    - [expression](#expressions)
    - [Conditional Controls](#conditional-controls)
      - [If](#if)
      - [Unless](#unless)
      - [Case](#case)
    - [Loops](#loops)
      - [While](#while)
      - [Until](#until)
    - [Iterations](#iterations)
      - [for ... in](#for-in)
      - [for ... of](#for-of)
    - [Functions](#functions)
      - [Declarations](#declarations)
      - [Calls](#calls)
    - [Lambdas](#lambdas)
    - [Prototypes](#prototypes)
      - [Constructor](#constructor)
      - [Self](#self)
      - [Inheritance](#inheritance)
  - [Future](#future)
  - [Author](#author)

## About

Being inspired by the Ruby language, Tea greatly reduces the need for semicolons,
parens, curly brackets and uses the `end` keyword to finish a block.

Despite being inspired by the Ruby language, Tea doesn't define any class based
inheritance model, and retains the prototype model of JavaScript —prototypes are
great once you get the hang of it.

Tea tries to stay readable. Even months after the initial code write, you should
be able to read that code without needing to transcompile it to JavaScript to be
able to understand what it really does. Also, the transcompiled JavaScript should
be as easy to read as possible, if not actually pretty.

### Limitations

Tea doesn't try to be a full featured language. It doesn't try to do eveything
that could be cool or nice to have. A feature is implemented because it fixes a
real problem or regular pain, and should simplify your life as a programmer.

Also, Tea cannot fix ECMAScript itself, and thus is limited to what is
implementable in pure JavaScript.


## Language Reference

Since Tea's syntax is based off Ruby's syntax, it thus borrows a lot from it's
syntax. Which means that Tea:

  * is linefeed significant, thus requires no semicolons, unless you want to
    stack statements on a single line;
  * doesn't use curly brackets for blocks, nor indentation, but prefers
    linefeeds and lots of the `end` keyword;
  * no useless parens, except for method calls and lambda argument definitions;

But, Tea transcompiles to JavaScript and thus keeps it's type system; so Tea is
as weakly typed as JavaScript, and whatever evaluates to false in JavaScript
will evaluate to false in Tea.

### Significant Line Feeds

Line feeds in Tea are significant. Which means that a statement is terminated by
a linefeed. You may however have insignificant whitespace *after* an operator,
assignment, paren, etc. Because we are expecting something, the linefeed is then
non-significant.

For example, this will throw a parer error:

```tea
myVar
  = 10
```

This is because Tea considers `myVar` to be terminated by the linefeed and
`= 10` is considered to be another statement, and causes an error, because
`=` is unexpected.

However the following example is OK:

```tea
myVar =
  10
```

This is because Tea is expecting something after the `=` operator and thus
will skip any linefeed until it finds it.

A better example could be a funtion call, where parameters may span on multiple
lines:

```tea
doSomething(
  firstParam,
  secondParam
)
```

However the following won't work, because the opening paren is decoupled from
the function name, thought the linefeed before the comma isn't a problem (except
for the ugly aesthetic):

```tea
doSomething
(
  firstParam
  ,
  secondParam
)
```

This behavior of linefeed significance should be identical to Ruby's.

### Blocks

Blocks of code in tea are delimited with the `end` keyword, just like in Ruby.
A block thus starts with a linefeed (or semicolon) and is terminated with `end`.
For example:

```tea
def fname(arg)
  if arg
    # do something
  else
    # do something else
  end
end
```

### Types

Tea is as weakly typed as JavaScript is. This is a problem that can't be solved
that easily. For strong types in JavaScript see alternatives like
[Dart](http://www.dartlang.org/), [Haxe](http://haxe.org/) or
[TypeScript](http://www.typescriptlang.org/).

Most types are the same than in JavaScript, since Tea doesn't define any
particular syntax sugar over JavaScript. Except strings, which may span on
multiple lines (without requiring backticks).

Number, Array and Object are the same in Tea and JavaScript, since any real
difference may only be fixed in ECMAScript (like differenciating integers and
floats from Number) or should come in an library (like Object.extend).

This is also true for `true`, `false`, `null` and `undefined`, which are all
supported in Tea.

#### Strings

A string starts with a single or double quote and ends with the same single
or double quote. Of course single quotes are allowed within double quoted
strings, and doubles quotes are allowed within single quoted strings.

Example:

```tea
"this is a 'string' with double quotes"
'this is a "string" with single quotes'
```

The difference with JavaScript is that a line is allowed to span on multiple
lines. For example:

```tea
"this is
a string
on multiple
lines !"
```

That may prove helpful with inlined templates.

<!--
#### Ranges

Ranges are an addition over JavaScript. They aren't a first class type, thought,
which means that you can't assign a range to a value. For now ranges are only
used in `for ... of` iterations.

You may create an inclusive range with two dot, like `[expr..expr]` ; and an
exclusive range with three dots, like `[expr...expr]`. For example:

```tea
[1..10]               # starts from 1 up to 10
[1...10]              # starts from 1 up to 9
```

You aren't limited to numbers, and you may use any kind of expression. For
example:

```tea
ary = [ 0, 1, 2 ]
[0...ary.length]    # starts from 0 up to 2
```

NOTE: maybe we should just drop ranges altogether?
-->

### Identifiers

All valid identifiers in JavaScript should be valid in Tea. Which means that
`π` and `ಠ_ಠ`, for instance, are valid identifiers. Which allows us to have:

```tea
π = Math.PI
```

See <http://mathiasbynens.be/notes/javascript-identifiers> for all the valid
characters in JavaScript identifiers.


### Expressions

All valid operations in JavaScript should be valid in Tea, with the exception
of the `++` and `--` mutation operators, which must be replaced with the `+= 1`
and `-= 1` assignments.

In the same way, all comparators and assignments that are valid in JavaScript
should be valid in Tea.


### Conditional Controls

All controls have direct equivalents in JavaScript, thought Tea uses Ruby's
syntax instead of JavaScript's. Which means block aren't delimited by curly
brackets (`{}`), but start with a statement separator (linefeed or `;`) and
are terminated with the `end` keyword.

#### If

The simplest `if` is the one that executes one or many statements if an
expression evaluates to true. For example:

```tea
if isAuthor
  authorsCount += 1
end
```

Which you may simplify with a oneliner:

```tea
authorsCount += 1 if isAuthor
```

##### Else

You may want to do something if the expression evaluates to false, thus we have
the `else` keyword:

```tea
if isAuthor
  authorsCount += 1
else
  othersCount += 1
end
```

##### Elsif

Sometimes conditionals may stack together. Instead of having a block and
sub-block solution, Tea has the `elsif` statement. For example:

```tea
if isAuthor
  authorsCount += 1
elsif isDirector
  directorsCount += 1
else
  authorsCount += 1
end
```

##### Pseudo BNF

```ebnf
if <expression> [then]
  <statements>
[elsif <expression> [then]
  <statement>]*
[else
  <statements>]
end

<statement> if <expression>
```

NOTE: the `then` keyword may eventually disappear in favor of a linefeed. This
may limit the abuse of whole if/else statements on one lines, which prove to be
unreadable, just like:

```tea
if isAuthor then authorsCount += 1 else othersCount += 1 end
```

Do you really think it's readable? While you're writing code, it may be. But
weeks or months later? I think it won't.

#### Unless

Tea proposes a syntactic sugar for if not statements, using the `unless`
statement. Unless executes the underlying statements if the expression evaluates
to false. For example:

```tea
unless isAuthor
  nonAuthorsCount += 1
end
```

Which you may simplify with a onliner (because there is only a single underlying
statement):

```tea
nonAuthorsCount += 1 unless isAuthor
```

Please note that unless conditionals don't have any else controls.

##### Pseudo BNF

```ebnf
unless <expression> [then]
  <statements>
end

<statement> unless <expression>
```

NOTE: the `then` keyword may eventually disappear in favor of a linefeed, for
the same reason than if conditionals.

#### Case

The if/elsif controls are great, but when you are always evaluating against the
same expression, you should instead use the `case` statement. For example:

```tea
case work
when 'author'   then   authorsCount += 1
when 'director' then directorsCount += 1
end
```

##### Else

Cases also allows an else statement as a last possible, whenever the previous
expressions evaluated to false. For example:

```tea
case work
when 'author'
  authorsCount += 1
when 'director'
  directorsCount += 1
else
  othersCount += 1
end
```

##### Pseudo BNF

```ebnf
case <expression>
(when <expression>[(, <expression>)*] [then]
  <statements>)*
[else
  <statements>]
end
```

NOTES: contrary to if and unless controls, the `then` keyword won't be removed
from the spec for case statements, because it helps to improve the readability
of the whole statement in some cases, as demonstrated in above examples.


### Loops

#### while

While evaluates a block while the expression evaluates to true. Whenever the
expression evaluates to false, the loop is stopped.

```tea
i = j = 0
while i < 10
  i += 1
  j += i
end
```

There is also a onliner (yes, this example is stupid):

```tea
i = 0
i += 1 while i < 10
```

##### Pseudo BNF

```ebnf
while <expression [do]
  <statements>
end

<statement> while <expression>
```

NOTE: just like the `then` keyword for if controls, the `do` keyword may
eventually disappear.

#### until

Until is a syntactic sugar for while not loops. It evaluates the underlying
statements until the expression evaluates to false. Whenever the expression
evaluates to true, the loop is stopped.

For example:

```tea
i = 0
until i > 10
  i += 1
end
```

There is also a onliner (yes, this example is also stupid):

```tea
i = 0
i += 1 until i > 10
```

##### Pseudo BNF

```ebnf
until <expression> [do]
  <statements>
end

<statement> until <expression>
```

NOTE: just like while controls, the `do` keyword may eventually disappear.


### Iterations

#### for...in

For...in iterates the keys of an object. For example:

```tea
for attr_name in attributes
  attr_value = attributes[attr_name]
end
```

The problem of for...in is that it iterates everything from the object, which
may prove problematic, when it's starting to iterate the prototype of this
object. So, in order to be safe, you should almost always use the `own` keyword
to restrict the keys to that of the object itself (and not go up its prototype
chain). For example:

```tea
for own name, value in attributes
  li = document.createElement('li')
  li.dataset[name] = value
  li.textContent = value
  ul.appendChild(li)
end
```

##### Pseudo BNF

```ebnf
for [own] <key>[, <value>] in <object> [do]
  <statements>
end

<statement> for [own] <key>[, <value>] in <object>
```

#### for...of

For...of iterates the values of an object and not its keys like for...in
does. For example:

```tea
for elm of document.getElementsByClassName('hidden')
  elm.className = 'visible';
end

for img, index of images
  img.style.top = height * index + 'px'
end
```

For...of only iterates arrays and array-like objects that have a `length`
property and numeric indices. For example an Array, a NodeList returned from DOM
methods like `getElementsByTagName` or `querySelectorAll`, etc.

##### Difference between for...of et for...in

Please consider the following object:

```tea
obj = [ 1, 2, '3' ]
obj.push(4);
obj['x'] = 5
```

For...in will iterate the indexes, and thus iterate the 'x' index:

```tea
console.log(v) for v in obj   # => 0, 1, 2, 3, "x"
```

But for...of will iterate the values, and skip all non numeric indices, thus
skipping the value of the 'x' index:

```tea
console.log(v) for v of obj   # => 1, 2, '3', 4
```

<!--
##### Ranges

You may also iterate within a Range:

```tea
elements = document.querySelectorAll(".hidden")
for i of [0...elements.length]
  elements[i].classList.toggle("hidden")
end
```

This is nice, but it actually has little value when compared to the previous for
... of example. Except that with ranges, you may work in reverse, from the last
item of the array down to the first one:

```tea
elements = document.querySelectorAll(".visible")
for i of [(elements.length - 1)..0]
  elements[i].classList.toggle("visible");
end
```

NOTE: maybe we should just drop ranges altogether? They have little to no added
      value when faced to a simple for ... of iteration, and while/until loops
      for reverse iteration?
-->

##### Pseudo BNF

```ebnf
for <value>[, <index>] of <array> [do]
  <statements>
end

<statement> for <value>[, <array>] of <iterable>
```


### Functions

#### Declarations

Functions are declared using the `def` keyword. For example:

```tea
def doSomething
  console.log("do something");
end

def doSomethingElse(arg)
  console.log("do something else: " + arg);
end
```

As you may notice, parens aren't required for function declarations (thought
there should be whenever there is an argument.)

##### Arguments

JavaScript only supports named arguments, as well as the `arguments` array-like
object for dynamically messing with any number of passed arguments. Tea expands
that by adding default values for optional arguments and argument splats.

##### Default arguments

Example:

```tea
def doSomething(first, second, optional = null)
end

doSomething(1, 2, 3)   # => optional is 3
doSomething(1, 2)      # => optional is null
```

##### Splat arguments

The splat argument must be the last argument of the function declaration. It
collects all supernumerary argument into a single array. So instead of manually
messing with the `arguments` object and `Array.prototype.slice` you may just use
a splat:

```tea
def concat(first, *arrays)
  first.concat(ary) for ary of arrays
end

concat([ 1, 2 ], [ 3, 4 ], [ 5, 6 ])  # => [ 1, 2, 3, 4, 5, 6 ]
```

#### Calls

Parens are required for function calls, mostly for increased readability in
order to rapidly differenciate between property access and function call.
Requiring parens also allows to pass a function reference instead of invoking it.

For example:

```tea
def onResize(event)
  # do something on click
end

onResize()
window.addEventListener('resize', onResize, false)
```

Splats are also available as function arguments, they will splat the values of
the array-like object as individual arguments.

```tea
def build(one, two, three, four)
  return {
    one:   one,
    two:   two,
    three: three,
    four:  four
  }
end
build(*[1, 2, 3, 4])  # => { one: 1, two: 2, three: 3, four: 4 }
```

##### Passing objects

You may pass an object to a function call:

```tea
Post = Backbone.Model.extend(
  name: "Post"
)
```

But it's simpler to just drop the curly braces:

```tea
Post = Backbone.Model.extend(
  name: "Post",
)
```

Note that you may only drop curly braces for the last argument. If you want to
pass multiple object arguments or arguments after the object you must use curly
braces. For example:

```tea
sendCommand({ command: 'action' }, callback)
```

#### Pseudo BNF

```ebnf
def <identifier>[(][)]
  <statements>
end

def <identifier>[(]param([, param])*[, *param][)]
  <statements>
end

def <identifier>[(]*param[)]
  <statements>
end
```

### Lambdas

Lambdas are anonymous functions, and thus don't have a name. A lambda is
declared like this:

```tea
-> {}
->(arg1, arg2) {}
```

Declared that way they serve no purpose, since they won't even be invoked. But
consider adding an event listener:

```tea
elm.addEventListener('click', ->(event) {
  elm.classList.add("clicked");
}, false)
```

<!--
You may even put it *outside* of the arguments list, so they look like Ruby
blocks:

```tea
elm.addEventListener("click") ->(e) {
  elm.classList.add("clicked");
}
```
-->

Except for the particular syntax and lack of a name, lambdas are just functions.
That means they may have default arguments, splats, etc:

```tea
->(param, *args) {}
```

#### Pseudo BNF

```ebnf
->[(<arguments>)] {
    <statements>
}
```

### Prototypes

WARNING: CURRENTLY BEING REDEFINED FOR INNER FUNCTION DECLARATIONS INSTEAD.

That will look like:

    def MyObject(arg) < Resource
      self.arg = arg

      def -doSomething
        console.log(self.inspect())
        return self
      end

      def +factory(*args)
        return args.map(->(arg) {
          return new MyObject(arg)
        })
      end

      self.doSomething()
    end

Which would transcompile to:

    function MyObject(arg) {
        var self = this;
        self.arg = arg;
        self.doSomething();
    };
    MyObject.prototype = new Resource();

    MyObject.prototype.doSomething = function () {
        var self = this;
        console.log(self.inspect())
        return self;
    };

    MyObject.factory = function () {
        var args = [].slice(arguments);
        return args.map(function (arg) {
            return new Test(arg);
        });
    };

EBNF:

    def <fname> [< <fname>]
      [<statements>]

      (def -<fname>[(][<arguments>][)]
        <statements>
      end])*

      (def +<fname>[(][<arguments>][)]
        <statements>
      end])*
    end

#### Current Prototype Definition

Tea proposes a readable syntax for Javacript prototypes. You create an object
definition using `object` and add method to its prototype by declaring functions
into its body. You may also declare 'static' methods which will be added to the
object itself, using a `+` before the method name. For instance:

```tea
object Post
  def +create(attributes)
    (record = new Post).init(attributes)
    return record
  end

  def init(attributes)
    for own name, value in attributes
      self[name] = value
    end
  end
end

Post.create(name: "Jean Dupont")
```

#### Constructor

An instance of an object is built using `new`, but there aren't any constructor
methods that would initialize the object. We could have some initialization code
by having the code inside the function block in JavaScript:

```javascript
var Post = function (attributes) {
  // initialization code goes here
};
```

But that would prevent inherited prototypes to work correctly, because
inheritance in JavaScript is achieved by constructing the parent prototype. For
example:

```javascript
var Model = function () {};
var Post  = function () {};
Post.prototype = new Model();
```

Tea could generate some JavaScript to new an Object then call an init method,
but that could clash with other JavaScript libraries that do not follow this
pattern.

Tea thus doesn't provide any construct + initialization sugar. A proposed way
to handle this, is to have an `init` method and to manually call it:

```tea
(post = new Post).init(attributes)
```

#### Self

You may have noticed that tea suse `self` instead of `this`. Tea automatically
declares `var self = this;` at the beginning of every method so that even within
a lambda `self` always refers to the current object. No need to manually bind
lambdas anymore!

You still need to bind methods used as callbacks, thought. For instance:

```tea
object Widget
  def init(elm)
    elm.addEventListener('click', self.onClick.bind(self))
  end

  def onclick(e)
  end
end
```

NOTE: Tea may provide some sugar for binding methods to self in the future.
      Something like `&onClick` or `^onClick` for instance.

#### Inheritance

```tea
object Dialog < Widget
  def init
    Widget::init(className: 'ui-dialog')
  end
end
```

#### Pseudo BNF

```ebnf
object <identifier> [< <identifier>]
  (def <identifier>[(][<arguments>][)]
    <statements>
  end)*

  (def +<identifier>[(][<arguments>][)]
    <statements>
  end)*
end
```

## Future

  * **nil keyword**: the nil keyword would translate to null, but when compared
    with something it would actually check against both null and undefined,
    allowing to make no difference between those two values.

    [DONE]

  * **String interpolations**: tea code should be embedable in double quoted
    strings, using the `#{<code>}` syntax.

  * **Bind operator**: automatically bind self for event listeners in
    prototypes. Something like:

    ```
    el.addEventListener('click', ^onclick, false)
    ```

  * **Returnable expressions**: the last statement of a function or lambda
    should automatically return the result, thus limiting the need to use
    `return` to manually return the value. For example:

    ```
    def name(arg)
      if arg
        'something'
      else
        'something else'
      end
    end
    ```

    `name` should return `"something"` if `arg` is truthy, and `"something else"`
    is `arg` is falsy.

  * **SourceMaps**: generated JavaScript code should come with a source map, so
    that errors and debug can be done from the Tea code, not the generated
    JavaScript.

  * **Classes**: Tea doesn't define any class based inheritance model, but may end-up
    implementing [maximally minimal classes](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes)
    someday.

  * **Falsy values**: whatever evaluates to false in JavaScript evaluates to
    false in Tea, so `0` and `""` are evaluated to false. This may change in the
    future, where only `undefined`, `null` and `false` may be falsy.

## Author

- Julien Portalier

