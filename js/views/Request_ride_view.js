app.views.Request_ride_view = Backbone.View.extend({
    map: {},
    initialize: function () {
        if (typeof google == "undefined" || !google || typeof google.maps == "undefined" || !google.maps) {
            $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBPeYraJ4H0BiuD1IQanQFlY1npx114ZpM&callback=request_initMap", null);
        }

        this.map = $(this.el).find('#map');
        var self = this;
        this.offer_list_view = new app.views.OfferListView({model: app.offer_collection});
        this.offer_list_view.parent_view = self;
        this.wait_driver_view = new app.views.WaitDriverView({model: app.cur_driver});
        this.wait_driver_view.parent_view = self;
        $('input[name="dropoff_address"]').val();
        this.clear_my_route();
        app.cuser.pickup_location = {};
        app.cuser.dropoff_location = {};
        schedule_idle_local_note();

        var poll_options = {
            delay: 8000,
            timeout: 7000,
            data: {rider: app.cuser.id}
        };
        if (_.isObject(current_pos)) {
            poll_options.data.cur_lat = current_pos.latitude;
            poll_options.data.cur_lng = current_pos.longitude;
        }
        app.driver_poller = Backbone.Poller.get(app.driver_collection, poll_options);
        app.driver_poller.start();
        app.driver_poller.on('error', ajax_timeout_driver);
        app.driver_poller.on('success', ajax_timeout_reset);
        this.listenTo(app.driver_collection, 'sync', this.display_drivers);

        this.render().afterRender();
    },

    render: function () {
        this.$el.html(this.template($.extend({}, app.cuser.attributes, {commuter_data: app.cuser.commuter_data})));
        $('#offers', this.el).append(this.offer_list_view.render().el);
        $('#wait_driver', this.el).append(this.wait_driver_view.render().el);
        var self = this;
        // $('#rider_waiting>button.btn-negative').bind('click touch touchstart', function () {
        //     self.cancel_request_ride('You');
        // });
        return this;
    },
    afterRender: function () {
        console.log('after render');
        //try populating home and work
        var $home_input = $(':input[title="home"]');
        var $work_input = $(':input[title="work"]');

        var self = this;
        // window.setTimeout(function(){self.request_ride()}, 3000);
    },
    dom_ready: function () {
        if (typeof google !== "undefined" && google && typeof google.maps !== "undefined" && google.maps && $('#map').children().length < 1) {
            //API loaded but map is empty
            request_initMap();
        }
    },
    events: {
        "click .logout": "logout",
        "click .back_btn": "back",
        "touchstart .back_btn": "back",
        "click div.select_address_modal div.clickable": "address_selected",
        "click button#request_ride": "request_ride",
        "click #rider_waiting>button.btn-negative": function () {
            this.cancel_request_ride('You');
        },
        "ready #map": "display_drivers",
        // "click a.selecting_address>input" : "selecting_address"
        "change input.address": "set_my_itin",
        "click #finish": "finish"
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
        $.post(config.restUrl + 'cuser/reset', {id: app.cuser.get('id')});
        ratchet_popover_dismiss();
        app.router.navigate('dashboard', {trigger: true, replace: true});
    },
    address_to_pick: {},
    status: 'idle',
    time_sent: null,
    driver_markers: [],
    offer_collection: null,
    clear_my_route: function () {
        if (_.isObject(map.directionsDisplay)) {
            map.directionsDisplay.setMap(null);
        }
    },
    //functions
    address_selected: function (event) {
        if (_.isObject(map.directionsDisplayTransit)){
            map.directionsDisplayTransit.setMap(null);
        }
        try {
            if (_.isObject(map.pickup_marker)) {
                map.pickup_marker.setMap(null)
            }
            if (_.isObject(map.dropoff_marker)) {
                map.dropoff_marker.setMap(null)
            }
        } catch (e) {
            console.log(e);
        }

        var parent_content = $($(event.target).parents('div.content'));
        var address_to_pick = parent_content.data('address-to-pick');
        if ($(event.target).is(':input')) {
            sel_input = $(event.target);//we're clicking on the input
        } else { //we're clicking on the div
            var sel_input = $(event.target).find(':input');
        }
        //clear markers
        app.utils.misc.delete_marker(address_to_pick);
        if (sel_input.attr('title') == 'pick_from_map') {
            this.address_to_pick = address_to_pick;
            this.status = 'waiting_map_picking';
            $('#request_ride').slideUp();
            $('input[name="' + this.address_to_pick + '_address"]').val('Touch on map to select location');

            var self = this;
            google.maps.event.addListener(map, 'click', function (event) {
                self.map_populate_address(event);
            });
        } else {
            if (sel_input.attr('title') == 'current_pos') {
                $('#request_ride').slideUp();
                $('input[name="' + address_to_pick + '_address"]').val(current_pos.location.formatted_address).trigger('change');
            } else {
                $('input[name="' + address_to_pick + '_address"]').val(sel_input.val()).trigger('change');
            }
        }
        $(parent_content).closest('div.modal').removeClass('active');
    },

    selecting_address: function (event) {
        event.preventDefault();
        console.log(event);
    },
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
        map.icons = {
            start: {url: 'img/rider_on_map_new.png'},
            end: {url: 'img/dropoff_on_map_new.png'},
            driver: {url: 'img/driver_on_map_new.png'}
        };


        map.makeMarker = function (position, icon, title) {
            new google.maps.Marker({
                position: position,
                map: map,
                icon: icon,
                title: title
            });
        };

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
                    icon: 'img/rider_on_map_new.png'
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
                    icon: 'img/dropoff_on_map_new.png'
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
                suppressMarkers: true
            });
            map.directionsDisplay.setMap(map);
            var query_string = $.param({});
            var dir_request = {
                origin: app.cuser.pickup_location.geometry.location.lat() + ',' + app.cuser.pickup_location.geometry.location.lng(),
                destination: app.cuser.dropoff_location.geometry.location.lat() + ',' + app.cuser.dropoff_location.geometry.location.lng(),
                travelMode: google.maps.TravelMode.DRIVING
            };
            map.direction.route(dir_request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    map.directionsDisplay.setDirections(result);
                    capp.event_bus.trigger('mapDirectionDisplayDone');
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
    suggest_transit: function () {
        if (!_.isObject(app.my_request_poller) || !app.my_request_poller.active()) return false;
        var self = this;
        app_confirm('Would you like to consider transit options?', function (response) {
            if (!response) {
                return false;
            }
            //now transit mode. gmaps doesn't allow direct call. Must make ajax call
            var departure_time = moment().format('X');
            var request = {
                origin: app.cuser.dropoff_location.geometry.location.lat() + ',' + app.cuser.dropoff_location.geometry.location.lng(),
                destination: app.cuser.pickup_location.geometry.location.lat() + ',' + app.cuser.pickup_location.geometry.location.lng(),
                // key: GMAP_KEY_IECOM,
                // Note that Javascript allows us to access the constant
                // using square brackets and a string value as its
                // "property."
                travelMode: 'TRANSIT',
                provideRouteAlternatives: true,
                transitOptions: {departureTime: new Date(departure_time)}
            };
            var self2 = self;
            map.direction.route(request, function (result, status) {
                if (status === 'OK') {
                    map.google_directions = result;
                    self2.cancel_request_ride();
                    self2.listenToOnce(capp.event_bus, 'mapDirectionDisplayDone', function () {
                        map.directionsDisplayTransit = new google.maps.DirectionsRenderer({
                            suppressMarkers: true
                        });
                        map.directionsDisplayTransit.setMap(map);
                        map.directionsDisplayTransit.setDirections(map.google_directions);
                    })
                } else {
                    app_toast('Error getting transit options. Please try again later');
                }
            });
        }, 'Consider ')
    },
    /**
     * Request a ride
     * After successful, This view keeps pulling offers from API that matches this ride request
     */
    request_ride: function () {
        trackButton('Request a ride');
        var self = this;
        $('#rider_waiting').slideDown();
        $('#request_ride').slideUp();
        $('#fade').show();
        //grab pickup loc and dropoff loc
        app.request = new app.models.Request({cuser_id: app.cuser.id, status: 'pending'});
        //send a request to server
        app.request.set({
            pickup_full_address: app.cuser.pickup_location.full_address,
            pickup_lat: app.cuser.pickup_location.geometry.location.lat(),
            pickup_lng: app.cuser.pickup_location.geometry.location.lng(),

            dropoff_full_address: app.cuser.dropoff_location.full_address,
            dropoff_lat: app.cuser.dropoff_location.geometry.location.lat(),
            dropoff_lng: app.cuser.dropoff_location.geometry.location.lng()
        });
        app.request.save({}, {
            // type: 'POST',
            forceRefresh: true, success: function () {
                app.my_request_poller = Backbone.Poller.get(app.request);
                app.my_request_poller.on('success', ajax_timeout_reset);
                app.my_request_poller.on('error', function (model) {
                    //probably request deleted due to idle
                    // console.info(app.request);
                    self.cancel_request_ride('System');
                });
                app.my_request_poller.start({delay: 240000, data: {cuser_id: app.cuser.id}});
                setTimeout(self.suggest_transit(self), 600000); //10 minutes
            }
        });

        //go into waiting mode
        this.set_status('request_sent');
        this.time_sent = (new Date());
    },
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
                // set IDLE notification timer
                schedule_idle_local_note();
                break;
            }
            case 'idle': {
                if (_.isObject(app.offer_poller))
                    app.offer_poller.stop();
                app.request.destroy();
                $('#onride').hide();
                this.set_my_itin();
                console.log("schedule_idle_local_note CANCELLED -- idle");
                cordova.plugins.notification.local.cancel(LOCAL_NOTE_IDLE_ID);

                app.driver_poller.start();
                break;
            }
            case 'wait_pickup':
                if (_.isObject(app.offer_poller))
                    app.offer_poller.stop();
                app.router.route('rider_wait_pickup');
                app.router.rider_wait_pickup();
                console.log("schedule_idle_local_note CANCELLED -- wait_pickup");
                cordova.plugins.notification.local.cancel(LOCAL_NOTE_IDLE_ID);
                break;
            case 'onride': {
                $('#wait_driver').hide();
                $('#onride').slideDown();
                console.log("schedule_idle_local_note CANCELLED -- onride");
                cordova.plugins.notification.local.cancel(LOCAL_NOTE_IDLE_ID);
                break;
            }
            default:
                break;
        }
    },
    accept_ride: function (e) {
        trackButton('Agree to a driver match');
        var element = $(e.targetElement);
        var rider_id = $(e.target.parentElement).find('input[class="cuser_id"]').val();
        app.request.save({"status": 'accepted'});
        //tell the API that the offer is accepted
        $.ajax(config.restUrl + 'offer/' + rider_id, {
            method: 'PATCH',
            dataType: 'json',
            data: {status: 'accepted'}
        });
        app.cur_driver.set({id: rider_id});
        app.cur_driver.fetch();
        app.my_request_poller.stop();
        this.set_status('wait_pickup');
    },
    confirm_pickup: function () {
        app.request.save({"status": 'onride'});
        app.offer_poller.stop();
        this.set_status('onride');
    },
    cancel_request_ride: function (by_whom) {
        if (_.isObject(app.my_request_poller)) {
            app.my_request_poller.stop();
        }
        if (_.isEmpty(by_whom)) {
            by_whom = 'You';
        }
        if (by_whom === 'You') {
            app_toast('You have cancelled your ride request!');
        }
        else {
            app_toast(by_whom + ' cancelled this ride offer!');
        }
        $('#rider_waiting').slideUp();
        $('#request_ride').slideToggle();
        $('#fade').hide();
        $('#wait_driver').hide();
        app.request.destroy();
        app.request.clear();
        app.offer_poller.stop();
        this.set_status('idle');
    },
    finish: function () {
        var self = this;
        $('input [name="dropoff_address"]').val('');
        app.request.save({status: "fulfilled"}, {
            success: function () {
                setTimeout(function () {
                    self.set_status('idle')
                }, 15000);//wait so that the offer is not deleted yet
            }
        });
    },
    remove: function () {
        console.log("schedule_idle_local_note CANCELLED -- remove");
        cordova.plugins.notification.local.cancel(LOCAL_NOTE_IDLE_ID);
        return Backbone.View.remove();
    },
    display_drivers: function () {
        var self = this;
        if (typeof google == "undefined" || !google) {
            setTimeout(function () {
                    self.display_drivers.bind(self);
                }, 1000
            );
            return;
        }
        this.drivers = app.driver_collection.toJSON();
        //show drivers on the map
        app.utils.misc.delete_markers(app.driver_markers);
        for (var i = 0; i < this.drivers.length; i++) {
            var d = this.drivers[i];
            var new_marker = new google.maps.Marker({
                position: {lat: parseFloat(d.lat), lng: parseFloat(d.lng)},
                map: map,
                icon: {url: 'img/driver_on_map_new.png'},
                zIndex: 800,
                driver: d
            });

            app.driver_markers.push(new_marker);
        }
    }

});

