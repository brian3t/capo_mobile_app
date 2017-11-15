/**
 *
 */
//send error message to the system administrator
function sendErrmsgtoSysAdmin(baseURL) {
    var httpRequest;
    var message = document.getElementById("senderrmsg").value;
    var url = baseURL + message + "&ajaxFunction=sendErrorMessage";
    document.getElementById("sentMsg").innerHTML = "<p class=red>Sending Error to Admin, please wait</p>";
    try {
        httpRequest = new XMLHttpRequest();
    } catch (e) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Your browser does not support AJAX!");
                return false;
            }
        }
    }
    httpRequest.open("POST", url, true);
    httpRequest.onreadystatechange = function () {
        document.getElementById("sentMsg").innerHTML = "<b class=red>Error reported to Admin successfully.</b>";
        document.getElementById("errorMsgPlaceHolder").style.display = "none";
    };
    httpRequest.send(null);
}

//send error message to the system administrator
function checkAddressBoundary(baseURL) {
    var httpRequest;
    var addrStreet1 = document.getElementById("addrStreet1").value;
    var addrStreet2 = document.getElementById("addrStreet2").value;
    var addrCity = document.getElementById("addrCity").value;
    var addrState = document.getElementById("addrState").value;
    var addrZip = document.getElementById("addrZip").value;

    var url = baseURL + addrStreet1.toUpperCase() + "&addrStreet2=" + addrStreet2.toUpperCase() + "&addrCity=" + addrCity.toUpperCase() + "&addrState=" + addrState.toUpperCase() + "&addrZip=" + addrZip.toUpperCase() + "&ajaxFunction=checkBoundaryRegion";
    try {
        httpRequest = new XMLHttpRequest();
    } catch (e) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Your browser does not support AJAX!");
                return false;
            }
        }
    }
    httpRequest.open("POST", url, true);
    httpRequest.onreadystatechange = function () {
        document.getElementById("addressBoundary").innerHTML = httpRequest.responseText;
    };
    httpRequest.send(null);
}

//update text area for CMS Message Editor
function updateTextArea(baseURL, siteId, idScreen) {
    var httpRequest;

    var url = baseURL + idScreen + "&siteId=" + siteId + "&ajaxFunction=cmsMessageUpdate";
    try {
        httpRequest = new XMLHttpRequest();
    } catch (e) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Your browser does not support AJAX!");
                return false;
            }
        }
    }
    httpRequest.open("POST", url, true);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            document.getElementById("textarea2").value = httpRequest.responseText;
            window.location.reload();
        }
    };
    httpRequest.send(null);
}

/**
 * Parse employer data into proper array. Requires UnderscoreJs
 * @param data
 * @returns [] array of employers object. Each employer has name, address, employerAddrId
 */
function parse_employer_data(data) {
    // data= {
    //     "employer0: ": "COUNCIL OF GOVERNMENTS",
    //     "employer0employerId": "521370",
    //     "employer0address0: ": "777 NORTH CAPITOL ST NE  WASHINGTON DC 20002",
    //     "employer0employerAddrId": "6420962",
    //     "employer1: ": "ICMA - RC",
    //     "employer1employerId": "538725",
    //     "employer1address1: ": "777 NORTH CAPITOL ST NE  WASHINGTON DC 20002",
    //     "employer1employerAddrId": "6438317",
    //     "employer2: ": "JRSA",
    //     "employer2employerId": "539257",
    //     "employer2address2: ": "777 NORTH CAPITOL ST NE STE 800  WASHINGTON DC 20002",
    //     "employer2employerAddrId": "6438849",
    //     "employer3: ": "ICMA RETIREMENT CORPORATION",
    //     "employer3employerId": "539667",
    //     "employer3address3: ": "777 NORTH CAPITOL ST NE  WASHINGTON DC 20002",
    //     "employer3employerAddrId": "6439259",
    //     "employer4: ": "ICMA RETIREMENT CORPORATION-9",
    //     "employer4employerId": "539668",
    //     "employer4address4: ": "777 NORTH CAPITOL ST NE STE 9  WASHINGTON DC 20002",
    //     "employer4employerAddrId": "6439260",
    //     "employer5: ": "ICMA-RC",
    //     "employer5employerId": "539684",
    //     "employer5address5: ": "777 NORTH CAPITOL ST NE STE 600  WASHINGTON DC 20002",
    //     "employer5employerAddrId": "6439276",
    //     "employer6: ": "ICMARC",
    //     "employer6employerId": "539691",
    //     "employer6address6: ": "777 NORTH CAPITOL ST NE  WASHINGTON DC 20002",
    //     "employer6employerAddrId": "6439283",
    //     "employer7: ": "MWCOG",
    //     "employer7employerId": "540455",
    //     "employer7address7: ": "777 NORTH CAPITOL ST NE STE 300  WASHINGTON DC 20002",
    //     "employer7employerAddrId": "6440047",
    //     "employer8: ": "ICMA-RC",
    //     "employer8employerId": "1522326",
    //     "employer8address8: ": "777 NORTH CAPITOL ST NE #900  WASHINGTON DC 20002",
    //     "employer8employerAddrId": "16422025",
    //     "employer9: ": "JRSA",
    //     "employer9employerId": "1525641",
    //     "employer9address9: ": "777 NORTH CAPITOL ST NE STE 801  WASHINGTON DC 20002",
    //     "employer9employerAddrId": "16425504",
    //     "employer10: ": "INTERNATIONAL CITY/COUNTY MANAGEMENT ASSOCIATION",
    //     "employer10employerId": "1532218",
    //     "employer10address10: ": "777 NORTH CAPITOL ST NE STE 500  WASHINGTON DC 20002",
    //     "employer10employerAddrId": "16432101",
    //     "employer11: ": "ICMA-RC",
    //     "employer11employerId": "1546379",
    //     "employer11address11: ": "777 NORTH CAPITOL ST NE #6  WASHINGTON DC 20002",
    //     "employer11employerAddrId": "16453147",
    //     "employer12: ": "METRO WASHINGTON COUNCIL OF GOV'TS",
    //     "employer12employerId": "1552367",
    //     "employer12address12: ": "777 NORTH CAPITOL ST NE  WASHINGTON DC 20002",
    //     "employer12employerAddrId": "16459121",
    //     "employer13: ": "ICMA",
    //     "employer13employerId": "1555365",
    //     "employer13address13: ": "777 NORTH CAPITOL ST NE STE 500  WASHINGTON DC 20002",
    //     "employer13employerAddrId": "16462117"
    // };

    if (typeof data !== "object") {
        return null;
    }
    data = _.toArray(data);
    var result = [];
    var employer = {};
    var num_of_employer = Math.round(data.length / 4);
    for (var i = 0; i < data.length;) {
        result.push({
            name: data[i++].toLowerCase(),
            id: data[i++],
            address: data[i++].toLowerCase(),
            address_id: data[i++]
        });
    }
    return result;
}
//display list of employers during registration
function searchEmployerDuringRegn(employerStNo, employerStreet) {
    if (employerStNo == null || employerStreet == null) {
        app_alert("Please enter atleast employer name or employer streets");
        return false;
    }
    var url = CMW.apiurl;
    // + "?employerStNo=" + employerStNo + "&employerStreet=" + employerStreet + "&ajaxFunction=employerSearchforReg";
    document.getElementById("loadingMessage").innerHTML = "<b style='color: red;'>Searching for Employers please wait.</b>";
    $.get(
        url, {action: 'employerSearch', employerStNo: employerStNo, employerStreet: employerStreet},
        function (data, status) {
            if (status != 'success') {
                return;
            }
            document.getElementById("loadingMessage").innerHTML = "";
            data = parse_employer_data(data);
            app.employer_data = data;
            /*
             <li class="table-view-cell">
             <span>council of governments</span>
             <span>777 north capitol st ne washington dc 20002</span>
             <span><button class="btn">Select</button></span>
             </li>
             */
            for (var i = 0; i < data.length; i++) {
                var li = $('<li>').addClass('table-view-cell');
                li.append('<span>' + data[i].name + '</span>');
                li.append('<span>' + data[i].address + '</span>');
                li.append('<input type="radio" name="empIndex" value="' + i + '">');
                li.append('<input type="hidden" name="employerId'+i+'" value = "'+data[i].id + '"> ');
                li.append('<input type="hidden" name="empAddrId' + i + '" value="' + data[i].address_id + '">');
                $('#employerDetails').find('ul.table-view').append(li);
            }
            $('#employerDetails').show();
            $('#employerDetails').find('input[name="empIndex"]').change(function (e) {
                var emp_index = parseInt(e.target.value);
                if (app.employer_data.hasOwnProperty(emp_index)){
                    var full_addr= (app.employer_data[emp_index]).address;
                    var addr_parts = full_addr.split(' ');
                    var str_no = addr_parts.shift();
                    $('#employerStNo').text(str_no).val(str_no);
                    $('#employerStreet').text(addr_parts.join(' ')).val(addr_parts.join(' '));
                }
                $('#employerDetails').hide();
            });
        }
    );
}

//add new employer during registration
function addNewEmployerDuringRegn(elemId) {
    if (document.getElementById(elemId).checked == true) {
        document.getElementById("addNewEmployer").style.display = "";
    } else {
        document.getElementById("addNewEmployer").style.display = "none";
    }
}

//filter the reports based on filter selection group
function displayReportsforAdmins(baseURL1, baseURL, reportFilter) {
    var httpRequest;
    if (reportFilter == 0) {
        alert("Please select a filter.");
        return false;
    } else {
        var url = baseURL1 + reportFilter + "&baseURL=" + baseURL + "&ajaxFunction=getReportListbasedOnFilter";
        try {
            httpRequest = new XMLHttpRequest();
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("Your browser does not support AJAX!");
                    return false;
                }
            }
        }
        httpRequest.open("POST", url, true);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                document.getElementById("displayReports").innerHTML = httpRequest.responseText;
            }
        };
        document.getElementById("profileSection").style.display = "none";
        httpRequest.send(null);
    }
}

function getReportProfile2(siteurl, reportSelected) {
    if (reportSelected != 10) {
        var url = siteurl + reportSelected;
        try {
            httpRequest = new XMLHttpRequest();
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("Your browser does not support AJAX!");
                    return false;
                }
            }
        }
        httpRequest.open("GET", url, true);
        httpRequest.onreadystatechange = function () {
            document.getElementById("profileSection").style.display = "";
            document.getElementById("profileSection").innerHTML = httpRequest.responseText;
        };
        httpRequest.send(null);
    } else {
        document.getElementById("profileSection").innerHTML = " ";
        return false;
    }
}