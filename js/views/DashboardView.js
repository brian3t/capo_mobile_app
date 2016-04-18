app.views.DashboardView = Backbone.View.extend({

    initialize: function () {
        this.$el.html(this.template());
    },

    render: function () {
        this.$el.html(this.template());
       return this;
    },

    events: {
        "click .logout": "back"
    },

    back: function(event) {
        window.history.back();
        return false;
    },

});
