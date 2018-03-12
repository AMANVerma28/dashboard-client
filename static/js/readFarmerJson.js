function setDropdown1FarmerJson(){
    $.getJSON("../../static/json/farmers.json", function (data) {
        var textSet = "";
        var clusterArray = [];
        dataLength = data.length;
        for( i = 0; i< dataLength; i++){
            if ( clusterArray.indexOf(data[i].cluster_name) == -1 ){
                clusterArray.push(data[i].cluster_name);
            }
        }
        clusterArrayLength = clusterArray.length;
        for( i = 0; i< clusterArrayLength; i++){
            textSet = textSet + "<option value=\""+clusterArray[i]+"\">"+clusterArray[i]+"</option>";
        }
        document.getElementById("cluster").innerHTML = textSet;
   });
}

function setDropdown2FarmerJson(varClusterName){
    $.getJSON("../../static/json/farmers.json", function (data) {
        var textSet = "";
        var villageArray = [];
        dataLength = data.length;
        for( i = 0; i< dataLength; i++){
            if ( villageArray.indexOf(data[i].village_name) == -1 && data[i].cluster_name == varClusterName){
                villageArray.push(data[i].village_name);
            } 
        }
        villageArrayLength = villageArray.length;
        for( i = 0; i< villageArrayLength; i++){
            textSet = textSet + "<option value=\""+villageArray[i]+"\">"+villageArray[i]+"</option>";
        }
        document.getElementById("village").innerHTML = textSet;
       
   });
}

function setDropdown3FarmerJson(varClusterName, varVillageName){
    $.getJSON("../../static/json/farmers.json", function (data) {
        var textSet = "";
        var habitationArray = [];
        dataLength = data.length;
        for( i = 0; i< dataLength; i++){
            if ( habitationArray.indexOf(data[i].habitation_name) == -1 && data[i].cluster_name == varClusterName && data[i].village_name == varVillageName ){
                habitationArray.push(data[i].habitation_name);
            }
        }
        habitationArrayLength = habitationArray.length;
        for( i = 0; i< habitationArrayLength; i++){
            textSet = textSet + "<option value=\""+habitationArray[i]+"\">"+habitationArray[i]+"</option>";
        }
        document.getElementById("habitation").innerHTML = textSet;
       
   });
}

function initialize(){
    setDropdown1FarmerJson();
}

function getClusterValue(){
    var selectBox = document.getElementById("cluster");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    setDropdown2FarmerJson(selectedValue);
}

function getVillageValue(){
    var selectBox = document.getElementById("cluster");
    var selectedValue1 = selectBox.options[selectBox.selectedIndex].value;
    selectBox = document.getElementById("village");
    var selectedValue2 = selectBox.options[selectBox.selectedIndex].value;
    setDropdown3FarmerJson(selectedValue1, selectedValue2);
}