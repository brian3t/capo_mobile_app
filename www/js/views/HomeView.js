app.views.HomeView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    events: {
        "submit #loginForm ": "login"
    },
    login: function () {
        var homeview_class = app.views.HomeView;
        //disable the button so we can't resubmit while we wait
        $("#submitButton", this).attr("disabled", "disabled");
        var u = homeview_class.$username.val();
        var p = homeview_class.$password.val();
        var rememberMe = true;//TODO for now rememberme is always true. this.remember is also true

        if (!rememberMe) {
            window.localStorage.setItem("hashedPassword", "");
            window.localStorage.setItem("username", "");
            $("#password").val("");
            homeview_class.hashed = false;
        }
        if (homeview_class.hashedPassword === p) {
            p = homeview_class.hashedPassword;
        }
        else {
            homeview_class.hashed = false;
        }

        if (u != '' && p != '') {

            $.get(config.commuterUrl + "json?action=login&username=" + u + "&password=" + p + '&password_saved=' + homeview_class.hashed, function (res) {
                if (res.statusCode === 1) {
                    // var addresses = res.addresses;
                    // window.localStorage.setItem("idCommuter", res.commuter);
                    // window.localStorage.setItem("enrolled", res.enrolled);
                    // window.localStorage.setItem("userName", u);
                    // window.localStorage.setItem("addresses", JSON.stringify(addresses));
                    // window.localStorage.setItem("commuterData", JSON.stringify(res.commuterData));
                    // window.localStorage.setItem("arriveAfter", res.commuterData.arriveAfter);
                    // if (rememberMe) {
                    //     window.localStorage.setItem("hashedPassword", res.hashedPassword);
                    //     window.localStorage.setItem("rememberCheckbox", true);
                    //     window.localStorage.setItem("username", u);
                    // }

                    res.statusCode = null;
                    window.localStorage.setItem('cuser', JSON.stringify(res));

                    //only pass a portion of it to Backbone
                    res = _.pick(res, 'commuter');
                    // res = _.pick(res, 'statusCode', 'statusDesciption', 'enrolled', 'commuter', 'firstName', 'hashedPassword');
                    // res['enrolled'] = (res['enrolled'] == true?1:0);
                    app.cuser.save(res, {forceRefresh:true});

                    window.localStorage.setItem("justLoggedIn", 1);
                    console.log(localStorage);
                    // app.router.navigate('/dashboard');app.router.dashboard();


                } else {
                    homeview_class.$submit_button.removeAttr("disabled");
                    app.utils.misc.show_message(
                        'You have entered an invalid username and password, please try again', // message
                        null, // callback
                        'Invalid Login', // title
                        'Ok'                  // buttonName
                    );
                }

                homeview_class.$submit_button.removeAttr("disabled");
            }, "json").error(
                function () {
                    homeview_class.$submit_button.removeAttr("disabled");

                    app.utils.misc.show_message(
                        'An error has occured, please try again.', // message
                        null, // callback
                        'Error', // title
                        'Ok'                  // buttonName
                    );
                });

        }
        return false;

    }


}, {
    username: '',
    password: '',
    $username: '',
    $password: '',
    hashedPassword: '',
    hashed: true,
    remember: true

});

app.cuser = new app.models.Cuser;
var Model = Backbone.Model.extend({
    urlRoot: '/tpl/fixtures.json',
    localStorage: true
});
var model = new Model({});
model.fetch({
    success: function(model, response, options){
        console.log(Backbone.LocalStorage._getData('/tpl/fixtures.json'));
    }
});