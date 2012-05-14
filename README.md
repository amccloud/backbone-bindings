# Backbone Bindings [![Build Status](https://secure.travis-ci.org/amccloud/backbone-bindings.png)](http://travis-ci.org/amccloud/backbone-bindings]) #
Bi-directional bindings between Backbone.View elements and Backbone.Model attributes.

## Example ##
See some demo action here http://jsfiddle.net/T2MSu/3/
```javascript
var MealLogView = Backbone.View.extend({
    template: _.template('<h1 class="name"></h1><input type="text" name="name">'),
    bindings: {
        'text h1.name': 'name',
        'value input[name="name"]': 'name',
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    }
});
```

## View Bindings ##
Bindings is a hash defined on the view as a property named `bindings` or passed to `this.bindModel()`.
The key in `bindings` hash consist of two parts, the `property` you want to bind to and the `selector`
for the element you're targeting. Omitting the `selector` causes the event to be bound to the
view's root element `this.el`. 

## Property Binders ##
Property binders return accessors for setting or getting DOM values.

### Built-in Property Binders ###
 - value
 - text
 - html
 - class
 - checked
 - *

### Wild-card Property Binder ###
If a property cannot be found in the defined binders it defaults to `__attr__`. `__attr__`
is a special binder that look up the property in the elements attributes. This is useful for
binding to a wide variety attributes like data-custom and other custom attributes you need.

### Custom Property Binders ###
Binders are defined in the `Backbone.View.Binders` hash. The context of a property binder is
the view and the context of the returned `accessors` is the element being bound to. A binder
function takes three arguments: `model`, `attribute`, and `property`. The binder must return
an `accessors` hash with `get` and or `set` defined as functions. `get` takes no arguments and
should return a value from the element. `set` takes one argument: `value` and should set the
element to that value.

#### Example ####
```javascript
Backbone.View.Binders['mycustom'] = function(model, attribute, property) {
    return {
        get: function() {
            return this.css('background');
        },
        set: function(value) {
            this.css('background', value);
        }
    };
};

var MealLogView = Backbone.View.extend({
    bindings: {
        'mycustom div.cool-div': 'color'
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    }
});

```

## Transformers ##
Transformers are used for mutating the data between the model and view. A `get` transformer is
a simple function that takes in a value and returns a value. When dealing with bi-directional
(`get` and `set`) transformations a transformer should be list of two functions, one for `get`
and one for `set` respectively. The context of transformer functions is the view.

### Defining Get Transformer ###
```javascript
var triedClassTransformer = function(value) {
    return (value == true) ? 'tried' : 'todo';
};

var MealLogView = Backbone.View.extend({
    bindings: {
        'class': ['tried', triedClassTransformer],
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    }
});
```

### Defining Get & Set Transformer ###
```javascript
var yesNoTransformer = [function(value) {
    return value === "yes";
}, function(value) {
    return (value) ? "yes" : "no";
}];

var MealLogView = Backbone.View.extend({
    bindings: {
        'checked input[name="tried"]': ['tried', yesNoTransformer]
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    }
});
```
