# Draft Syntax

The following statements and expressions described here are a draft of incoming
features.

### Lambdas (anonymous functions)

Definitions:

    -> &<expression>                           |     function (x) {
                                               |       return x.expression;
                                               |     }
    
    -> &<identifier>                           |     function (x) {
                                               |       return (typeof x.identifier === "function") ? x.identifier() : x.identifier;
                                               |     }

Within method calls:

    method[(][<arguments>][)] -> &statement
 
Examples:

    users.map -> &name                          # => users.map(function (x) {
                                                       return (typeof x.name === "function") ? x.name() : x.name;
                                                     });

    users.map -> &get('name')                   # => users.map(function (x) {
                                                       return x.get('name');
                                                     });


## Objects & Prototypes

Definition

    object [<constant.]<constant> [< [<constant>.]<constant>]
      [<functions>]
    end


Example:

    object UI.Widget             |     if (typeof UI.Widget === "undefined") {
      def init(name)             |       UI.Widget = function () {};
        this.widget = $(name)    |     }
      end                        |     UI.Widget.prototype.init = function (name) {
                                 |       this.widget = $(name);
      def show                   |     };
      end                        |     UI.Widget.prototype.show = function () {
                                 |     };
      def hide                   |     UI.Widget.prototype.hide = function () {
      end                        |     };
    end                          |      

    object UI.Picker < UI.Widget |     if (typeof UI.Widget === "undefined") {
      def init(name)             |       UI.Picker = function () {};
        UI.Widget::init()        |       UI.Picker.prototype = new UI.Widget();
        this.show()              |     } else {
      end                        |       throw new Error("Inheritance error: trying to redefine the parent prototype of UI.Picker.");
    end                          |     }
                                 |     UI.Picker.prototype.init = function (name) {
                                 |       UI.Widget.prototype.init.call(this, name);
                                 |       this.show();
                                 |     };

    object Resource                       |     if (typeof Resource === "undefined") {
      create: ->(attributes = {}) {       |       Resource = function () {}; 
      }                                   |     }
                                          |     Resource.create = function (attributes) {
      update: ->(id, attributes = {}) {   |       if (typeof attributes === "undefined") {
      }                                   |         attributes = {};
                                          |       }
      destroy: ->(id) {                   |     };
      }                                   |     Resource.update = function (id, attributes) {
                                          |       if (typeof attributes === "undefined") {
      def save                            |         attributes = {};
      end                                 |       }
    end                                   |     };
                                          |     Resource.destroy = function (id) {
                                          |     };
                                          |     Resource.prototype.save = function () {
                                          |     };


    object Resource                       #     if (typeof Resource === "undefined") {
      def ::create(attributes = {})       #       Resource = function () {};
      end                                 #     }
                                          #     Resource.create = function (attributes) {
      def save                            #       if (typeof attributes === "undefined") {
      end                                 #       }
    end                                   #     }
                                          #     Resource.prototype.save = function () {
                                          #     }


- "::" shortcut to prototype:

    UI.Widget::init              |     UI.Widget.prototype.init;
    UI.Widget::init.call(o)      |     UI.Widget.prototype.init.call(o);

Should we allow some shortcuts?

    UI.Widget::init()            |     UI.Widget.prototype.init.call(this);
    UI.Widget::init(name)        |     UI.Widget.prototype.init.call(this, 'name');


## AMD (ie. require.js)

- either a `--amd` command line option?
- or manually using `define ->(require) {}` ?

    define ->(require) {             |     define(function (require) {
      Liquid = require("liquid.js")  |       var Liquid = require("liquid.js");
    }                                |     });
    
    define ->(require) {             |     define(function (require) {
      Liquid = require "Liquid"      |       var Liquid = require("Liquid");
    }                                |     });
    
    define ->(require) {             |     define(function (require) {
      require "Liquid"               |       var Liquid = require("Liquid");
    }                                |     });

