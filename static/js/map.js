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
/*
$('#wellall').change(function()
{
    console.log("inside change");
    if( $('#wellall').prop("checked"))
    {
        showOverlays1();
    }
    else
    {
        clearOverlays1();
    }
});
*/
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
var hhmarker = [];
var fmarker = [];
var wmarker = [];
var map;
function setMap(position) {

    // The custom USGSOverlay object contains the USGS image,
    // the bounds of the image, and a reference to the map.

    var selectvalue = document.getElementById("habitation").value;
    console.log(selectvalue);

    var infowindow = new google.maps.InfoWindow();
    if (selectvalue=="harijanawada"){
        var myCenter = new google.maps.LatLng(13.6230336,79.2566625);
        var mapCanvas = document.getElementById("map");
        var mapOptions = {center: myCenter, zoom: 20, mapTypeId: 'satellite'};
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
                google.maps.event.addListener(marker, 'mouseover', (function(marker, row) {
                    return function() {
                        infowindow.setContent("<b>Name : </b>"+data[row].Farmer_name+ "<br><br>"+"<b>Is Land Registered :</b> "+data[row].is_land_registered+ "");
                        infowindow.open(map, marker);
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
                google.maps.event.addListener(marker, 'mouseover', (function(marker, row) {
                    return function() {
                        infowindow.setContent("<b>Name : </b>"+data[row].Farmer_name+ "<br><br>"+"<b>Is Land Registered :</b> "+data[row].is_land_registered+ "");
                        infowindow.open(map, marker);
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
            wmarker.push(marker);
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
    if (wmarker)
    {
        for( var i = 0, n = wmarker.length; i < n; ++i )
        {
            wmarker[i].setMap(null);
        }
    }
}

function showOverlays1()
{
    if (wmarker)
    {
        for( var i = 0, n = wmarker.length; i < n; ++i )
        {
            wmarker[i].setMap(map);
        }
    }
}