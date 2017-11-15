app.views.OfferListView = Backbone.View.extend({
        tagName: 'ul',
        className: 'table-view small',
        initialize: function () {
            var self = this;
            this.model.on("reset update add remove", this.render, this);
            // this.model.on("update add remove", function (offer) {
            //     self.$el.append(new app.views.OfferListItemView({model:offer}).render().el);
            // });
        },

        render: function () {
            this.$el.empty();
            _.each(this.model.models, function (offer) {
                this.$el.append(new app.views.OfferListItemView({model: offer}).render().el);
            }, this);
            var accept_buttons = this.$el.find('button.accept');
            var self = this;
            $(accept_buttons).click(function (e) {
                self.parent_view.accept_ride(e);
            });
            return this;
        },
        events: {
            // "click button.accept": parent_view.accept_ride
        }
    },
    {
        parent_view: null
    });

app.views.OfferListItemView = Backbone.View.extend({

    tagName: "li",
    className: "table-view-cell",

    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});