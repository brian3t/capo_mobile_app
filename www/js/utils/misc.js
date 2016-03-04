/**
 * Created by tri on 11/21/14.
 */
app.utils.misc = (function () {
    var USSTATES = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AS": "American Samoa",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia",
            "FL": "Florida",
            "GA": "Georgia",
            "GU": "Guam",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MH": "Marshall Islands",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "MP": "Northern Mariana Islands",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PW": "Palau",
            "PA": "Pennsylvania",
            "PR": "Puerto Rico",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VI": "Virgin Islands",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        },
        bindModal = function () {
            $('.modal-js').each(function () {
                $(this).click(function () {
                    $('#' + $(this).data('target')).addClass("active");
                    $('div.modal>header>a').each(function () {
                        $(this).click(function () {
                            $(this).parent().parent('div.modal').removeClass("active");
                        });
                    });
                });

            });

        },
        applyInAppBrowser = function (href) {
            if (href == "" || (typeof href == "undefined")) {
                return;
            }
            if ((href.indexOf('.pdf') !== -1) || (href.indexOf('.doc') !== -1)) {
                var ref = window.open('https://docs.google.com/viewer?url=' + href + '&embedded=true', '_blank', 'toolbarposition=top,toolbar=yes');
            }
            else {
                var ref = window.open(href, '_blank', 'toolbarposition=top,toolbar=yes');
            }


        },
        afterBBRender = function(){
            if (isInWeb){
                $('.cordova-only').hide();
            }
            else{
                $('.non-cordova-only').hide();
            }
        },
        initFb= function(){
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1503339389930016&version=v1.0";
                try {fjs.parentNode.insertBefore(js, fjs);}
                catch (e){
                    console.log('Facebook sdk error: '.e);
                }
            }(document, 'script', 'facebook-jssdk'));
        }
        ;
    return {
        USSTATES: USSTATES,
        bindModal: bindModal,
        applyInAppBrowser: applyInAppBrowser,
        afterBBRender : afterBBRender,
        initFb : initFb
    };

}());
