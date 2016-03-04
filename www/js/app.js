var app = {views: {}, models: {}, routers: {}, utils: {}, adapters: {}};
var config = {restUrl: "https://usvsolutions.com/formulary_api/f/"};
var backboneInit = function () {
    app.router = new app.routers.AppRouter();
    app.utils.templates.load(["HomeView", "DrugView", "DrugListItemView", "DrugListGoToFormularyItemView", "PlanListItemView", "FormularyView"], function () {
        app.router = new app.routers.AppRouter();
        Backbone.history.start();
    });
    $.ajaxSetup({cache: true});
    $(document).ajaxStart(function () {
        $("#loading").show();
    });
    $(document).ajaxStop(function () {
        $("#loading").hide();
    });
    isInWeb = (typeof isInWeb !== "boolean" ? "true" : isInWeb);
};
var capp = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        capp.receivedEvent('deviceready');
    },
    position: {stateCode: ""},
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
        backboneInit();
        StatusBar.hide();
        $('body').height($('body').height() + 20);
    },
    event_bus: _({}).extend(Backbone.Events),
    gMaps: {
        api_key: 'AIzaSyC1RpnsU0y0yPoQSg1G_GyvmBmO5i1UH5E',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC1RpnsU0y0yPoQSg1G_GyvmBmO5i1UH5E'
    },
    onGeolocationSuccess: function (position) {
        capp.position = position;
        console.log('position: ' + capp.position);
        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);
        $.getJSON(capp.gMaps.url + '&latlng=' + lat + ',' + lng + '&result_type=administrative_area_level_1', function (data) {
            if (data.status == "OK") {
                if (data.results != {}) {
                    capp.position.stateCode = data.results[0].address_components[0].short_name;
                    capp.event_bus.trigger('iGotLocation');
                }
            }
        });
    },
    onGeoLocationError: function onError(error) {
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }
};
if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
    isInWeb = false;
    capp.initialize();
}
else {
    isInWeb = true;
    $(document).ready(function () {
        backboneInit();
    });
}