# Draft Syntax

The following statements and expressions described here are a draft of incoming
features.

## Ranges

Definition:

    [<expression>..<expression>]    # up or down to the last element (included)
    [<expression>...<expression>]   # up to the n-1 or down to n+1 element

Notes:

- expressions are expected to return integers;
- ranges aren't expressions by themselves, but used within certain statements,
  which means you can't have a statement like `x = [0..10]`.

Examples:

    [0..5]     # => [0, 1, 2, 3, 4, 5]
    [0...5]    # => [0, 1, 2, 3, 4]

## FOR

### Iterating objects

    for [own] key[, value] in <object> [do]
    end

Examples:

    for key in some_object                  # => for (key in some_object) {
    end                                          }
    
    for key, value in some_object           # => for (key in some_object)
    end                                            value = some_object[key];
                                                 }
    
    for own key in { a: 3, b: 4 }           # => __a = { a: 3, b: 4 };
    end                                          for (item in __a) {
                                                   if (__a.hasOwnProperty(key)) {
                                                   }
                                                 }
    
    for own item, count in { a: 3, b: 4 }   # => __b = { a: 3, b: 4 };
    end                                          for (item in __b) {
                                                   if (__b.hasOwnProperty(key)) {
                                                     count = __b[item];
                                                   }
                                                 }

### Lambdas (anonymous functions)

Definitions:

    ->[(<arguments>)] {
      <statements>
    }
    
    ->[(<arguments>)] do
      <statements>
    end
    
    -> statement

Within method calls:

    method([<arguments>]) ->[(<arguments>)] {
      <statements>
    }
    
    method([<arguments>]) -> statement
    
    method([<arguments>,] ->[(<arguments>)] {
      <statements>
    }[, <arguments>])

Examples:

    ary.each ->(item) {                         # => ary.each(function (item) {
    }                                                });
    
    $('#btn').click ->(event) do                # => $('#btn').click(function (event) {
    end                                              });
    
    elm.addEventListener('click') ->(event) {   # => elm.addEventListener('click', function (event) {
    }                                                });
    
    (30).downto(0, ->(i) {                      # => (30).downto(0, function (i) {
    }, 10)                                           }, 10);


## Prototypes

- definition:

    proto UI.Widget             |     if (typeof UI.Widget == "undefined") {
      def init(name)            |       UI.Widget = function () {};
        this.widget = $(name)   |       UI.createWidget = function(name) {
      end                       |         var o = new UI.Widget();
                                |         o.initWidget.apply(null, arguments);
      def show                  |         return o;
      end                       |       }
                                |     }
      def hide                  |     UI.Widget.prototype.initWidget = function(name) {
      end                       |       this.widget = $(name);
    end                         |     }
                                |     UI.Widget.prototype.init = UI.Widget.prototype.initWidget;
                                |     UI.Widget.prototype.show = function () {
                                |     }
                                |     UI.Widget.prototype.hide = function () {
                                |     }
                                |
    proto UI.Picker < UI.Widget |     if (typeof UI.Widget == "undefined") {
      def init(name)            |       UI.Picker = function () {};
        this.initWidget(name)   |       UI.Picker.prototype = new UI.Widget();
        this.show()             |       UI.createPicker = function(name) {
      end                       |         var o = new UI.Picker();
    end                         |         o.initPicker.apply(null, arguments);
                                |         return o;
                                |       }
                                |     }
                                |     UI.Picker.prototype.initPicker = function(name) {
                                |       this.initWidget.call(this, name);
                                |       this.show();
                                |     }
                                |     UI.Picker.prototype.init = UI.Widget.prototype.initPicker;

- "::" shortcut:

    UI.Widget::init             | UI.Widget.prototype.init;
    UI.Widget::init()           | UI.Widget.prototype.init.call(this);
    UI.Widget::init(name)       | UI.Widget.prototype.init.call(this, 'name');
    UI.Widget::init.call(o)     | UI.Widget.prototype.init.call(o);

