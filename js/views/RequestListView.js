app.views.RequestListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'table-view',
    initialize: function () {
        var self = this;
        this.model.on('reset remove', this.render, this);
        this.model.on('add', function (request) {
            //calculate distances
            request.set({miles_away: lat_lng_distance(current_pos.latitude, current_pos.longitude, request.get('pickup_lat'), request.get('pickup_lng'))});
            var new_item_view = new app.views.RequestListItemView({model: request, parentView: self});
            new_item_view.parentView = self;
            self.$el.append(new_item_view.render().el);
            $(self.$el.parent()).prevAll('p.has_request').show();
            $(self.$el.parent()).prevAll('p.no_request').hide();
        }, this);
    },
    requests: [],
    cusers: {},
    render: function () {
        this.$el.empty();
        var self = this;
        //remove my own request
        _.filter(this.model.models, function (v) {
            return v.cuser_id !== app.cuser.id;
        });
        //calculate distances
        _.forEach(this.model.models, function (r) {
            r.set({miles_away: lat_lng_distance(current_pos.latitude, current_pos.longitude, r.get('pickup_lat'), r.get('pickup_lng'))});
        });
        //get names and phones
        var cusers = _.map(this.model.models, function (r) {
            return r.get('cuser_id');
        });
        var success = function (response) {
            self.cusers = response;//cusers: {"571317eeb6f15571317eeb6f1a":["Ross Edgar","301-592-1442"],"574f064374406574f06437440b":["Travis",""]}
        };
        if (cusers.length == 0){
            return this;
        }
        $.get(config.restUrl + 'cuser/query', {data: cusers}, success, 'json');
         if (this.model.models.length == 0) {
             $(this.$el.parent()).prevAll('p.has_request').hide();
             $(this.$el.parent()).prevAll('p.no_request').show();
         } else {
             $(this.$el.parent()).prevAll('p.has_request').show();
             $(this.$el.parent()).prevAll('p.no_request').hide();
         }
        _.each(this.model.models, function (request) {
            var new_item_view = new app.views.RequestListItemView({model: request, parentView: self});
            new_item_view.parentView = self;
            this.$el.append(new_item_view.render().el);
        }, this);
        return this;
    }
}, {
    parentView: null
});
app.views.RequestListItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function () {
        this.model.on('destroy', this.close);
        this.model.on('remove', function (removed_model) {
            if (_.isObject(app.View_riders_view)) {
                app.View_riders_view.display_riders();
            }
            removed_model.unbind();

        }, this);
    },
    render: function () {
        var li = this.template(this.model.toJSON());
        var self = this;
        this.$el.html(li);
        this.$el.find('button.offer').click(function (e) {
            self.parentView.parentView.offer_ride_from_list(self.model);
        });
        if (typeof this.parentView.parentView !== "undefined" && this.parentView.parentView) {
            this.parentView.parentView.display_riders();
        }
        return this;
    },
    close: function (removed_model) {
        // this.model.unbind("change", this.render);
        console.info('closed');
        removed_model.unbind();
        // this.remove();
    }
}, {
    parentView: null
});
