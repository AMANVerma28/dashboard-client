var checked = 0;
var hchecked = 1;
var fchecked = 0;
$('#householdall').change(function () {
    if ($('#householdall').prop("checked")) {
        hchecked = 1;
        setMap();
    }
    else {
        hchecked = 0;
        setMap();
    }
});

$('#habitation').change(function () {
    setMap();
});

$('#Range').change(function () {
    setMap();
});

$('#farmpointall').change(function () {
    if ($('#farmpointall').prop("checked")) {
        fchecked = 1;
        setMap();
    }
    else {
        fchecked = 0;
        setMap();
    }
});

$('#farmall').change(function () {
    if ($('#farmall').prop("checked")) {
        checked = 1;
        setMap();
    }
    else {
        checked = 0;
        setMap();
    }
});

var slider = document.getElementById("Range");
var output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}

function maketable(array) {
    var result = "<table class='table'>";
    result += "<thead><tr>Land Info</tr><tr><th rowspan='2'>Is Own/Leased</th><th rowspan='2'>Total Extent(in acres)</th>";
    result += "<th rowspan='2'>ZBNf Irrigated</th><th rowspan='2'>ZBNf Rainfed</th><th rowspan='2'>Non ZBNf Irrigated</th>";
    result += "<th rowspan='2'>Non ZBNf Rainfed</th><th rowspan='2'>Survey No.</th></tr><tr>";
    result += "<tr>";
    result += "<td>" + array[0] + "</td>";
    result += "<td>" + array[1] + "</td>";
    result += "<td>" + array[2] + "</td>";
    result += "<td>" + array[3] + "</td>";
    result += "<td>" + array[4] + "</td>";
    result += "<td>" + array[5] + "</td>";
    result += "<td>" + array[6] + "</td>";
    result += "</tr>";
    result += "</tbody></table>";
    return result;
}

function showtable(farm, habitationvalue) {
    habitationvalue = document.getElementById("habitation").value;
    $.getJSON("../../static/json/lands.json", function (data) {
        var tableinfo = [];
        for (row in data) {
            if (data[row].farmer_id == farm.farmer_id) {
                tableinfo.push(data[row].Is_Ownleased);
                tableinfo.push(data[row].Total_extent_Land);
                tableinfo.push(data[row].zbnf_irrigated_land);
                tableinfo.push(data[row].Zbnf_Rainfed_land);
                tableinfo.push(data[row].Non_Zbnf_Irrigated_Land);
                tableinfo.push(data[row].non_zbnf_rainfed_land);
                tableinfo.push(data[row].Survey_No);
                tableinfo.push(data[row].farmer_id);
                tableinfo.push(data[row].irrigated_land);
                tableinfo.push(data[row].Sno);
                $('#myModal').modal();
            }
        }
        document.getElementById('farmdetails').innerHTML = "<p>Farmer ID : " + tableinfo[7] + "</p><br>" +
            "<p>Irrigated Land : " + tableinfo[8] + "</p><br>" + '<img src="../../static/photos/farm_' + tableinfo[9] + '.jpg">'
            + "</p><br>" + maketable(tableinfo);
    });
}

function showtable1(farmer, habitationvalue) {
    habitationvalue = document.getElementById("habitation").value;
    $.getJSON("../../static/json/farmers.json", function (data) {
        var tableinfo = [];
        for (row in data) {
            if (data[row].farmer_id == farmer.farmer_id) {
                tableinfo.push(data[row].farmer_id);
                tableinfo.push(data[row].farmer_name);
                tableinfo.push(data[row].farmer_surname);
                tableinfo.push(data[row].farmer_category);
                tableinfo.push(data[row].Social_category);
                tableinfo.push(data[row].mobile_number);
                tableinfo.push(data[row].isHavingOwnLand);
                tableinfo.push(data[row].FarmerImage);
                $('#myModal').modal();
            }
        }
        document.getElementById('farmdetails').innerHTML = '<img src="../../static/photos/farmer_' + tableinfo[7] + '">'
        + "</p><br>" + "<p>Farmer Name : " + tableinfo[2] + " " + tableinfo[1] + "</p><br>" 
        + "<p>Farmer Category : " + tableinfo[3] + "</p><br>" + "<p>Social Category : " + tableinfo[4] + "</p><br>"
        + "<p>Mobile no : " + tableinfo[5] + "</p><br>" + "<p>Is having own land : " + tableinfo[6] + "</p><br>";
    });
}

var map;
function setMap(position) {

    // The custom USGSOverlay object contains the USGS image,
    // the bounds of the image, and a reference to the map.

    var selectvalue = document.getElementById("habitation").value;
    console.log("habitation", selectvalue);

    $.getJSON("../../static/json/farmers.json", function (data) {
        var clat = 0;
        var clon = 0;
        var count = 0;
        for (obj in data) {
            if (data[obj].habitation_name == selectvalue) {
                count += 1;
                var temp = data[obj].farmergps.split('-');
                clat += parseFloat(temp[0]);
                clon += parseFloat(temp[1]);
            }
        }
        clat = clat / count;
        clon = clon / count;
        // console.log(selectvalue);
        // console.log(clat, clon);
        // console.log("hello");

        var infowindow = new google.maps.InfoWindow();

        var myCenter = new google.maps.LatLng(clat, clon);
        var mapCanvas = document.getElementById("map");
        var mapOptions = { center: myCenter, zoom: 17, mapTypeId: 'satellite' };
        map = new google.maps.Map(mapCanvas, mapOptions);

        if (hchecked) {

            $.getJSON("../../static/json/farmers.json", function (data) {
                var marker
                var house_icon = {
                    url: "../../static/img/yellow_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    if (data[row].habitation_name == selectvalue) {
                        var temp = data[row].farmergps.split('-');
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(temp[0], temp[1]),
                            icon: house_icon,

                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, row) {
                            return function () {
                                showtable1(data[row], selectvalue);
                                // infowindow.setContent('<img src="../../static/photos/farmer_' + data[row].FarmerImage + '">'
                                //     + "<br><br>" + "<b>Name : </b>" + data[row].farmer_name + "<br><br>"
                                //     + "<b>Farmer Category :</b> " + data[row].farmer_category + "<br><br>"
                                //     + "<b>Mobile Number  :</b> " + data[row].mobile_number + "<br><br>"
                                //     + "<b>Is having own land :</b> " + data[row].isHavingOwnLand);
                                // infowindow.open(map, marker);
                            }
                        })(marker, row));
                        marker.setMap(map);
                    }
                }
            });
        }

        if (fchecked) {
            $.getJSON("../../static/json/lands.json", function (datas) {
                var marker;
                var house_icon = {
                    url: "../../static/img/orange_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    // console.log(data[row].zbnf_date.substring(0,4));
                    if (data[row].zbnf_date.substring(0, 4) >= Math.floor(document.getElementById("value").innerHTML) && data[row].habitation_name == selectvalue) {
                        //console.log(data[row].farmer_id);
                        var i = 0;
                        //console.log("farm",datas[46].farmer_id);
                        for ( i=46 ; i<78 ; i++ ) {
                            //console.log("inside for");
                            if (data[row].farmer_id == datas[i].farmer_id) {
                                //console.log(data[row].farmer_id);
                                //console.log(datas[i].farmer_id);
                                var temp = datas[i].GIS.split('-');
                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(temp[0], temp[1]),
                                    icon: house_icon,
        
                                });
                                google.maps.event.addListener(marker, 'click', (function (marker, row) {
                                    return function () {
                                        showtable(data[row], selectvalue);
                                    }
                                })(marker, row));
                                marker.setMap(map);
                            }
                        }
                    }
                }
            });
        }

        if (checked) {
            $.getJSON("../../static/json/lands.json", function (datas) {
                for (row in data) {
                    // console.log(data[row].zbnf_date.substring(0,4));
                    if (data[row].zbnf_date.substring(0, 4) >= Math.floor(document.getElementById("value").innerHTML) && data[row].habitation_name == selectvalue) {
                        var iter = 0;
                        var polygon = [];
                        for (val in datas) {
                            if (data[row].farmer_id == datas[val].farmer_id && iter < 46) {
                                //console.log(data[row].farmer_id);
                                polygon = datas[val].GIS;
                                var temp = polygon.split(',');
                                // console.log(temp.length);
                                var path = [];
                                for (gis in temp) {
                                    var cord = temp[gis].split('^');
                                    var lat = cord[0];
                                    var temp1 = cord[1].split('#');
                                    var lon = temp1[0];
                                    path.push(new google.maps.LatLng(lat, lon));
                                    // console.log("lat:", lat, " lon:", lon);
                                }
                                var flightPath = new google.maps.Polygon({
                                    path: path,
                                    strokeColor: "#35ad35",
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    fillColor: "#35ad35",
                                    fillOpacity: 0.4,
                                });
                                flightPath.setMap(map);
                                google.maps.event.addListener(flightPath, 'click', (function (marker, row) {
                                    return function () {
                                        showtable(data[row], selectvalue);
                                    }
                                })(flightPath, row));
                            }
                            iter++;
                        }
                    }
                }
            });
        }
    });
}