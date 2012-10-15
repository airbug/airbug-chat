var NameCollectionView = Backbone.View.extend({
    
    events: {
        'click button#add': 'addName'
    },
    
    initialize: function(){
        _.bindAll(this, 'render', 'addName', 'appendName'); // every function that uses 'this' as the current object should be in here

        this.collection.bind('add', this.appendName); // collection event binder

        this.counter = 0;
        this.render();
    },
    
    render: function(){
        var self = this;
        $(this.el).append("<button id='add'>Add name</button>");
        $(this.el).append("<ul></ul>");
        _(this.collection.models).each(function(name){ // in case collection is not empty
            self.appendName(name);
        }, this);
    },
    
    addName: function(){
        this.counter++;
        var name = new NameModel();
        name.set({
            name: name.get('name') + this.counter // modify item defaults
        });
        this.collection.add(name);
    },
    
    appendName: function(name){
        var nameView = new NameView({
            model: name
        });
        $('ul', this.el).append(nameView.render().el);
    }
});