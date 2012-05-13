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

test("set bindings", 8, function() {
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

    equal(logView.$el.attr('class'), meal.get('category'));
    equal(logView.$('h1.name').text(), meal.get('name'));
    equal(logView.$('input[name="notes"]').val(), meal.get('notes'));
    equal(logView.$('input[name="tried"]').prop('checked'), true);

    meal.set({
        category: "seafood",
        name: "Jumbo Shrimp",
        notes: "",
        tried: false
    });

    equal(logView.$el.attr('class'), meal.get('category'));
    equal(logView.$('h1.name').text(), meal.get('name'));
    equal(logView.$('input[name="notes"]').val(), meal.get('notes'));
    equal(logView.$('input[name="tried"]').prop('checked'), false);
});

test("get bindings", 3, function() {
    var meal = new Meal();

    var logView = new MealLogView({
        model: meal
    });

    logView.render();

    logView.$('h1.name').text("Yellow Curry").trigger('change');
    equal(meal.get('name'), logView.$('h1.name').text());

    logView.$('input[name="notes"]').val("Best i've eve").trigger('keyup');
    equal(meal.get('notes'), logView.$('input[name="notes"]').val());

    logView.$('input[name="tried"]').prop('checked', true).trigger('change');
    equal(meal.get('tried'), true);
});
