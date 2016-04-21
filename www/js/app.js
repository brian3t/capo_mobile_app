var app = {views: {}, models: {}, routers: {}, utils: {}, adapters: {}};
var config = {
    restUrl: "http://ec2-54-183-202-1.us-west-1.compute.amazonaws.com/v1/",
    commuterUrl: 'https://tdm.commuterconnections.org/mwcog/',
    baseUrl: 'http://ec2-54-183-202-1.us-west-1.compute.amazonaws.com/v1/'
};
var backboneInit = function () {
    app.router = new app.routers.AppRouter();
    app.utils.templates.load(["HomeView", "DashboardView", "DrugListItemView", "DrugListGoToFormularyItemView", "PlanListItemView", "FormularyView", "ForgotView"], function () {
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
        window.addEventListener('orientationchange', doOnOrientationChange);
        // Initial execution if needed
        doOnOrientationChange();

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
    localStorage.clear();
}

Backbone.LocalStorage.setPrefix('capo');

app_alert = function (message, alertCallback, title, buttonName) {
    if (buttonName === null) {
        buttonName = "OK"
    }
    if (isInWeb) {
        alert(message);
    } else {
        navigator.notification.alert(message, alertCallback, title, buttonName);
    }
};

function doOnOrientationChange() {
    switch (window.orientation) {
        case -90:
        case 90:
            console.log('landscape');
            $('body').addClass('landscape');
            break;
        default:
            console.log(window.orientation);
            console.log('portrait');
            $('body').removeClass('landscape');
            break;
    }
}
