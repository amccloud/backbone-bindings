# Backbone Bindings #
Bi-directional bindings between Backbone.View elements and Backbone.Model attributes.

## Download ##
https://raw.github.com/amccloud/backbone-bindings/master/backbone-bindings.js

[![Build Status](https://secure.travis-ci.org/amccloud/backbone-bindings.png)](http://travis-ci.org/amccloud/backbone-bindings])

## Example ##
See it in action here http://jsfiddle.net/T2MSu/1/
```javascript
var MealLogView = Backbone.View.extend({
    template: _.template('<h1 class="name"></h1><input type="text" name="notes"><input type="checkbox" name="tried">'),
    bindings: {
        'class': 'category',
        'text h1.name': 'name',
        'value input[name="notes"]': 'notes',
        'checked input[name="tried"]': 'tried'
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    }
});
```
