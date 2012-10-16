var categoryTransformer = function(value) {
    if (value)
        return value.toLowerCase().replace(/ /g, '');
};

var yesNoTransformer = {
    setEl: function(value) {
        return value === "yes";
    },
    getEl: function(value) {
        return (value) ? "yes" : "no";
    },

    //get from model
    // get:function(){
    //     return this.tried();
    // },

    // set:function(value){
    //     this.tried(value);
    // }
};

var Meal = Backbone.Model.extend({

    notesCount:function(){
        if(!this.has('notes')) return 0;
        return this.get('notes').length;
    },

    tried:function(v){
        if(!_.isUndefined(v)){
            return this.set('tried', (v) ? "yes" : "no");
        }
        return this.get('tried') == "yes";
    }

}),
MealLog = Backbone.View.extend({
    template: _.template('<h1 class="name"></h1><p>Notes Length:<span><span></p><input type="text" name="notes"><input type="checkbox" name="tried">'),
    bindings: {
        'class': ['category', categoryTransformer],
        'text h1.name': 'name',
        'value input[name="notes"]': 'notes',
        'text span': ['notes', 'notesCount'],
        'checked input[name="tried"]': ['tried', yesNoTransformer]
    },

    render: function() {
        this.$el.html(this.template());
        return this.bindModel();
    },

    renderGiven: function(){
        this.$el.html(this.template());
        return this.bindModel(this.model, this.bindings);
    }
});


var methods = ['render', 'renderGiven'];

for(var i in methods){
    var method = methods[i];

    test("set bindings with "+method, function() {
        var meal = new Meal({
            category: "Fast Food",
            name: "Coney",
            notes: "Delish!",
            tried: "yes"
        });

        var logView = new MealLog({
            model: meal
        });

        logView[method]();
        
        equal(logView.$el.attr('class'), categoryTransformer(meal.get('category')));
        equal(logView.$('h1.name').text(), meal.get('name'));
        equal(logView.$('span').text(), meal.notesCount());
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
        equal(logView.$('span').text(), meal.notesCount());
        equal(logView.$('input[name="notes"]').val(), meal.get('notes'));
        equal(logView.$('input[name="tried"]').prop('checked'), false);
        
    });

    test("get bindings with "+method, function() {
        var meal = new Meal();

        var logView = new MealLog({
            model: meal
        });

        logView[method]();

        logView.$('h1.name').text("Yellow Curry").trigger('change');
        equal(meal.get('name'), logView.$('h1.name').text());

        logView.$('input[name="notes"]').val("Best i've eve").trigger('keyup');
        equal(meal.get('notes'), logView.$('input[name="notes"]').val());

        equal(meal.notesCount(), logView.$('input[name="notes"]').val().length);

        logView.$('input[name="tried"]').prop('checked', true).trigger('change');
        equal(meal.get('tried'), yesNoTransformer.getEl(true));
    });


    test("unbinding with "+method, function() {
        var meal = new Meal({
            category: "Fast Food",
            name: "Coney",
            notes: "Delish!",
            tried: "yes"
        });

        var logView = new MealLog({
            model: meal
        });

        logView[method]();
        notDeepEqual(logView._bindings, undefined);

        logView.unbindModel();
        deepEqual(logView._bindings, {});
    });


}