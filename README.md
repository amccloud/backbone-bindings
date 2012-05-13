# Backbone Bindings #
Bi-directional bindings between Backbone.View elements and Backbone.Model attributes.

## Download ##
https://raw.github.com/amccloud/backbone-bindings/master/backbone-bindings.js

[![Build Status](https://secure.travis-ci.org/amccloud/backbone-bindings.png)](http://travis-ci.org/amccloud/backbone-bindings])

## Example ##
```javascript
var Meal = Backbone.Model.extend({}),
    MealLogView = Backbone.View.extend({
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

var meal = new Meal({
    category: "fastfood",
    name: "Coney",
    notes: "Delish!",
    tried: true
});

var logView = new MealLogView({
    model: meal
});

logView.render();

// From model to view.
logView.$el.attr('class'); // "fastfood"
logView.$('h1.name').text(); // "Coney"
logView.$('input[name="notes"]').val() // "Delish!"
logView.$('input[name="tried"]').prop('checked') // true

// From view to model. (Note: The event is manually triggered here the browser would handle this normally.)
logView.$('h1.name').text("Yellow Curry").trigger('change');
logView.$('input[name="notes"]').val("Best i've eve").trigger('keypress');
logView.$('input[name="tried"]').prop('checked', false).trigger('change');

meal.get('name') // "Yellow Curry"
meal.get('notes') // "Best i've eve"
meal.get('tried') // false
```
