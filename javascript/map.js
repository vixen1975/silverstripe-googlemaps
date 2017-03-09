var map;
var urlSuffix = (new Date).getTime().toString();
var siteurl = 'http://rr.perthwebdev.com.au/assets';
var path = siteurl + '/xml-files/';
var start_zoom = $("#start_zoom").val(); 
var start_lat = $('#start_lat').val();
var start_long = $('#start_long').val();
var marker_icon = $('#marker_icon').val();
var colour = $('#map_scheme').val();
var marker_file = $('#marker_file').val();

function downloadUrl(url, callback) { 
  var request = window.ActiveXObject ?
	  new ActiveXObject('Microsoft.XMLHTTP') :
	  new XMLHttpRequest;
 
  request.onreadystatechange = function() { 
    if (request.readyState == 4) { 
      request.onreadystatechange = doNothing; 
      callback(request, request.status); 
    }
    
  };
  request.open('GET', url, true);
  request.send(null);   
}

function doNothing() {}

function markerLocations(map){ 
	var fileurl = path + marker_file; 
	downloadUrl(fileurl, function(data) { 
	    var xml = data.responseXML; 
      var markerlist = xml.getElementsByTagName("marker"); 
		  var array = [];
      
    for(i = 0; i < markerlist.length; ++i){ 
			var lat = parseFloat(markerlist[i].getAttribute("lat")); 
			var lng = parseFloat(markerlist[i].getAttribute("lng"));
			var location = { lat: lat, lng: lng };
			var title = markerlist[i].getAttribute("title");
			var content = markerlist[i].getAttribute("content");
			var img_url = markerlist[i].getAttribute("img_url");
      var img = '';
      if(img_url != ''){
        img = '<img src="'+ img_url + '" class="ssgm-infobox-img" width="250" />';
      }
			var box_content = '<div class="ssgm-infobox"><h3>' + title + '</h3><p>' + content + '</p>' + img + '</div>';
			addMarker(location, map, marker_icon, box_content,0);
     }
	});
	
}

function addMarker(location, map, imgurl, content, display) { 
  // Add the marker at the clicked location, and add the next-available label
	
	var image = {
		url: imgurl,
		size: new google.maps.Size(40, 40),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 20)
	};
	var marker = new google.maps.Marker({
	  position: location,
	  label: '',
	  map: map,
	  icon: image
	});
	
	var infowindow = new google.maps.InfoWindow({
		  content: content
	});
  if(display === 1){
    if( prev_infowindow ) {
         prev_infowindow.close();
    }
    infowindow.open(map, marker);
  } 
  prev_infowindow = infowindow;
	marker.addListener('click', function() {
   if( prev_infowindow ) {
         prev_infowindow.close();
    }
  infowindow.open(map, marker);	  
    
  });
}

/**
* Get the appropriate colour scheme of the map
*/
function mapScheme(colour){
  var style = '';
  if(colour == 'Colourful'){
    style = [{"featureType":"water","elementType":"all","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#83cead"},{"saturation":1},{"lightness":-15},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#f3f4f4"},{"saturation":-84},{"lightness":59},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-35},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-22},{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"hue":"#d7e4e4"},{"saturation":-60},{"lightness":23},{"visibility":"on"}]}];
  }
  if(colour == 'Dark'){
    style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
  }
  if(colour == 'Light'){
    style = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
  }
  return style;
}

/**
 * Initializes the map and calls the function that adds the markers.
 */
function initMap() {
  var map_style = mapScheme(colour); 
  if(map_style == ''){
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(start_lat, start_long),
      zoom: parseInt(start_zoom),
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });
  } else {
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(start_lat, start_long),
      zoom: parseInt(start_zoom),
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: map_style
    });
  }
  
   markerLocations(map);
  
}// JavaScript Document