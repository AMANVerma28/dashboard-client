$( document ).ready(  function(){
google.charts.load('current', {'packages':['corechart']});
     google.charts.setOnLoadCallback(hi);
});

$('#householdall').change(function()
{
    console.log("inside change");
    if( $('#householdall').prop("checked"))
    {
        showOverlays();
    }
    else
    {
        clearOverlays();
    }
});

$('#habitation').change(function()
{
    setMap();
});

$('#farmall').change(function()
{
    console.log("inside change");
    if( $('#farmall').prop("checked"))
    {
        showOverlays1();
    }
    else
    {
        clearOverlays1();
    }
});

function drawChart(data) {
    var data = google.visualization.arrayToDataTable(data);
    var options = {
        width: 400,
        height: 240,  
        title: 'area percentage of crops',
        is3D: true,
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    google.visualization.events.addListener(chart, 'click', function () {
        chart.clearChart()
    });
    chart.draw(data, options);
}

function makeTableHTML(myArray,array) {
    var result = "<table class='table'>";
    result += "<thead><tr><th>Crop</th><th>Yield</th></tr></thead><tbody>";

    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        result += "<td>"+myArray[i]+"</td>";
        result += "<td>"+array[i]+"</td>";
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

function hello(farm,households){
    $.getJSON( "../../static/json/members.json", function( data ) {
        for(row in data)
        {

            if(data[row].HouseHold==households && data[row].Relation=="head")
            {
                var owner=data[row].Name
            } 
        }

        $.getJSON( "../../static/json/crops.json", function( data ) {
            var crop=[]
            var yield=[]
            for(row in data)
            {

                if(data[row].Farm==farm.id && data[row].Season==document. getElementById("season").value &&data[row].DateTime.substring(4,-1)==document.getElementById("value").innerHTML)
                {
                    crop.push(data[row].Crop )
                    yield.push(data[row].Yield)
                }
            }
            document.getElementById('farmdetails').innerHTML="<p><b>owner</b> : "+owner+"</p><br><p><b>Totalarea </b>: "+farm.TotalArea+" hectors</p><br>"+makeTableHTML(crop,yield)
        });
    });
}

function hi(farm){
    if(farm)
    {
        $('#myModal').modal();
        $.getJSON( "../../static/json/crops.json", function( data ) {
            var piedata=[["crop","extent"]]
            for (row in data)
            {
                var temp=[]
                if(data[row].Farm==farm &&data[row].Season==document. getElementById("season").value &&data[row].DateTime.substring(4,-1)==document. getElementById("value").innerHTML )
                {
                    temp.push(data[row].Crop)
                    temp.push(data[row].Extent)
                    piedata.push(temp)
                }  
            }
            drawChart(piedata)
        });
    }
}

function maketable(array){
    var result = "<table class='table'>";
    result += "<thead><tr>Land Info</tr><tr><th rowspan='2'>Is Own/Leased</th><th rowspan='2'>Total Extent(in acres)</th>";
    result += "<th colspan='2'>ZBNf</th><th colspan='2'>Non ZBNf</th><th rowspan='2'>Survey No.</th></tr><tr>";
    result += "<th>Irrigated Land(in acres)</th><th>Rainfed Land(in acres)</th><th>Irrigated Land(in acres)</th><th>Rainfed Land(in acres)</th></tr></thead><tbody>";
    result += "<tr>";
    result += "<td>"+array[0]+"</td>";
    result += "<td>"+array[1]+"</td>";
    result += "<td>"+array[2]+"</td>";
    result += "<td>"+array[3]+"</td>";
    result += "<td>"+array[4]+"</td>";
    result += "<td>"+array[5]+"</td>";
    result += "<td>"+array[6]+"</td>";
    result += "</tr>";
    result += "</tbody></table>";
    return result;
}

function showtable(farm,habitationvalue){
    var path;
    if (habitationvalue=="harijanawada")
    {
        path = "../../static/json/harijanawada_farm.json";
    }
    else
    {
        path = "../../static/json/Naravaripalle_&_Colo.json";
    }
    $.getJSON( path, function( data ) {
        var tableinfo = [];
        for(row in data)
        {
            if(data[row].id==farm.id)
            {
                tableinfo.push(data[row].land_type);
                tableinfo.push(data[row].total_extent);
                tableinfo.push(data[row].zbnf_irrigated);
                tableinfo.push(data[row].zbnf_rainfed);
                tableinfo.push(data[row].nonzbnf_irrigated);
                tableinfo.push(data[row].nonzbnf_rainfed);
                tableinfo.push(data[row].survey);
                tableinfo.push(data[row].Farmer_name);
                tableinfo.push(data[row].distance_house_farm);
                console.log(data[row].distance_house_farm);
                $('#myModal').modal();
            }
        }
        document.getElementById('farmdetails').innerHTML="<p>Farmer Name : "+tableinfo[7]+"</p><br>"+
                "<p>Distance from home : "+tableinfo[8]+"</p><br>"+maketable(tableinfo);
    });
}

var hhmarker = [];
var fmarker = [];
var map;
function setMap(position) {

    // The custom USGSOverlay object contains the USGS image,
    // the bounds of the image, and a reference to the map.

    var selectvalue = document.getElementById("habitation").value;

    var infowindow = new google.maps.InfoWindow();
    if (selectvalue=="harijanawada"){
        var myCenter = new google.maps.LatLng(13.6230336,79.2566625);
        var mapCanvas = document.getElementById("map");
        var mapOptions = {center: myCenter, zoom: 17, mapTypeId: 'satellite'};
        map = new google.maps.Map(mapCanvas, mapOptions);
    
        $.getJSON( "../../static/json/harijanawada.json", function( data ) {
            var marker
            var house_icon = {
                url:"../../static/img/yellow_marker.png", 
                scaledSize: new google.maps.Size(15, 30), 
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0)
            };
            for (row in data)
            { 
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[row].Location.coordinates[1], data[row].Location.coordinates[0]),
                    icon:house_icon,
                    
                });
                hhmarker.push(marker);
                google.maps.event.addListener(marker, 'click', (function(marker, row) {
                    return function() {
                        infowindow.setContent('<img src="../../static/img/harijanawada/'+data[row].image+'">'+"<br><br>"+"<b>Name : </b>"+data[row].Farmer_name+ "<br><br>"+"<b>Is Land Registered :</b> "+data[row].is_land_registered+ "");
                        infowindow.open(map, marker);
                    }
                })(marker, row));
                marker.setMap(map);
            }
        });

        $.getJSON( "../../static/json/harijanawada_farm.json", function( data ) {
            var marker
            var farm_icon = {
                url:"../../static/img/orange_marker.png", 
                scaledSize: new google.maps.Size(15, 30), 
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0)
            };
            for (row in data)
            {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[row].Plot.coordinates[1], data[row].Plot.coordinates[0]),
                    icon:farm_icon,                    
                });
                fmarker.push(marker);
                google.maps.event.addListener(marker, 'click', (function(marker, row) {
                    return function() {
                        showtable(data[row],selectvalue);
                    }
                })(marker, row));
                marker.setMap(map);
            }
        });
    }
    else
    {
        var myCenter = new google.maps.LatLng(13.62401089,79.26396567);
        var mapCanvas = document.getElementById("map");
        var mapOptions = {center: myCenter, zoom: 17, mapTypeId: 'satellite'};
        map = new google.maps.Map(mapCanvas, mapOptions);
        $.getJSON( "../../static/json/Naravaripalle_&_Colo.json", function( data ) {
            var marker
            var house_icon = {
                url:"../../static/img/yellow_marker.png", 
                scaledSize: new google.maps.Size(15, 30), 
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0)
            };
            for (row in data)
            { 
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[row].Location.coordinates[1], data[row].Location.coordinates[0]),
                    icon:house_icon,
                    
                });
                hhmarker.push(marker);
                google.maps.event.addListener(marker, 'click', (function(marker, row) {
                    return function() {
                        infowindow.setContent('<img src="../../static/img/naravaripalle/'+data[row].image+'">'+"<br><br>"+"<b>Name : </b>"+data[row].Farmer_name+ "<br><br>"+"<b>Is Land Registered :</b> "+data[row].is_land_registered+ "");
                        infowindow.open(map, marker);
                    }
                })(marker, row));
                marker.setMap(map);
            }
        });
        $.getJSON( "../../static/json/Naravaripalle_&_Colo.json", function( data ) {
            var marker
            var farm_icon = {
                url:"../../static/img/orange_marker.png", 
                scaledSize: new google.maps.Size(15, 30), 
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0)
            };
            for (row in data)
            {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[row].Plot.coordinates[1], data[row].Plot.coordinates[0]),
                    icon:farm_icon,                    
                });
                fmarker.push(marker);
                google.maps.event.addListener(marker, 'click', (function(marker, row) {
                    return function() {
                        showtable(data[row],selectvalue);
                    }
                })(marker, row));
                marker.setMap(map);
            }
        });
    }

/*
    $.getJSON( "../../static/json/wells.json", function( data ) {
        var marker
        var well_icon = {
            url:"../../static/img/well.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        for (row in data)
        {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(data[row].Location.coordinates[1], data[row].Location.coordinates[0]),
                map: map,
                icon:well_icon,
                
            });
            fmarker.push(marker);
            google.maps.event.addListener(marker, 'mouseover', (function(marker,row) {
                return function() {
                    infowindow.setContent("<b>Depth : </b>"+data[row].Depth+"<br> <br>"+" <b>Yield :</b> "+ data[row].Average_yield);
                    infowindow.open(map, marker);
                }
            })(marker, row));
            marker.setMap(map);
        }
    });*/
/*
    $.getJSON( "../../static/json/farms.json", function( data ) {
        for (row in data)
        { 
            var path=[]
            for (rows in data[row].Location.coordinates[0])  
            {
                path.push(new google.maps.LatLng(data[row].Location.coordinates[0][rows][1],data[row].Location.coordinates[0][rows][0]))
            }

            var flightPath = new google.maps.Polygon({
                path: path,
                strokeColor: "green",
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: "green",
                fillOpacity: 0.4,
            });

            flightPath.setMap(map);
            google.maps.event.addListener(flightPath, 'click', (function(marker,row) {
                return function() {
                    hi(data[row].id)
                    hello(data[row],data[row].HouseHold)
                }
            })(flightPath, row));
        }
    });*/
}

function clearOverlays()
{
    if (hhmarker)
    {
        for( var i = 0, n = hhmarker.length; i < n; ++i )
        {
            hhmarker[i].setMap(null);
        }
    }
}

function showOverlays()
{
    if (hhmarker)
    {
        for( var i = 0, n = hhmarker.length; i < n; ++i )
        {
            hhmarker[i].setMap(map);
        }
    }
}

function clearOverlays1()
{
    if (fmarker)
    {
        for( var i = 0, n = fmarker.length; i < n; ++i )
        {
            fmarker[i].setMap(null);
        }
    }
}

function showOverlays1()
{
    if (fmarker)
    {
        for( var i = 0, n = fmarker.length; i < n; ++i )
        {
            fmarker[i].setMap(map);
        }
    }
}