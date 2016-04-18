app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "drugs/:id": "drugDetails",
        "dashboard": "dashboard",
        "formulary/:f_id/:drug_id/:state": "formularyDetails"
    },

    initialize: function () {
        app.slider = new PageSlider($('body'));
        app.slider.slidePageSp = (function(_super){
            return function(){
                var result = _super.apply(this, arguments);
                console.log("Assign class after sliding");
                var current_view = Backbone.history.getFragment() == ''?'home':Backbone.history.getFragment();
                $('div.page').attr('current_view', current_view);
                return result;
            }
        })(app.slider.slidePage);
        app.slider.slidePage = app.slider.slidePageSp;
    },
    set_class_page: function(){
        var current_view = Backbone.history.getFragment() == ''?'home':Backbone.history.getFragment();
        $('div.page').attr('current_view', current_view);
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!app.homeView) {
            app.homeView = new app.views.HomeView();
            app.homeView.render();
        } else {
            console.log('reusing home view');
            app.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.homeView.$el);

    },

    drugDetails: function (id) {
        var drug = new app.models.Drug({id: id});
        drug.fetch({
            success: function (data) {
                // Note that we could also 'recycle' the same instance of DrugFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.DrugView({model: data}).render().$el);
            }
        });
    },

    dashboard: function () {
        if (!app.dashboardView) {
            app.dashboardView = new app.views.DashboardView();
            app.dashboardView.render();
        } else {
            console.log('reusing dashboard view');
            app.dashboardView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.dashboardView.$el);
    },

    formularyDetails: function (f_id, drug_id, state) {
        var formulary = new app.models.Formulary({f_id: f_id, drug_id: drug_id, state: state});
        formulary.fetch({
            success: function (returnedData) {
                // Note that we could also 'recycle' the same instance of DrugFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.FormularyView({model: returnedData}).render().$el);
            }
        });
    },

    forgot: function () {
        if (!app.forgotView) {
            app.forgotView = new app.views.ForgotView();
            app.forgotView.render();
        } else {
            console.log('reusing forgot view');
            app.forgotView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.forgotView.$el);
    }


});