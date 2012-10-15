var ApplicationView = Backbone.View.extend({

    template: applicationTemplate,

    initialize: function() {
        _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
        this.render();
    },

    render: function() {
        var output = Mustache.render(this.template, {});
        $(this.el).append(output);
        return this; // for chainable calls, like .render().el
    }
});