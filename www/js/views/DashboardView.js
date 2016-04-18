app.views.DashboardView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template($.extend({}, app.cuser.attributes, {commuter_data: app.cuser.commuter_data})));
       return this;
    },

    events: {
        "click .logout": "back"
    },

    back: function(event) {
        window.history.back();
        return false;
    }
});
