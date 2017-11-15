app.views.RiderWaitPickupView = Backbone.View.extend({
    map: {},
    model: app.cur_driver,
    initialize: function () {
        if (typeof google == "undefined" || !google || typeof google.maps == "undefined" || !google.maps) {
            $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBPeYraJ4H0BiuD1IQanQFlY1npx114ZpM&callback=riderwaitpickup_initMap", null);
        }

        this.map = $(this.el).find('#map');
        var self = this;
        this.offer_list_view = new app.views.OfferListView({model: app.offer_collection});
        this.offer_list_view.parent_view = self;
        this.wait_driver_view = new app.views.WaitDriverView({model: app.cur_driver});
        this.wait_driver_view.parent_view = self;
        this.render().afterRender();
    },
    refresh_eta_interval_id: -1,
    render: function () {
        this.$el.html(this.template($.extend({}, app.cur_driver.attributes)));
        var self = this;
        $('#waiting>button.btn-negative').bind('click touch touchstart', function () {
            self.cancel_request_ride();
        });
        return this;
    },
    afterRender: function () {
        console.log('after render');
        //try populating home and work

        var self = this;
        self.refresh_eta_interval_id = setInterval(function () {
            self.refresh_eta.apply(self);
        }, 30000);
    },
    dom_ready: function () {
        if (typeof google !== "undefined" && google && typeof google.maps !== "undefined" && google.maps && $('#map').children().length < 1) {
            //API loaded but map is empty
            riderwaitpickup_initMap();
        }
    },
    events: {
        "click .logout": "logout",
        "click #onride_logout": "logout",
        "click .back_btn": "back",
        "touchstart .back_btn": "back",
        "click #waiting>button.btn-negative": "cancel_request_ride",
        "change input.address": "set_my_itin",
        "click #driver_arrived": "confirm_pickup",
        "click #destination_reached": "finish",
        "click #ridematch_success > button": "logout",
        "click #cancel_request": "cancel_request_ride",
        "click .launch_map_app": app.launch_map_app
    },
    logout: function (e) {
        var self = this;
        app_confirm("Are you sure you want to log out?", function (response) {
            if (response == true || response == 1) {
                app.reset_user();
                app.router.navigate("#", {trigger: true, replace: true});
            }
            app.utils.misc.hide_popover();
            app.is_notification_active = false;
        })
    },
    pickup_location: {},
    dropoff_location: {},

    back: function (event) {
        ratchet_popover_dismiss();
        if (IS_LOCAL) {
            app.router.navigate('#', {trigger: true, replace: true});
        } else {
            app.router.navigate('dashboard', {trigger: true, replace: true});
        }
    },
    address_to_pick: {},
    status: null,
    time_sent: null,
    offer_collection: null,

    //functions

    reverse_geocode_callback: function (results, status, bbview) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                bbview.pickup_location = results[0];
                bbview.$el.find('input[name="' + bbview.address_to_pick + '_address"]').val(bbview.pickup_location.formatted_address);
                map.setZoom(10);
                map.panTo(bbview.pickup_location.geometry.location);
                google.maps.event.clearInstanceListeners(map);
                bbview.status = null;
                bbview.address_to_pick = null;

            } else {
                console.log('No results found');
                return "not found";
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
        var self = this;
        bbview.set_my_itin(self);
    },
    map_populate_address: function (event) {
        app.utils.misc.geocodeLatLng(event.latLng, geocoder, this.reverse_geocode_callback, this);
    },
    /**
     * Geodecode pickup / dropoff
     * Put markers on map
     * Save pickup and dropoff in app.cuser
     * Set itinerary
     */
    set_my_itin: function () {
        var self = this;
        var $pickup_address = $(':input[name="pickup_address"]');
        var $dropoff_address = $(':input[name="dropoff_address"]');
        var geocb_pickup = function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                app.cuser.pickup_location.geometry = results[0].geometry;
                map.setCenter(results[0].geometry.location);
                if (map.pickup_marker && map.pickup_marker.hasOwnProperty('setMap')) {
                    map.pickup_marker.setMap(null);
                }
                map.pickup_marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: 'img/map-pin-17_md.png'
                });
                map.setZoom(11);
                self.draw_route();
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        };
        if ($pickup_address.val()) {
            app.cuser.pickup_location.full_address = $pickup_address.val();
            geocoder.geocode({'address': $pickup_address.val()}, geocb_pickup);

        }

        var geocb_dropoff = function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                app.cuser.dropoff_location.geometry = results[0].geometry;
                map.setCenter(results[0].geometry.location);
                if (map.dropoff_marker && map.dropoff_marker.hasOwnProperty('setMap')) {
                    map.dropoff_marker.setMap(null);
                }
                map.dropoff_marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: 'img/map-pin-16_md.png'
                });
                map.setZoom(11);
                self.draw_route();
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }

        };

        if ($dropoff_address.val()) {
            app.cuser.dropoff_location.full_address = $dropoff_address.val();
            geocoder.geocode({'address': $dropoff_address.val()}, geocb_dropoff);
        }

    },
    draw_route: function () {
        //draw route when begin and end are present
        if (app.cuser.dropoff_location.hasOwnProperty('geometry') && app.cuser.pickup_location.hasOwnProperty('geometry')) {
            if (map.directionsDisplay != null) {
                map.directionsDisplay.setMap(null);
                map.directionsDisplay = null;
            }
            map.directionsDisplay = new google.maps.DirectionsRenderer({
                // suppressMarkers: true
            });
            map.directionsDisplay.setMap(map);
            var query_string = $.param({});
            var dir_request = {
                origin: app.cur_driver.get('lat') + ',' + app.cur_driver.get('lng'),
                destination: app.cuser.pickup_location.geometry.location.lat() + ',' + app.cuser.pickup_location.geometry.location.lng(),
                travelMode: google.maps.TravelMode.DRIVING
            };
            map.direction.route(dir_request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    map.directionsResult = result;
                    $('.eta').html(map.directionsResult.routes[0].legs[0].duration.text);
                    $('.eta').closest('div').show();
                    map.directionsDisplay.setDirections(result);
                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend(app.cuser.pickup_location.geometry.location);
                    bounds.extend(app.cuser.dropoff_location.geometry.location);
                    map.fitBounds(bounds);
                }
            });
            $('#request_ride').slideDown();
        } else {
            $('#request_ride').slideUp();
        }

    },
    /**
     * Request a ride
     * After successful, This view keeps pulling offers from API that matches this ride request
     */
    set_status: function (status) {
        var self = this;
        this.status = status;
        switch (status) {
            case 'request_sent': {
                //pulling offers from API
                var poll_options = {
                    delay: 8000,
                    timeout: 7000,
                    data: {request_cuser: app.cuser.id, status: 'pending'}
                };
                app.offer_poller = Backbone.Poller.get(app.offer_collection, poll_options);
                app.offer_poller.start();
                app.offer_poller.on('error', ajax_timeout_offer);
                app.offer_poller.on('success', ajax_timeout_reset);
                break;
            }
            case 'idle': {
                if (_.isObject(app.offer_poller))
                    app.offer_poller.stop();
                app.request.destroy();
                $('#onride').hide();
                this.set_my_itin();
                break;
            }
            case 'wait_driver':
                if (_.isObject(app.offer_poller))
                    app.offer_poller.stop();
                $('#waiting').slideUp();
                $('#fade').hide();
                $('#wait_driver').slideDown();
                break;
            case 'onride': {
                self.draw_route();
                this.$el.find('#title').html('En Route: ' + app.cur_driver.name_initial());
                this.$el.find('#driver_info').hide();
                var eta = null;
                if (map.hasOwnProperty('directionsResult') && map.directionsResult.hasOwnProperty('routes') && _.isArray(map.directionsResult.routes)
                    && (typeof map.directionsResult.routes[0] === 'object') && (map.directionsResult.routes[0].hasOwnProperty('legs'))
                    && (_.isArray(map.directionsResult.routes[0].legs)) && (map.directionsResult.routes[0].legs[0].hasOwnProperty('duration'))
                    && (map.directionsResult.routes[0].legs[0].duration.hasOwnProperty('text'))) {
                    eta = map.directionsResult.routes[0].legs[0].duration.text;
                }
                if (eta !== null) {
                    this.$el.find('#onride').show();
                }
                this.$el.find('#driver_arrived').hide();
                this.$el.find('#destination_reached').slideDown();
                this.$el.find('#cancel_wrapper').hide();
                break;
            }
            default:
                break;
        }
    },
    accept_ride: function (e) {
        var element = $(e.targetElement);
        var rider_id = $(e.target.parentElement).find('input[class="cuser_id"]').val();
        app.request.status = 'accepted';
        //tell the API that the offer is accepted
        $.ajax(config.restUrl + 'offer/' + rider_id, {
            method: 'PATCH',
            dataType: 'json',
            data: {status: 'accepted'}
        });
        app.cur_driver.set({id: rider_id});
        app.cur_driver.fetch();
        this.set_status('wait_driver');
    },
    confirm_pickup: function () {
        app.request.save({"status": "onride"});
        this.set_status('onride');
    },
    cancel_request_ride: function () {
        app_confirm("Are you sure you want to cancel your request for a ride?", function (response) {
            if (response == true || response == 1) {
                app.router.navigate('dashboard', {trigger: true, replace: true});
            }
            app.is_notification_active = false;
        });
        this.set_status('idle');
    },
    finish: function () {
        var self = this;
        app.request.save({status: "fulfilled"}, {
            success: function () {
                setTimeout(function () {
                    self.set_status('idle')
                }, 15000);//wait so that the offer is not deleted yet
                $('#ridematch_success').slideDown();
                $('#route_info').hide();
                $('#cancel_wrapper').hide();
                clearInterval(self.refresh_eta_interval_id);
            }
        });
    },
    refresh_eta: function () {
        var self = this;
        $.ajax(config.restUrl + 'cuser/' + app.cur_driver.get('id'), {
            success: function (response) {
                app.cur_driver.set({lat: response.lat, lng: response.lng, address_realtime: response.address_realtime});
                self.draw_route();
            }
        });

    }

});

