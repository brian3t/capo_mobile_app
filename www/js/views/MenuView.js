app.views.MenuView = Backbone.View.extend({
    model: app.cuser,
    initialize: function () {
        this.model = app.cuser;
        this.render();
        this.model.on("change update", this.render_or_not_render, this);
    },
    render_or_not_render: function (model) {
        console.info(model);
        if (_.size(model.changed) > 2){
            this.render();
        }//otherwise it's probably just app heartbeat
    },
    render: function () {
        if (!_.isObject(app.cuser)) {
            return this;
        }
        this.$el.html(this.template($.extend({}, this.model.attributes, {commuter_data: this.model.commuter_data})));
        return this;
    },

    events: {
        "click .logout": "logout",
        "click .driver_incentive": "driver_incentive",
        "click #driver_incentive_agree": "driver_incentive_agree",
        "touchend #driver_incentive_toggle": "trigger_i_agree"
    },
    logout: function (e) {
        var self = this;
        app_confirm("Are you sure you want to log out?", function (response) {
            if (response == true || response == 1) {
                app.reset_user();
                self.back();
            }
            app.utils.misc.hide_popover();
            app.is_notification_active = false;
        })
    },

    back: function (event) {
        ratchet_popover_dismiss();
        app.router.navigate('#', {trigger: true, replace: true});
    },
    driver_incentive: function () {
        //double check to see whether agreement is already 1
        if (app.cuser.get('has_agreement') === 1) {
            return false;
        }
    },
    hide_or_show_incen_menu: function () {
        var incen_li = $('#popover li.driver_incentive');
        if (app.cuser.get('has_agreement') === 1) {
            incen_li.hide();
        } else {
            incen_li.show();
        }
    },
    trigger_i_agree: function () {
        var is_on = $('#driver_incentive_toggle').hasClass('active');
        var i_agree_btn = this.$el.find('#driver_incentive_agree');
        if (!is_on) {
            i_agree_btn.removeAttr('disabled');
        } else {
            i_agree_btn.attr('disabled', true);
        }
    },
    driver_incentive_agree: function () {
        var self = this;
        app.cuser.once('change', function () {
            self.hide_or_show_incen_menu();
        });
        app.cuser.save({has_agreement: 1}, {
            patch: true, wait: true,
            success: function () {
                console.info('Done');
                $('#driver_incentive_modal_close').click();
            },
            error: function () {
                console.error(app.cuser.attributes);
                $('#driver_incentive_modal_close').click();
            }
        });
        app.cuser.once('change', function () {
            self.hide_or_show_incen_menu();
        });

    }
});
