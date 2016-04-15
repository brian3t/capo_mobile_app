app.views.DashboardView = Backbone.View.extend({
    model: app.cuser,
    cm_data: [],
    initialize: function () {
        cm_data = window.localStorage.getItem('cuser');
        cm_data = JSON.parse(cm_data);
        this.render();
    },

    render: function () {
        var data = {};
       this.$el.html(this.template($.extend(data, this.model.attributes,cm_data)));
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
