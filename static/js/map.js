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
            + "<p>Registeration : "+tableinfo[10]+"-"+tableinfo[11]+"</p><br>" + maketable(tableinfo);
    });
}

var map;
function setMap(position) {

    // The custom USGSOverlay object contains the USGS image,
    // the bounds of the image, and a reference to the map.

    var selectvalue = document.getElementById("habitation").value;

    var infowindow = new google.maps.InfoWindow();
    if (selectvalue == "harijanawada") {
        var myCenter = new google.maps.LatLng(13.6220036, 79.2597805);
        var mapCanvas = document.getElementById("map");
        var mapOptions = { center: myCenter, zoom: 17, mapTypeId: 'satellite' };
        map = new google.maps.Map(mapCanvas, mapOptions);

        if (hchecked) {
            $.getJSON("../../static/json/harijanawada.json", function (data) {
                var marker
                var house_icon = {
                    url: "../../static/img/yellow_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[row].Location.coordinates[1], data[row].Location.coordinates[0]),
                        icon: house_icon,

                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, row) {
                        return function () {
                            infowindow.setContent('<img src="../../static/img/harijanawada/' + data[row].image + '">' + "<br><br>"
                                + "<b>Name : </b>" + data[row].Farmer_name + "<br><br>" + "<b>Is Land Registered :</b> "
                                + data[row].is_land_registered + "");
                            infowindow.open(map, marker);
                        }
                    })(marker, row));
                    marker.setMap(map);
                }
            });
        }
        if (fchecked) {
            $.getJSON("../../static/json/harijanawada_farm.json", function (data) {
                var marker
                var house_icon = {
                    url: "../../static/img/orange_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[row].Plot.coordinates[1], data[row].Plot.coordinates[0]),
                        icon: house_icon,

                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, row) {
                        return function () {
                            showtable(data[row], selectvalue);
                        }
                    })(marker, row));
                    marker.setMap(map);
                }
            });
        }
        if (checked) {
            $.getJSON("../../static/json/harijanawada_farm.json", function (data) {
                for (row in data) {
                    if (data[row].registered_year >= document.getElementById("value").innerHTML) {
                        var path = []
                        for (rows in data[row].Farm.coordinates[0]) {
                            path.push(new google.maps.LatLng(data[row].Farm.coordinates[0][rows][1], data[row].Farm.coordinates[0][rows][0]));
                        }

                        if (data[row].level == 1) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#f4f442",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#f4f442",
                                fillOpacity: 0.4,
                            });
                        }
                        else if (data[row].level == 2) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#bef441",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#bef441",
                                fillOpacity: 0.4,
                            });
                        }
                        else if (data[row].level == 3) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#35ad35",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#35ad35",
                                fillOpacity: 0.4,
                            });
                        }
                        else {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#158415",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#158415",
                                fillOpacity: 0.4,
                            });
                        }
                        flightPath.setMap(map);
                        google.maps.event.addListener(flightPath, 'click', (function (marker, row) {
                            return function () {
                                showtable(data[row], selectvalue);
                            }
                        })(flightPath, row));
                    }
                }
            });
        }
    }
    else {
        var myCenter = new google.maps.LatLng(13.62401089, 79.26396567);
        var mapCanvas = document.getElementById("map");
        var mapOptions = { center: myCenter, zoom: 17, mapTypeId: 'satellite' };
        map = new google.maps.Map(mapCanvas, mapOptions);
        if (hchecked) {
            $.getJSON("../../static/json/Naravaripalle_&_Colo.json", function (data) {
                var marker
                var house_icon = {
                    url: "../../static/img/yellow_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[row].Location.coordinates[1], data[row].Location.coordinates[0]),
                        icon: house_icon,

                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, row) {
                        return function () {
                            infowindow.setContent('<img src="../../static/img/naravaripalle/' + data[row].image + '">' + "<br><br>"
                                + "<b>Name : </b>" + data[row].Farmer_name + "<br><br>" + "<b>Is Land Registered :</b> "
                                + data[row].is_land_registered + "");
                            infowindow.open(map, marker);
                        }
                    })(marker, row));
                    marker.setMap(map);
                }
            });
        }
        if (fchecked) {
            $.getJSON("../../static/json/Naravaripalle_&_Colo.json", function (data) {
                var marker
                var house_icon = {
                    url: "../../static/img/orange_marker.png",
                    scaledSize: new google.maps.Size(15, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                };
                for (row in data) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[row].Plot.coordinates[1], data[row].Plot.coordinates[0]),
                        icon: house_icon,

                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, row) {
                        return function () {
                            showtable(data[row], selectvalue);
                        }
                    })(marker, row));
                    marker.setMap(map);
                }
            });
        }
        if (checked) {
            $.getJSON("../../static/json/Naravaripalle_&_Colo.json", function (data) {
                for (row in data) {
                    if (data[row].registered_year >= document.getElementById("value").innerHTML) {
                        var path = []
                        for (rows in data[row].Farm.coordinates[0]) {
                            path.push(new google.maps.LatLng(data[row].Farm.coordinates[0][rows][1], data[row].Farm.coordinates[0][rows][0]));
                        }

                        if (data[row].level == 1) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#f4f442",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#f4f442",
                                fillOpacity: 0.4,
                            });
                        }
                        else if (data[row].level == 2) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#bef441",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#bef441",
                                fillOpacity: 0.4,
                            });
                        }
                        else if (data[row].level == 3) {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#35ad35",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#35ad35",
                                fillOpacity: 0.4,
                            });
                        }
                        else {
                            var flightPath = new google.maps.Polygon({
                                path: path,
                                strokeColor: "#158415",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#158415",
                                fillOpacity: 0.4,
                            });
                        }
                        flightPath.setMap(map);
                        google.maps.event.addListener(flightPath, 'click', (function (marker, row) {
                            return function () {
                                showtable(data[row], selectvalue);
                            }
                        })(flightPath, row));
                    }
                }
            });
        }
    }
}