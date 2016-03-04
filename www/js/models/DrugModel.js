app.models.Drug = Backbone.Model.extend({
    initialize:function () {
        this.reports = new app.models.ReportsCollection();
        this.reports.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.drug.findById(parseInt(this.id)).done(function (data) {
                options.success(data);
            });
        }
    }

},
    {
        f_id: '',
        state_code: ''
    });

app.models.DrugCollection = Backbone.Collection.extend({

    model: app.models.Drug,

    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.drug.findByName(options.data.name).done(function (data) {
                options.success(data);
            });
        }
    }

});

app.models.ReportsCollection = Backbone.Collection.extend({

    model: app.models.Drug

    //sync: function(method, model, options) {
    //    if (method === "read") {
    //        console.log("find by manager");
    //        app.adapters.drug.findByManager(this.parent.id).done(function (data) {
    //            options.success(data);
    //        });
    //    }
    //}

});