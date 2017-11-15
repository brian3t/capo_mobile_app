app.views.RiderWithETAView = Backbone.View.extend({
    parent_view: null,
    refresh_eta_interval_id: -1,
    model: app.cur_rider,
    initialize: function (parent) {
        // this.listenTo(this.model, 'change', this.render);
        // this.render();
    },
    // constructor: function () {
    //     this.parent_view = 'me';
    //     Backbone.View.constructor();
    // },
    render: function () {
        this.model = app.cur_rider;
        this.$el.html(this.template(this.model.attributes));
        if (this.refresh_eta_interval_id == -1) {
            this.refresh_eta_interval_id = setInterval(this.refresh_eta(this), 30000);
        }
        return this.$el.html();
    },
    remove: function () {
        clearInterval(this.refresh_eta_interval_id);
        return Backbone.View.remove();
    },
    refresh_eta: function () {
        var self = this;
        navigator.geolocation.getCurrentPosition(capp.geolocation.onSuccess, capp.geolocation.onError);
        $.ajax(config.restUrl + 'cuser/' + app.cur_rider.get('id'), {
            success: function (response) {
                app.cur_rider.set({lat: response.lat, lng: response.lng, address_realtime: response.address_realtime});
                self.parent_view.draw_rider_route({pickup_lat:current_pos.latitude, pickup_lng: current_pos.longitude, dropoff_lat: self.model.get('lat'), dropoff_lng: self.model.get('lng')});
            }
        });

    },
    defaults:{
        parent_view:null
    }
});