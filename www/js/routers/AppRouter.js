app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "drugs/:id": "drugDetails",
        "formulary/:f_id/:drug_id/:state": "formularyDetails"
    },

    initialize: function () {
        app.slider = new PageSlider($('body'));
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

    formularyDetails: function (f_id, drug_id, state) {
        var formulary = new app.models.Formulary({f_id: f_id, drug_id: drug_id, state: state});
        formulary.fetch({
            success: function (returnedData) {
                // Note that we could also 'recycle' the same instance of DrugFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.FormularyView({model: returnedData}).render().$el);
            }
        });
    }

    //map: function (id) {
    //    app.slider.slidePage(new app.views.MapView().render().$el);
    //}

});