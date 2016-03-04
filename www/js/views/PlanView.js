app.views.PlanView = Backbone.View.extend({

    initialize: function () {
        this.searchResults = new app.models.PlanCollection();
        this.searchresultsView = new app.views.PlanListView({model: this.searchResults});
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        $('#plan-list', this.el).append(this.searchresultsView.render().el);
       return this;
    },

    events: {
        "click .btn-back": "back",
        "keyup .search-key":    "search",
        "keypress .search-key": "onkeypress"
    },

    back: function(event) {
        window.history.back();
        return false;
    },
    search: function (event) {
        var key = $('.search-key').val();
        var drugName = ($('#drug-name>div').length !== 0?$('#drug-name>div').text():"");
        this.searchResults.fetch({reset: true, data: {name: key, state: state, drugName: drugName}});
    },

    onkeypress: function (event) {
        if (event.keyCode === 13) { // enter key pressed
            event.preventDefault();
        }
    }
});
