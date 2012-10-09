(function($) {
   var applicationView = new ApplicationView({
        el: $('body')
    });
    var startNames = [
        new NameModel({
            name: "Brian"
        }),
        new NameModel({
            name: "Tom"
        })
    ];
    var nameCollection = new NameCollection(startNames);
    var nameCollectionView = new NameCollectionView({
        el: $('#appcontainer'),
        collection: nameCollection
    });
})(jQuery);
