# TODO

- write tests for function calls;
- support lambdas in function calls (like in Ruby : the last argument ?);

## Ranges

### Iterating arrays

    for <value> of <array> [do]
      [statements]
    end

    # using a lambda:
    <array>.forEach ->(item) {
      [statements]
    }

Examples:

    for item of ary do                      # => for (__r1 = 0; __r1 < ary.length; __r1++) {
    end                                            item = ary[__r1];
                                                 }

    ary.forEach ->(item) {                  # => ary.forEach(function (item) {
    }                                            });

### Iterating objects

    for [own] <key> [, value] in <object> [do]
      [statements]
    end

Examples:

    for key, value in hash do               # => for (key in hash) {
    end                                            value = hash[key];
                                                 }

    for own name, type in columns           # => for (name in columns) {
    end                                            if (columns.hasOwnProperty(key)) {
                                                     type = columns[name];
                                                   }
                                                 }

    for name in columns                    # => for (name in columns) {
    end                                         }

    for own name in columns                # => for (name in columns) {
    end                                           if (columns.hasOwnProperty(name)) {
                                                  }
                                                }


## Methods

- methods should always return their latest expression:

      def m1(a, b)                |     function m1(a, b) {
        a || b                    |       return a || b;
      end                         |     }
                                  |
      def m1(a, b, c)             |     function m1(a, b, c) {
        if a                      |       if (a) {
          a                       |         return a;
        elsif b                   |       } else if (b) {
          b                       |         return b;
        else                      |       } else {
          c                       |         return c;
        end                       |       }
      end                         |     }

## Lambdas (anonymous methods)

- regular:

      m1() -> {                   |     m1(function () {
      }                           |     });
                                  |
      a.forEach ->(item) {        |     a.forEach(function (item) {
      }                           |     });
                                  |
      m2(a, b) ->(x, y) {         |     m2(a, b, function (x, y) {
      }                           |     });
                                  |
      elm.on('click') ->(e) {     |     elm.on('click', function (e) {
        e.preventDefault()        |       return e.preventDefault();
      }                           |     });

      elm.on 'click', ->(e) {
        e.preventDefault();
        // ...
      }

- inline:

      elm.click ->(e) e.stop()    |     elm.click(function (e) {
                                  |       return e.stop();
                                  |     });
                                  |
      elm.on('click') -> cb()     |     elm.on('click', function () {
                                  |       return cb();
                                  |     });
                                  |
      ary.map -> &toString        |     ary.map(function (__r1) {
                                  |       return __r1.toString();
                                  |     });

