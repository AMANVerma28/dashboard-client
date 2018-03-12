var checked = 0;
var hchecked = 1;
var fchecked = 1;
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
    result += "<th colspan='2'>ZBNf</th><th colspan='2'>Non ZBNf</th><th rowspan='2'>Survey No.</th></tr><tr>";
    result += "<th>Irrigated Land(in acres)</th><th>Rainfed Land(in acres)</th><th>Irrigated Land(in acres)</th><th>Rainfed Land(in acres)</th></tr></thead><tbody>";
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
    var path;
    if (habitationvalue == "harijanawada") {
        path = "../../static/json/harijanawada_farm.json";
    }
    else {
        path = "../../static/json/Naravaripalle_&_Colo.json";
    }
    $.getJSON(path, function (data) {
        var tableinfo = [];
        for (row in data) {
            if (data[row].id == farm.id) {
                tableinfo.push(data[row].land_type);
                tableinfo.push(data[row].total_extent);
                tableinfo.push(data[row].zbnf_irrigated);
                tableinfo.push(data[row].zbnf_rainfed);
                tableinfo.push(data[row].nonzbnf_irrigated);
                tableinfo.push(data[row].nonzbnf_rainfed);
                tableinfo.push(data[row].survey);
                tableinfo.push(data[row].Farmer_name);
                tableinfo.push(data[row].distance_house_farm);
                tableinfo.push(data[row].level);
                tableinfo.push(data[row].registered_season);
                tableinfo.push(data[row].registered_year);
                $('#myModal').modal();
            }
        }
        document.getElementById('farmdetails').innerHTML = "<p>Farmer Name : " + tableinfo[7] + "</p><br>" +
            "<p>Distance from home : " + tableinfo[8] + "</p><br>" + "<p>Level of Natural Farming : " + tableinfo[9] + "</p><br>"
            + "<p>Registeration : " + tableinfo[10] + "-" + tableinfo[11] + "</p><br>" + maketable(tableinfo);
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
                        var temp = temp = data[row].farmergps.split('-');
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(temp[0], temp[1]),
                            icon: house_icon,

                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, row) {
                            return function () {
                                infowindow.setContent('<img src="../../static/photos/farmer_' + data[row].FarmerImage + '">'
                                    + "<br><br>" + "<b>Name : </b>" + data[row].farmer_name + "<br><br>"
                                    + "<b>Farmer Category :</b> " + data[row].farmer_category + "<br><br>"
                                    + "<b>Mobile Number  :</b> " + data[row].mobile_number + "<br><br>"
                                    + "<b>Is having own land :</b> " + data[row].isHavingOwnLand);
                                infowindow.open(map, marker);
                            }
                        })(marker, row));
                        marker.setMap(map);
                    }
                }
            });
        }

        $.getJSON("../../static/json/lands.json", function (datas) {
            var polygon = [];
            for (i = 0; i < 46; i++) {
                polygon[i] = datas[i].GIS;
            }
            for (entry in polygon) {
                var temp = polygon[entry].split(',');
                // console.log(temp.length);
                for (gis in temp) {
                    var cord = temp[gis].split('^');
                    var lat = cord[0];
                    var temp1 = cord[1].split('#');
                    var lon = temp1[0];
                    // console.log("lat:", lat, " lon:", lon);
                }
            }
            // console.log(polygon.length);
        });

        if (checked) {
            $.getJSON("../../static/json/lands.json", function (datas) {
                // for (row in data) {
                //     if (data[row].registered_year >= Math.floor(document.getElementById("value").innerHTML)) {
                //         var path = [];
                //         for (rows in data[row].Farm.coordinates[0]) {
                //             path.push(new google.maps.LatLng(data[row].Farm.coordinates[0][rows][1], data[row].Farm.coordinates[0][rows][0]));
                //         }
                //     }
                //     var flightPath = new google.maps.Polygon({
                //         path: path,
                //         strokeColor: "#35ad35",
                //         strokeOpacity: 1,
                //         strokeWeight: 2,
                //         fillColor: "#35ad35",
                //         fillOpacity: 0.4,
                //     });
                //     flightPath.setMap(map);
                //     google.maps.event.addListener(flightPath, 'click', (function (marker, row) {
                //         return function () {
                //             showtable(data[row], selectvalue);
                //         }
                //     })(flightPath, row));
                // }
                // console.log("hello");
                for (row in data) {
                    // console.log(data[row].zbnf_date.substring(0,4));
                    if (data[row].zbnf_date.substring(0,4) >= Math.floor(document.getElementById("value").innerHTML) && data[row].habitation_name == selectvalue )
                    {
                        for (val in datas)
                        {
                            if (data[row].farmer_id == datas[val].farmer_id)
                            {
                                console.log(data[row].farmer_id);
                            }
                        }
                    }
                }
            });
        }
    });
}