app.views.HomeView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            this.$username = this.$el.find('input#username');
            this.$password = this.$el.find('input#password');
            this.remember = localStorage.getItem('remember');
            if (_.isNull(this.remember)) {
                this.remember = true;
            }
            this.save_load_credential();
            return this;
        },

        events: {
            "submit #loginForm ": "login",
            "toggle": "remember_cb"
        },
        login: function () {
            var homeview_class = app.views.HomeView;
            //disable the button so we can't resubmit while we wait
            $("#submitButton", this).attr("disabled", "disabled");
            var u = this.$username.val();
            var p = this.$password.val();
            if (homeview_class.hashedPassword === p) {
                p = homeview_class.hashedPassword;
            }
            else {
                homeview_class.hashed = false;
            }

            if (u !== '' && p !== '') {
                // if (u == 'redgar942' && p === 'changeme4') {
                //     window.localStorage.setItem('cuser', '{"statusCode":null,"statusDescription":"","enrolled":true,"commuterData":{"shareWPhone":"N","arriveBefore":"90","addrZip":"20901","empId":"521370","milesToWork":"10","dateUpdated":"09/22/2015","grhRegnId":"C098588","empName":"COUNCIL OF GOVERNMENTS","empState":"DC","dateEntered":"12/27/2007","middleName":"L","empZip":"20002","shareCPhone":"N","cphone2":"793","cphone1":"717","leaveAfter":"90","ridesAllw":"4","cphone3":"7042","hphone2":"592","hphone3":"1442","addrState":"MD","comstatus":"A ","hphone1":"301","shareName":"N","grhElgDate":"09/23/2015","commuteDays":"5","sphone":"202-962-3313","marketingEmails":"Y","commuterName":"ROSS EDGAR","smokeStatus":"SMK_1_2","ridesAllowed":"4","ridesComp":"0","toHRS":"5","grhstatus":"7 ","title":"","ridesAppr":"1","empAddrId":"6420962","addrCity":"SILVER SPRING","wphone":"202-962-3285","hphone":"301-592-1442","toAMPM":"PM","supEmail":"NR@NOEMAIL.COM","fromAMPM":"AM","addrStreet2":"","addrStreet1":"1002 CARSON ST","leaveBefore":"90","carpool":"RCC_1_5","homeJur":"MC","supLName":"RAMFOS","fromMNS":"00","ccrsRegStatus":"R","grhregist":"7 ","empBuildg":"","userName":"redgar942","cphone":"717-793-7042","workJur":"DC","grhOrgDate":"12/27/2007","regForRideHome":"true","workEndTime":"1700 ","lastName":"EDGAR","appform":"MGRH2","idCommuter":"107574","fphone1":"","empSuite":"","fphone2":"","fphone3":"","grhExpDate":"09/22/2016","regForAlexandriaChallenge":"false","email":"REDGAR@MWCOG.ORG","sphone3":"3313","shareFPhone":"","sphone4":"","sphone1":"202","idUser":"redgar942","sphone2":"962","commuteMode":"6","addrId":"1015147","shareAddr":"N","supFName":"NICHOLAS","grhAppCode":"GRHw","smokePref":"SMK_2_2","grhStatus":"Re-registrant","vanpool":"RCC_2_4","idWebsite":"10001","ccrsRegDate":"10/02/2015","comModeDesc":"MARC","shareEmail":"N","toMNS":"00","empStreet1":"777 NORTH CAPITOL ST NE","idCommOrig":"89000298","empStreet2":"","regForRideShare":"true","ridesReqt":"0","ccrsExpDate":"10/01/2016","arriveAfter":"90","firstName":"ROSS","grhRegDate":"12/27/2007","fromHRS":"9","aptNo":"","ridesAvail":"4","wphone3":"3285","wphone4":"","empCity":"WASHINGTON","wphone1":"202","wphone2":"962","workStartTime":"0900 ","shareHPhone":"N"},"commuter":107574,"firstName":"Ross","addresses":[{"addrStreet2":"","addrZip":"20901     ","addrBldg":"","addrType":"HOME","addrStreet1":"1002 CARSON ST","addrName":"","addrSuite":"","addrJur":"","addrCity":"SILVER SPRING","addrLocation":"TBLCOMMUTERADDR","addrState":"MD","addrGeocodes":"","idAddress":"1015147"},{"addrStreet2":"","addrZip":"20002","addrBldg":"","addrType":"WORK","addrStreet1":"777 NORTH CAPITOL ST NE","addrName":"","addrSuite":"","addrJur":"","addrCity":"WASHINGTON","addrLocation":"TBLEMPLOYERADDR","addrState":"DC","addrGeocodes":"","idAddress":"6420962"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"9730 Georgia Ave, Forest Glen, MD 20910","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.015267,-77.042805","idAddress":"255"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"11171 Georgia Ave, Silver Spring, MD 20902","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.038254,-77.051392","idAddress":"261"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"1170 Bonifant St, Silver Spring, MD 20910","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"38.993161,-77.029597","idAddress":"253"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"3700 Howard Ave, Kensington, MD 20895","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.026477,-77.07203","idAddress":"250"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"12501 Georgia Ave, Silver Spring, MD 20906","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.061694,-77.05268","idAddress":"256"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"First St NE & Massachusetts Ave NE","addrName":"","addrSuite":"","addrJur":"","addrCity":"District Of Columbia","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"DISTRICT OF COLUMBIA","addrGeocodes":"38.900078,-77.006313","idAddress":"112"}],"hashedPassword":"37I8ZpvdlJ6WTinNZj55MylTNjk=","username":"Redgar942","email":"redgar@mwcog.org"}');
                //     app.cuser.addresses = JSON.parse('[{"addrStreet2":"","addrZip":"20901     ","addrBldg":"","addrType":"HOME","addrStreet1":"1002 CARSON ST","addrName":"","addrSuite":"","addrJur":"","addrCity":"SILVER SPRING","addrLocation":"TBLCOMMUTERADDR","addrState":"MD","addrGeocodes":"","idAddress":"1015147"},{"addrStreet2":"","addrZip":"20002","addrBldg":"","addrType":"WORK","addrStreet1":"777 NORTH CAPITOL ST NE","addrName":"","addrSuite":"","addrJur":"","addrCity":"WASHINGTON","addrLocation":"TBLEMPLOYERADDR","addrState":"DC","addrGeocodes":"","idAddress":"6420962"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"9730 Georgia Ave, Forest Glen, MD 20910","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.015267,-77.042805","idAddress":"255"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"11171 Georgia Ave, Silver Spring, MD 20902","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.038254,-77.051392","idAddress":"261"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"1170 Bonifant St, Silver Spring, MD 20910","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"38.993161,-77.029597","idAddress":"253"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"3700 Howard Ave, Kensington, MD 20895","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.026477,-77.07203","idAddress":"250"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"12501 Georgia Ave, Silver Spring, MD 20906","addrName":"","addrSuite":"","addrJur":"","addrCity":"Montgomery","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"MARYLAND","addrGeocodes":"39.061694,-77.05268","idAddress":"256"},{"addrStreet2":"","addrZip":"","addrBldg":"","addrType":"PARK&RIDE","addrStreet1":"First St NE & Massachusetts Ave NE","addrName":"","addrSuite":"","addrJur":"","addrCity":"District Of Columbia","addrLocation":"TBLLOOKUP_PARK_AND_RIDE","addrState":"DISTRICT OF COLUMBIA","addrGeocodes":"38.900078,-77.006313","idAddress":"112"}]');
                //     app.cuser.commuter_data = JSON.parse('{"shareWPhone":"N","arriveBefore":"90","addrZip":"20901","empId":"521370","milesToWork":"10","dateUpdated":"09/22/2015","grhRegnId":"C098588","empName":"Council of governments","empState":"Dc","dateEntered":"12/27/2007","middleName":"L","empZip":"20002","shareCPhone":"N","cphone2":"793","cphone1":"717","leaveAfter":"90","ridesAllw":"4","cphone3":"7042","hphone2":"592","hphone3":"1442","addrState":"MD","comstatus":"A ","hphone1":"301","shareName":"N","grhElgDate":"09/23/2015","commuteDays":"5","sphone":"202-962-3313","marketingEmails":"Y","commuterName":"Ross Edgar","smokeStatus":"SMK_1_2","ridesAllowed":"4","ridesComp":"0","toHRS":"5","grhstatus":"7 ","title":"","ridesAppr":"1","empAddrId":"6420962","addrCity":"Silver Spring","wphone":"202-962-3285","hphone":"301-592-1442","toAMPM":"PM","supEmail":"nr@noemail.com","fromAMPM":"AM","addrStreet2":"","addrStreet1":"1002 Carson St","leaveBefore":"90","carpool":"RCC_1_5","homeJur":"MC","supLName":"Ramfos","fromMNS":"00","ccrsRegStatus":"R","grhregist":"7 ","empBuildg":"","userName":"redgar942","cphone":"717-793-7042","workJur":"DC","grhOrgDate":"12/27/2007","regForRideHome":"true","workEndTime":"1700 ","lastName":"Edgar","appform":"MGRH2","idCommuter":"107574","fphone1":"","empSuite":"","fphone2":"","fphone3":"","grhExpDate":"09/22/2016","regForAlexandriaChallenge":"false","email":"redgar@mwcog.org","sphone3":"3313","shareFPhone":"","sphone4":"","sphone1":"202","idUser":"redgar942","sphone2":"962","commuteMode":"6","addrId":"1015147","shareAddr":"N","supFName":"Nicholas","grhAppCode":"GRHw","smokePref":"SMK_2_2","grhStatus":"Re-registrant","vanpool":"RCC_2_4","idWebsite":"10001","ccrsRegDate":"10/02/2015","comModeDesc":"Marc","shareEmail":"N","toMNS":"00","empStreet1":"777 North Capitol St Ne","idCommOrig":"89000298","empStreet2":"","regForRideShare":"true","ridesReqt":"0","ccrsExpDate":"10/01/2016","arriveAfter":"90","firstName":"Ross","grhRegDate":"12/27/2007","fromHRS":"9","aptNo":"","ridesAvail":"4","wphone3":"3285","wphone4":"","empCity":"Washington","wphone1":"202","wphone2":"962","workStartTime":"0900 ","shareHPhone":"N"}');
                //     app.cuser.save(JSON.parse('{"enrolled":true,"commuter":107574,"username":"Redgar942","email":"redgar@mwcog.org","status_code":null,"status_description":"","first_name":"Ross","hashed_password":"37I8ZpvdlJ6WTinNZj55MylTNjk="}'),
                //         {
                //             forceRefresh: true,
                //             error: function () {
                //                 console.log("Error saving cuser")
                //             }
                //             ,
                //             success: function (response) {
                //                 console.log("Got response from capo api: " + response);
                //             }
                //         }
                //     );
                //     window.localStorage.setItem("justLoggedIn", 1);
                //     console.log(localStorage);
                //     app.router.navigate('/dashboard');
                //     app.router.dashboard();
                //
                // } else {
                var view = this;
                $('.page').addClass('whirl traditional');
                $.get(config.commuterUrl + "json?action=login&username=" + u + "&password=" + p + '&password_saved=' + homeview_class.hashed, function (res) {
                    $('.page').removeClass('whirl traditional');
                    if (res.statusCode === 1) {
                        app.start_heartbeat();
                        ga('send', 'event', 'Login', 'Username: ' + u);

                        res.statusCode = null;

                        res.username = s.capitalize(res.commuterData.userName.toLowerCase());
                        res.firstName = s.capitalize(res.firstName.toLowerCase());
                        res.email = res.commuterData.email.toLowerCase();

                        window.localStorage.setItem("cuser", JSON.stringify(res));
                        if (res.hasOwnProperty('commuterData')) {
                            for (var key in res.commuterData) {
                                if (!res.commuterData.hasOwnProperty(key)) {
                                    continue;
                                }
                                if (res.commuterData[key] == null) {
                                    console.info("Null key: ");
                                    console.info(key);
                                    continue;
                                }
                                if (['supFName', 'commuterName', 'empName', 'empState', 'supLName', 'lastName', 'supFName', 'comModeDesc',
                                        'firstName', 'empCity'].indexOf(key) !== -1) {
                                    res.commuterData[key] = s.capitalize(res.commuterData[key].toLowerCase());
                                }
                                if (['email', 'supEmail'].indexOf(key) !== -1) {
                                    res.commuterData[key] = res.commuterData[key].toLowerCase();
                                }
                                if (['empStreet1', 'addrStreet1', 'addrCity', 'commuterName'].indexOf(key) !== -1) {
                                    res.commuterData[key] = s.titleize(res.commuterData[key].toLowerCase());
                                }
                            }

                            app.cuser.commuter_data = res.commuterData;
                        }
                        if (res.hasOwnProperty('addresses')) {
                            app.cuser.addresses = res.addresses;
                        }

                        //only pass a portion of it to Backbone

                        res.commuter_data = JSON.stringify(res.commuterData);
                        res = _.pick(res, 'statusCode', 'statusDescription', 'enrolled', 'commuter', 'firstName', 'hashedPassword', 'username', 'email', 'commuter_data');
                        res.apns_device_reg_id = localStorage.getItem('registrationId');

                        array_keys_to_underscore(res);
                        app.cuser.save(res, {
                            forceRefresh: true, success: function (response) {
                                app.cuser.fetch({success: app.menuView.hide_or_show_incen_menu});
                            }
                        });

                        window.localStorage.setItem("justLoggedIn", 1);
                        if (view.remember) {
                            window.localStorage.setItem('username', view.$username.val());
                            window.localStorage.setItem('pasword', view.$password.val());
                        }
                        console.log(localStorage);
                        app.router.navigate('/dashboard');
                        app.router.dashboard();

                    } else {
                        if (res.statusCode === 0 && res.statusDescription === 'This account has not yet been activated.') {
                            $(app.homeView.el).find('#activate_account_modal').rmodal();
                            return;
                        }
                        else {
                            homeview_class.$submit_button.removeAttr("disabled");
                            app.utils.misc.show_message(
                                'You have entered an invalid username and password, please try again', // message
                                null, // callback
                                'Invalid Login', // title
                                'Ok'                  // buttonName
                            );
                        }
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

                // }
            }
            return false;

        },
        remember_cb: function (e) {
            this.remember = $(e.target).hasClass('active');
            this.remember = Boolean(this.remember);
            localStorage.setItem('remember', this.remember);
            this.save_load_credential();
        },
        save_load_credential: function () {
            this.remember = Boolean(this.remember);
            if (this.remember !== true) {
                window.localStorage.setItem("password", "");
                window.localStorage.setItem("username", "");
                this.$username.val('');
                this.$password.val('');
                this.hashed = false;
            } else {
                if (!_.isEmpty(window.localStorage.getItem('username'))) {
                    this.$username.val(window.localStorage.getItem('username'));
                }
                if (!_.isEmpty(window.localStorage.getItem('pasword'))) {
                    this.$password.val(window.localStorage.getItem('pasword'));
                }
            }
        },
        activate_account: function (btn) {
            if (this.verify_reg_acnt(btn)) {
                console.log("all ok");
                var form = $(btn).closest('form');
                var form_vars = jq_serial_array_to_assoc(form.serializeArray());
                $.extend(form_vars, {action: "activateNewCommuter", siteId: 10001, username: $('#username').val(), commuterId: 12345});//todob get commuterID
                console.info(form_vars);
                $('.page').addClass('whirl traditional');
                var self = this;
                $.ajax(config.commuterUrl + 'mobileapicontroller', {
                    data: form_vars, error: function (data) {
                        console.error(data);
                    }, success: function (data) {
                        console.info(data);
                        if (data.hasOwnProperty('activation') && data.activation === 'failed') {
                            app_alert('We apologize but there has been an error in processing your account activation.  Please call Commuter Connections at 1-800-745-RIDE for assistance with your account.');
                        } else {
                            app_toast('Validation successful. Logging you in...');
                            setTimeout(function () {
                                    self.login.apply(self);
                                    $('#activate_account_modal').rmodal('hide');
                                }, 2000
                            );
                        }
                    }
                }).done(function () {
                    $('.page').removeClass('whirl traditional');
                })
            }
        },
        verify_reg_acnt: function (btn) {
            var formObj = $(btn).closest('form').get(0);
            // check password for validity and compare with confirmation password
            if (formObj.password1.value !== "" && formObj.password1.value != null) {
                if (formObj.password1.value.length < 8) {
                    app_alert("Password must contain at least eight alphanumeric characters!");
                    formObj.password1.focus();
                    return false;
                }
                re = /^([a-zA-Z0-9_]+)$/;
                if (!re.test(formObj.password1.value)) {
                    app_alert("Password must be alphanumeric only.");
                    formObj.password1.focus();
                    return false;
                }
                re = /[0-9]/;
                if (!re.test(formObj.password1.value)) {
                    app_alert("Password must contain at least one number (0-9).");
                    formObj.password1.focus();
                    return false;
                }
                re = /[a-zA-Z]/;
                if (!re.test(formObj.password1.value)) {
                    app_alert("Password must contain at least one letter (a-z).");
                    formObj.password1.focus();
                    return false;
                }
            } else {
                app_alert("Please enter a password.");
                formObj.password1.focus();
                return false;
            }
            if (formObj.password2.value === "" || formObj.password2.value == null) {
                app_alert("Please enter confirmation password.\n(Must be same as password)");
                formObj.password2.focus();
                return false;
            }
            if (formObj.password1.value !== "" && formObj.password1.value !== formObj.password2.value) {
                app_alert("Password and confirmation password must be same.");
                formObj.password2.focus();
                return false;
            }

            // check password recovery question
            if (formObj.pwdQuestion.value === "") {
                app_alert("Please select a password recovery question.");
                formObj.pwdQuestion.focus();
                return false;
            }
            // check password recovery answer
            if (formObj.pwdAnswer.value === "") {
                app_alert("Please enter password recovery answer.");
                formObj.pwdAnswer.focus();
                return false;
            }
            return true;
        },
        dom_ready: function () {
            var remember = localStorage.getItem('remember');
            if (remember) {
                $('#remember').addClass('active');
            } else {
                $('#remember').removeClass('active');
            }
        }
    },
    {
        username: '',
        password: '',
        $username: '',
        $password: '',
        hashedPassword: '',
        hashed: true,
        remember: true
    }
)
;

app.cuser = new app.models.Cuser();
if (IS_DEBUG) {
    window.localStorage.removeItem('cuser');
}
app.local_store_cuser = {};

//testing backbone localstorage
// var Model = Backbone.Model.extend({
//     urlRoot: '/tpl/fixtures.json',
//     localStorage: true
// });
// var model = new Model({});
// model.fetch({
//     success: function (model, response, options) {
//         console.log(Backbone.LocalStorage._getData('/tpl/fixtures.json'));
//     }
// });

// function preloadParkandRide() {
//     randomNum = Math.floor(Math.random() * 10000000);
//     //var xmlUrl = "http://www.ie511.org/park_and_ride_data_ios.aspx?" + randomNum.toString();
//     // var xmlUrl = "http://cloud.ie511.org/park-and-ride-data";
//     var xmlUrl = 'https://usvsolutions.com/ie511/pnr.php';
//     $.ajax({
//         url: xmlUrl,
//         type: 'GET',
//         success: function (data) {
//
//             //var xmlText = new XMLSerializer().serializeToString(data);
//
//             window.localStorage.setItem('park_and_ride_data', JSON.stringify(data));
//
//         },
//         error: function (xhr, status, error) {
//             alert('error');
//         }
//     });
// }
