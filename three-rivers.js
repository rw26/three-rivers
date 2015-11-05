/* meteor app to grab and cache USGS water guage data and
 * serve it out for a realtime update to map and list.
 * Randy Wright 2015 
 */
var map;
var runtimer;
var runnum = 0;

var Gages = new Mongo.Collection( "Gages");
markerHash = new Array();

if (Meteor.isClient) {
        function displayWindowSize() {
               // size calculation code here
              myWidth = window.innerWidth; myHeight = window.innerHeight;
               // document.getElementById("dimensions").innerHTML = myWidth + "px wide, " + myHeight + "px tall";
             $('#map').css({width: (myWidth - 40)+'px', height: (myHeight - 10)+'px', 'padding-right':10+'px' });
        }
	window.onresize = displayWindowSize;
        window.onload = displayWindowSize;

    Template.body.helpers({
      gages: function () { 
        myGl =  Gages.find({}, {sort:{createdAt: -1}}); 
        return myGl;
      }
  });

Template.mapCont.rendered = function() { };
Template.gage.rendered = function () {
	// intial window sizing
  var w = window.innerWidth;
  var h = window.innerHeight;
  $('#map').css({width: w+'px', height: (h - 10)+'px'});
    if( map !== undefined) { return; }  
    map = L.map('map').setView([40.447, -79.952], 8);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);

      // args w = waterLevel, f = floodStage
    function getColor( w, f ) {
      val = w/f;
      if( val > 0.75 && val <= 1 ) {
        return "yellow";
      }
      if( val > 1 ) {
        return "red" ; 
      }
      return "green";    
    }

    Gages.find().fetch().forEach(function(site) {
        markerHash[site.siteCode] = new L.CircleMarker(L.latLng(site.lat, site.lng), {radius: 20,
            fillOpacity: 0.3, fillColor: getColor(site.waterLevel, site.floodStage), weight: 2, color: "black" }   );
        pcnt = ((site.waterLevel/site.floodStage) * 100 );
        markerHash[site.siteCode].bindPopup('<strong>' + site.siteName + '</strong><br />Level: ' + site.waterLevel + "ft, Flood: "+site.floodStage+"ft, "+parseInt(pcnt)+'%');
        markerHash[site.siteCode].addTo(map);
    });

    var myG = Gages.find({}, {sort:{createdAt: -1}});

    myG.observe({
      changed: function ( newdoc, olddoc ) {
        sid = newdoc.siteCode;
        frac = parseFloat(newdoc.waterLevel)/ parseFloat(newdoc.floodStage);
        if( frac > 0.75 && frac <= 1 ) {
          markerHash[sid].setStyle({fillColor: "yellow"} );
        } else {
          if( frac > 1 ) {
            markerHash[sid].setStyle({fillColor: "red"} );
          } else {
            markerHash[sid].setStyle({fillColor: "green"} );
          }
       }
       mkr = markerHash[sid];
       var pop = mkr._popup;
      pcnt = (newdoc.waterLevel/ newdoc.floodStage * 100);
       
       pop.setContent( '<strong>' + newdoc.siteName + '</strong><br />Level: ' + newdoc.waterLevel + "ft, Flood: "+newdoc.floodStage+"ft, "+parseInt(pcnt)+'%' );
      }
    });
       // return 0, 0 if the location isn't ready
//       console.log( "client:" + (Geolocation.latLng() || { lat: 0, lng: 0 }) )
     
};                         
L.Icon.Default.imagePath = 'packages/leaflet/images';
} //isClient

/*
if (Meteor.isCordova) {
Meteor.startup(function () {
    // start the geolocation
        navigator.geolocation.getCurrentPosition();
});  
  console.log("Printed only in mobile cordova apps");
}
*/
  
if (Meteor.isServer) {
  function doReq(n, slen) {
      reqNums =  ["03075070","03083500","03085152","03015310","03031500","03038000","03025500","03086000","03049500","03110690","03082500","03081000","03075000","03072655","03107500","03105500","03106500","03048500","03032500","03042280","03029500","03045000","03045010","03085500","03084800","03072000","03085000","03049819","03049800","03036500"];
      rObjs = [{"sno" : "03075070", "floodStage" : 20},{"sno" : "03083500", "floodStage" : 20},{"sno" : "03085152", "floodStage" : 25},{"sno" : "03015310", "floodStage" : 14},{"sno" : "03031500", "floodStage" : 20},{"sno" : "03038000", "floodStage" : 12.5},{"sno" : "03025500", "floodStage" : 17},{"sno" : "03086000", "floodStage" : 25},{"sno" : "03049500", "floodStage" : 21},{"sno" : "03110690", "floodStage" : 36},{"sno" : "03082500", "floodStage" : 12},{"sno" : "03081000", "floodStage" : 12},{"sno" : "03075000", "floodStage" : 28},{"sno" : "03072655", "floodStage" : 21},{"sno" : "03107500", "floodStage" : 15},{"sno" : "03105500", "floodStage" : 21},{"sno" : "03106500", "floodStage" : 9},{"sno" : "03048500", "floodStage" : 25},{"sno" : "03032500", "floodStage" : 17},{"sno" : "03042280", "floodStage" : 8},{"sno" : "03029500", "floodStage" : 13},{"sno" : "03045000", "floodStage" : 17},{"sno" : "03045010","floodStage" : 17},{"sno" : "03085500","floodStage" : 20},{"sno" : "03084800","floodStage" : 6},{"sno" : "03072000","floodStage" : 12},{"sno" : "03085000","floodStage" : 22},{"sno" : "03049819","floodStage" : 11},{"sno" : "03049800","floodStage" : 12},{"sno" : "03036500","floodStage" : 21}];
      if( slen != reqNums.length ) { slen = reqNums.length; }
      	//URL example: 'http://waterservices.usgs.gov/nwis/iv/?site='+'03049501'+'&format=json'
      reqStr = reqNums[n];
      reqFlood = rObjs[n].floodStage;  	
      reqURL = 'http://waterservices.usgs.gov/nwis/iv/?site='+reqStr+'&format=json';
      HTTP.get(reqURL, function (error, body, x) {
        if (!error )  {
          gg = EJSON.parse(body.content);
          m = 0;
          for( i = 0 ; i < gg.value.timeSeries.length; i++) {
            if( gg.value.timeSeries[i].variable.variableCode[0].value == "00065" ) {
             m = i;
             break;
            }
          }
          myCode = '"'+gg.value.timeSeries[m].sourceInfo.siteCode[0].value+'"';
          Gages.update( 
            { "siteCode": myCode },
            {$set : {
              "siteCode": myCode,
              "siteName" : gg.value.timeSeries[m].sourceInfo.siteName,
              "waterLevel": parseFloat(gg.value.timeSeries[m].values[0].value[0].value ),
              "floodStage": reqFlood,
              "lat": gg.value.timeSeries[m].sourceInfo.geoLocation.geogLocation.latitude,
              "lng": gg.value.timeSeries[m].sourceInfo.geoLocation.geogLocation.longitude
              }},
            {upsert: true}
          );
        n++;    
        if( n == slen ) {
      	return;
        }
          doReq( n, slen);
          return;
        } else { console.log( "error for "+ reqStr ); } // !if error
      }); //request  
    }//doReq
  function startRec() {
    runnum++;
    doReq(0,0);
  }  
  Meteor.startup(function () {
    doReq(0,0);    
    runtimer = Meteor.setInterval( startRec, 600000 );
  });
} // isServer
