var categoryTransformer = function(value) {
    if (value)
        return value.toLowerCase().replace(/ /g, '');
};

var yesNoTransformer = [function(value) {
    return value === "yes";
}, function(value) {
    return (value) ? "yes" : "no";
}];

var Meal = Backbone.Model.extend({}),
    MealLog = Backbone.View.extend({
        template: _.template('<h1 class="name"></h1><input type="text" name="notes"><input type="checkbox" name="tried">'),
        bindings: {
            'class': ['category', categoryTransformer],
            'text h1.name': 'name',
            'value input[name="notes"]': 'notes',
            'checked input[name="tried"]': ['tried', yesNoTransformer]
        },

        render: function() {
            this.$el.html(this.template());
            return this.bindModel();
        }
    });

test("set bindings", function() {
    var meal = new Meal({
        category: "Fast Food",
        name: "Coney",
        notes: "Delish!",
        tried: "yes"
    });

    var logView = new MealLog({
        model: meal
    });

    logView.render();

    equal(logView.$el.attr('class'), categoryTransformer(meal.get('category')));
    equal(logView.$('h1.name').text(), meal.get('name'));
    equal(logView.$('input[name="notes"]').val(), meal.get('notes'));
    equal(logView.$('input[name="tried"]').prop('checked'), true);

    meal.set({
        category: "Seafood",
        name: "Jumbo Shrimp",
        notes: "",
        tried: "no"
    });

    equal(logView.$el.attr('class'), categoryTransformer(meal.get('category')));
    equal(logView.$('h1.name').text(), meal.get('name'));
    equal(logView.$('input[name="notes"]').val(), meal.get('notes'));
    equal(logView.$('input[name="tried"]').prop('checked'), false);
});

test("get bindings", function() {
    var meal = new Meal();

    var logView = new MealLog({
        model: meal
    });

    logView.render();

    logView.$('h1.name').text("Yellow Curry").trigger('change');
    equal(meal.get('name'), logView.$('h1.name').text());

    logView.$('input[name="notes"]').val("Best i've eve").trigger('keyup');
    equal(meal.get('notes'), logView.$('input[name="notes"]').val());

    logView.$('input[name="tried"]').prop('checked', true).trigger('change');
    equal(meal.get('tried'), yesNoTransformer[1](true));
});


test("unbinding", function() {
    var meal = new Meal({
        category: "Fast Food",
        name: "Coney",
        notes: "Delish!",
        tried: "yes"
    });

    var logView = new MealLog({
        model: meal
    });

    logView.render();
    notDeepEqual(logView._bindings, undefined);

    logView.unbindModel();
    deepEqual(logView._bindings, {});
});
