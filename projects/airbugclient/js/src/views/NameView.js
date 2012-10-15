var NameView = Backbone.View.extend({
    tagName: 'li',

    template: helloTemplate, // name of tag to be created

    events: {
        'click span.delete': 'remove'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
    },

    render: function(){
        var output = Mustache.render(this.template, {
            name: this.model.get('name')
        });
        $(this.el).html(output);
        return this;
    },

    unrender: function(){
        $(this.el).remove();
    },

    remove: function(){
        this.model.destroy();
    }
});