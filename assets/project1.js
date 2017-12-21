
// stores data from hiking project
// data comes from getTrails()
var trails = {};

// stores searched location data
// data comes from geocode()
// geolocate() data used if available
var geoData = {};

// locations of top rated trails
// used as placeholders on page load
var placeholder = [
	{lat: 37.2928, lng: -113.0081},
	{lat: 40.2340, lng: -105.6419},
	{lat: 40.3710, lng: -105.6419},
];

var mapLat = 37.2928;
var mapLng = -113.0081;
// needed for initAutocomplete
// some things do not work if not global
var placeSearch;
var componentForm = { };


// Get user name and location
$(document).ready(function() {
	console.log("document.ready");

	showRandom();

	geolocate();

	$("#address-submit").on("click", function() {

		var address = $("#address-input").val().trim();
		geocode(address);
	});

	$(".search-results").on("click", "img", showDetails);

	$("body").on("click", ".directionButtonClass", function(event) {
		//var spefLat = $(this).attr("data-lat");
		//var spefLng = $(this).attr("data-lng");
		var spefName = $('#trail-name').text();

		

		var url = "https://www.google.com/maps/dir/?api=1";
		//var origin = "&origin=" + tempLatitude + "," + tempLongitude;
		var destination = "&destination=" + spefName;
		var newUrl = new URL(url  + destination);

		window.open(newUrl , "_blank");
	});
});



// Google Maps API
// executes upon search submit
// gets lat, lng, place_id
// sends results to getTrails()
function geocode(address) {
	event.preventDefault();

	console.log("geocode: " + address);

	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=";

	queryURL += keyMaps + "&address=" + address;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		var status = response.status;
		if (status === "OK") {

			var resultRef = response.results[0];
			var place_id = resultRef.place_id;
			var formatted_address = resultRef.formatted_address;

			var locationRef = resultRef.geometry.location;
			var lat = locationRef.lat;
			var lng = locationRef.lng;

			geoData = {
				"lat": lat,
				"lng": lng,
				"place_id": place_id,
				"address": formatted_address
			};

			getTrails(lat, lng);
			iNaturalist(lat, lng);

		} else {
			alert('Geocode unsuccessful.');
		}
	});

	//May want to validate response somehow later
}

// executes upon page load
// shows random place results
function showRandom() {
	console.log("showRandom");

	var rand = Math.floor(Math.random()*placeholder.length);
	var lat = placeholder[rand].lat;
	var lng = placeholder[rand].lng;

	getTrails(lat, lng);
	iNaturalist(lat, lng);
}

// executes when result img clicked
// generates details card HTML
function showDetails() {
	console.log("showDetails");

	console.log()

	window.scrollTo(0, 160);

	var mapLat = $(this).data("map-lat");
	var mapLng = $(this).data("map-lng");
	map.flyTo({
		center: [mapLng, mapLat]
	});

	var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + mapLat + "&lon=" + mapLng + "&units=imperial&appid=" + keyWeather;
	
	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		console.log(response)
		$("#currentTempId").html(response.main.temp + "°F,  " + response.weather[0].description)
		//$("#tempSummaryId").html(response.weather[0].description)
	});


	var index = $(this).data("index");

	var self = $(this);

	
	$.each(trails[index], function populate(key, value) {

		if ( $(`#trail-${key}`) ) {
			$(`#trail-${key}`).text(value);
		}

		if ( ($(`#trail-${key}`)) && (key.startsWith("length")) ){
			$(`#trail-${key}`).prepend("Length: ");
			$(`#trail-${key}`).append(" mi");
		}

		// if ( ($(`#trail-${key}`)) && (key.startsWith("img")) ) {

		// 	var source = $(`#trail-${key}`).attr("src");

		// 	if (!(source === "")) {

		// 		$(`#trail-${key}`).attr("src", value);

		// 	} else if (source === "") {

		// 		$(`#trail-${key}`).attr("src", randomImages);
		// 	}
		// }

		$("#trail-imgMedium").attr("src", self.attr("src"))

		var imageSource = $(this).attr("src")

		if 	($("#trail-difficulty").text() === "green") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffGreen30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Easier</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "greenBlue") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffGreenBlue30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Easier/Moderate</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "blue") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlue30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Moderate</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "blueBlack") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlueBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Moderate/Hard</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "black") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Hard</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "dblack") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Hard</h5></span>');
		}

		
	});

	$("#directionButtonCard").html("<button class= directionButtonClass>Get Directions</button")

	$("#favoriteButtonCard").html("<button class= favorite-button>Favorite</button>")

}

// Firebase database
	// Initialize Firebase
	var config = {
	    apiKey: "AIzaSyDgCGQByTB-VEChXM6Dssa_Xir_EcGJHJA",
	    authDomain: "class-project-trails-api.firebaseapp.com",
	    databaseURL: "https://class-project-trails-api.firebaseio.com",
	    projectId: "class-project-trails-api",
	    storageBucket: "class-project-trails-api.appspot.com",
	    messagingSenderId: "334324080267"
	};

	if (firebase.apps.length === 0){
	firebase.initializeApp(config);
	}

	// Get a reference to the database service
	var database = firebase.database();


// saves clicked item to favorites
// pushes to Firebase
function saveToFavorites(event) {

    event.preventDefault();

    var i = $(this).data('index');
    var favoriteHike = trails[i].name;
    var url = trails[i].url;

    var newFavTrail = {
      name: favoriteHike,
      site: url
    };

    database.ref().push(newFavTrail);
};

// refreshes our HTML list based on added or deleted data
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += "<li data-key=" + list[i].key + ">" + "<a href=" + list[i].url + ">" + list[i].name + "</a>" + " " + '[' + genLinks(list[i].key, list[i].name) + ']' + '</li>';
    };
    document.getElementById('favorite-list').innerHTML = lis;
};

// generates our delete link as our favorites are saved
function genLinks(key, name) {
    var links = '';
    links += '<a href="javascript:del(\'' + key + '\',\'' + name + '\')">Delete</a>';
    return links;
};

// delete function which calls the database through buildEndPoint and deletes the items from our list
function del(key, name) {
        var deleteFavorites = buildEndPoint(key);
        deleteFavorites.remove();
    }

// returning our most up to date database
function buildEndPoint (key) {
	return database.ref(`/${key}`) ;
}

// taking our database and populating info on initial load as well as any other updates
database.ref().on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            url = data[key].site;
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key,
                    url: url

                })
            }
        }
    }
// calling our refreshUI on our most up to date list to HTML
    refreshUI(list);
});


// REI Hiking Project API
// source of hiking trail data
function getTrails(lat, lng) {
	console.log("getTrails of " + lat + ", " + lng);

	var queryURL = "https://www.hikingproject.com/data/get-trails?key=";

	queryURL += keyTrails + "&lat=" + lat + "&lon=" + lng + "maxDistance=10";

	var milesRadius = "&maxDistance=10";

	var sourceSelect = $("#source");

	if(sourceSelect.val() === "10 Miles" ) {
    		milesRadius = "&maxDistance=10";
    }

    if(sourceSelect.val() === "20 Miles" ) {
    		milesRadius = "&maxDistance=20";
    }

    if(sourceSelect.val() === "30 Miles" ) {
    		milesRadius = "&maxDistance=30";
    }

	if(sourceSelect.val() === "40 Miles" ) {
    		milesRadius = "&maxDistance=40";
    }

	if(sourceSelect.val() === "50 Miles" ) {
    		milesRadius = "&maxDistance=50";
    }

	if(sourceSelect.val() === "60 Miles" ) {
    		milesRadius = "&maxDistance=60";
    }

	if(sourceSelect.val() === "70 Miles" ) {
    		milesRadius = "&maxDistance=70";
    }

	if(sourceSelect.val() === "80 Miles" ) {
    		milesRadius = "&maxDistance=80";
    }

	if(sourceSelect.val() === "90 Miles" ) {
    		milesRadius = "&maxDistance=90";
    }

	if(sourceSelect.val() === "100 Miles" ) {
    		milesRadius = "&maxDistance=100";
    }

	queryURL += keyTrails + "&lat=" + lat + "&lon=" + lng + milesRadius + "&maxResults=50//";

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		var status = response.success;
		if (status === 1) {

			trails = response.trails;

			setLocalStorage("trails", trails);

			renderCards();

		} else {
			alert("Trails query unsuccessful.");
		}
	});

	//May want to validate response somehow later
}

// generates dynamic HTML from results
// fills in placeholder if img not available
function renderCards() {
	console.log("renderCards");

	$("#resultList").empty();

	for (i = 0; i < trails.length; i++) {

		var card = $("<div>");
		var image = $("<img>");
		var nameDiv = $('<div class="name">');
		var lengthDiv = $('<div class="length">');
		var difficultyDiv = $('<div class="difficulty">');
		var directionButton= $("<button>");
		var favoriteButton = $("<button>");


		card.addClass("imgDiv col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3");
		image.attr("src", trails[i].imgMedium);
		image.attr("alt", trails[i].name);

		image.data("index", i);
		nameDiv.text(trails[i].name);
		lengthDiv.text(trails[i].length + " mi");
		difficultyDiv.text(trails[i].difficulty);
		directionButton.text("Get Directions");
		directionButton.addClass("directionButtonClass");
		directionButton.attr("data-lat", trails[i].latitude);
		directionButton.attr("data-lng", trails[i].longitude);
		directionButton.attr("data-name", trails[i].name);
		favoriteButton.text("Favorite");
		favoriteButton.addClass("favorite-button");
		favoriteButton.data("index", i);
		favoriteButton.on('click', saveToFavorites);

		image.data("map-lat", trails[i].latitude);
		image.data("map-lng", trails[i].longitude);


		if (image.attr("src") === "") {

			var imagesArray = ["http://www.visitbitterrootvalley.com/wp-content/uploads/2014/10/hiking-pano-bear-creek.jpg", "https://advguides.com/wp-content/uploads/2013/07/linville-falls-2-1024x682-1024x682.jpg", "http://images.summitpost.org/original/617474.jpg", "http://www.pilotcove.com/wp-content/uploads/2016/11/Pilot-Cove-Forest-Lodging-Hiking-Trails-36-1030x711.jpg?x62798", "https://i.wnc.io/s1024/2011-05-15_grandfather-mountain-state-park_profile-trail-slope-big-tree.jpg", "https://i.pinimg.com/originals/25/09/19/250919e4332fc177f7d41126e355b5d9.jpg", "https://www.apartments.com/images/default-source/images-for-renters-blog/nc_hiking.tmb-featuredim.jpg?sfvrsn=12e9b6a1_2", "https://www.carolinabeach.org/Flytrap_trail.jpg", "https://media-cdn.tripadvisor.com/media/photo-s/08/f2/55/23/hiking-trails-in-great.jpg", "http://www.carolinaparent.com/Hemlock%20Bluffs%20Boardwalk-credit%20Bill%20Stice.jpg", "https://media.deseretdigital.com/file/01026f0183?crop=top:0|left:0|width:1260|height:670|gravity:Center&quality=55&interlace=none&resize=width:1260&order=resize,crop&c=14&a=e0f131f0", "http://www.looklocalmagazine.com/wp-content/uploads/2015/04/Fall-hike-trail.jpg", "https://www.nycgovparks.org/pagefiles/78/fall-hiking-inwood-hill-park-trail-lg.jpg", "https://res.cloudinary.com/simpleview/image/fetch/f_auto,q_60/https://res.cloudinary.com/simpleview/image/upload/crm/poconos/MCL-trail-63a5201ede94569_63a52364-9107-a096-7b2506f93e690acb.jpg", "http://www.hikingheels.com/wp-content/uploads/2008/11/img_7160.jpg", "https://www.michiganhousesonline.com/wp-content/uploads/2017/06/Hike-Trails.jpg", "http://www.visitflorida.com/content/dam/visitflorida/en-us/images/slideshow/001/1326050111-vfklappphipps062011-ch08.jpg.1280.500.rendition", "https://cdn.vox-cdn.com/thumbor/0cPaA_F46yJrjsae95bSZ-UICQ0=/0x0:4256x2832/1200x900/filters:focal(1788x1076:2468x1756)/cdn.vox-cdn.com/uploads/chorus_image/image/57008903/shutterstock_674841745.1507172062.jpg", "http://michaellamarr.com/wwpoetry17/Serena/HikingTrail_t640.jpg", "https://cdn.vox-cdn.com/thumbor/3GfqqTQCASAiLqLRTC2PlYcccP8=/0x0:4000x3000/1200x900/filters:focal(1680x1180:2320x1820)/cdn.vox-cdn.com/uploads/chorus_image/image/57015009/DeSoto_National_Forest.0.jpg", "https://i.pinimg.com/736x/d9/d7/b1/d9d7b167d1346df98ced8c41abd79347--hiking-trails-pathways.jpg", "http://www.visitgainesville.com/media/801819/photo_gallery_medium_hawthornebiking.jpg", "https://www.backpacker.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cg_faces:center%2Cq_80%2Cw_620/MTQ0OTE0MDkzMDY0MzMzMDI5/path-through-longleaf-pines.jpg", "https://lh5.googleusercontent.com/-jT8UTwYsWWY/TXZ2NINujqI/AAAAAAAADOs/uDhXo-EkfP4/s400/IMG_1783.JPG", "http://www.sundogoutfitter.com/images/Whitetop-Mountain.jpg", "https://www.railstotrails.org/media/41773/north-bend_rt_mainimage_photo-by-jake-lynch.jpg?crop=0.0600197048945723,0.24265225107922886,0.012372842088744599,0.027910979048561161&cropmode=percentage&width=880&height=460&rnd=131296851720000000", "http://www.hikinginthesmokys.com/smoky_mountains_photos/mount-rogers/mount-rogers.jpg", "https://photos.smugmug.com/Travel/Virginia/Waller-Mill-Park/i-gBFgBB2/0/d070384c/L/Trail%20Still%20Sandy%20-%20Waller%20Mill%20Park%20-%20Williamsburg%2C%20VA-L.jpg", "http://www.waynesboro.va.us/ImageRepository/Path?filePath=%2F00000000-0000-0000-0000-000000000000%5C26%5C29%5C30%2F5-15-12+026_201312301354115069.jpg", "http://www.planetware.com/photos-large/USVA/virginia-beach-first-landing-state-park-trail.jpg", "http://www.dcr.virginia.gov/state-parks/image/data/ca-image-04.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/61/Trail-Forest-Creek_-_West_Virginia_-_ForestWander.jpg", "http://www.tobaccoheritagetrail.org/wp-content/themes/standstillbox/images/Billboard_1.jpg", "https://www.backpacker.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cg_faces:center%2Cq_80%2Cw_620/MTQ3MjQ3NjQ0NjI2OTIwOTEw/ryan-p-wichelns_2017_04_30-west-virginia-backpacking_20170425_003.jpg", "https://rangerannette.files.wordpress.com/2014/12/31.jpg", "https://modernreston.com/wp-content/uploads/2014/10/Lake-Newport-Reston-Virginia-trail-11.jpg", "https://s3.amazonaws.com/vaorg-listingimages/19276/Rocktown_Trails.jpg", "http://www.intotheyonder.com/uploads/7/4/8/5/74852681/bluebell_3_orig.jpg", "http://cdn.onlyinyourstate.com/wp-content/uploads/2015/08/Virginia-Creeper-Trail-in-Fall--700x466.jpg", "http://www.bikepacking.com/wp-content/uploads/2014/09/Virginia-Mountain-Bike-Trail-34.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Forest-trail-north-fork-mountain_-_West_Virginia_-_ForestWander.jpg", "https://www.funinfairfaxva.com/wp-content/uploads/2015/05/Fall-colors-on-Difficult-Run-Trail-e1485819432364.jpg", "http://visitabingdonvirginia.com/wp-content/uploads/2015/09/BR15110303V_003-944x424.jpg", "http://cdn.onlyinyourstate.com/wp-content/uploads/2015/08/Old-Rag-trail--700x525.jpg", "https://www.pigeonforge.com/wp-content/uploads/bote-500.jpg", "https://www.nps.gov/common/uploads/grid_builder/akr/crop16_9/FD49899A-1DD8-B71B-0BD128907FBB8C3A.jpg?width=950&quality=90&mode=crop", "https://s3-us-east-2.amazonaws.com/visitdetroit-useast2-ohio/content/uploads/2017/05/17102109/wsi-imageoptim-hiking-trails-1300x865.jpg", "http://media.montalvoarts.org/uploads/images/2010/October/img_1589%20(Modified)1726.jpg", "https://www.nps.gov/slbe/planyourvisit/images/fall_trail.jpg", "http://greerarizona.com/wp-content/themes/prototype-greer/images/hike/01_hiking_trails.jpg", "https://www.mtcharlestonresort.com/images/gallery/hike-ski/mtchaz_hiking_6.jpg", "http://www.uniquelyminnesota.com/images/mn-hiking-0530.jpg", "http://cdn.boulevards.com/files/2014/07/best-hikes-in-santa-cruz1.jpg", "https://glengordonmanor.com/wp-content/uploads/2017/09/Marys-Rock.jpg"];

			var randomImages = imagesArray[Math.floor(imagesArray.length * Math.random())];

			image.attr("src", randomImages);
		}

		if (difficultyDiv.text() === "green"){
			difficultyDiv.html('<h5><img src="assets/images/diffGreen30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "greenBlue"){
			difficultyDiv.html('<h5><img src="assets/images/diffGreenBlue30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "blue"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlue30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "blueBlack"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlueBlack30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "black"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlack30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "dblack"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlack30.svg" id="difficultyImg"></h5>');
		}

		card.append(image);
		card.append(nameDiv);
		card.append(lengthDiv);
		card.append(difficultyDiv);
		//card.append(directionButton);
		//card.append(favoriteButton);

		$("#resultList").append(card);
	}

	$(".search-results img").first().click();

	//change map location
}

// Google Maps Places API
// used to fillInAddress
function initAutocomplete() {

	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('address-input')),
	    {types: ['geocode']});

	console.log(autocomplete);

	autocomplete.addListener('place_changed', fillInAddress);

	return autocomplete;
}

// Google Maps Places API
// executes upon page load
// requests location from user's browser
function geolocate() {
	console.log("geolocate");

	if (navigator.geolocation) {

		var lat, lng;

		navigator.geolocation.getCurrentPosition(function(position) {

			var geolocation = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
			};

			//put into search function

			var circle = new google.maps.Circle({
			  center: geolocation,
			  radius: position.coords.accuracy
			});

			lat = geolocation.lat;
			lng = geolocation.lng;

			autocomplete.setBounds(circle.getBounds());
		});
  }
}

// Google Maps Places API
// executes upon start of input entry
// autocompletes search input
function fillInAddress() {

	var place = autocomplete.getPlace();

	for (var component in componentForm) {

	  document.getElementById(component).value = '';
	  document.getElementById(component).disabled = true;
	}

	for (var i = 0; i < place.address_components.length; i++) {
	  var addressType = place.address_components[i].types[0];
	  if (componentForm[addressType]) {
	    var val = place.address_components[i][componentForm[addressType]];
	    document.getElementById(addressType).value = val;
	  }
	}
}

mapboxgl.accessToken = 'pk.eyJ1IjoidHJpc3RhbmJoIiwiYSI6ImNqYmM5N20zbTFneWQzMm1yOTMzdnhwbjkifQ.LsCkehEVMnMWOEui5tZDCw';

var map = new mapboxgl.Map({
    container: 'map',
    center: [mapLng, mapLat],
    zoom: 14,
    style: 'mapbox://styles/tristanbh/cjbc99ak070r02smphdl75h5i'
});

// iNaturalist API
function iNaturalist(lat, lng) {

	console.log("naturalist", lat, lng);

	var radius = 20;

	var speciesQueryURL = "http://api.inaturalist.org/v1/observations/"
		+ "species_counts?photos=true&radius="
		+ radius + "&lat=" + lat + "&lng=" + lng;

	var histogramQueryURL = "http://api.inaturalist.org/v1/observations/histogram?lat="
		+ lat + "&lng=" + lng + "&radius=" + radius
		+ "&date_field=observed&interval=month_of_year";

	$.ajax({
		url: speciesQueryURL,
		method: 'GET'
	}).done(function(response) {
		console.log(response);
	});

	$.ajax({
		url: histogramQueryURL,
		method: 'GET'
	}).done(function(response) {

		var data = response.results.month_of_year;
		var dataArray = [];

		$.each(data, function(month, value) {
			dataArray.push(value);
		});

		histogram(dataArray);
	});
}

//Chartist API
function histogram(dataArray) {
	console.log(dataArray);

	var labelsArray = [
		"Jan", "Feb", "Mar", "Apr",
		"May", "Jun", "Jul", "Aug",
		"Sep", "Oct", "Nov", "Dec"
	]

	new Chartist.Bar('.ct-chart', {
	  labels: labelsArray,
	  series: dataArray,
	}, {
	  distributeSeries: true
	});

}

// custom functions for get and set
// can be used more easily than built-in
// because they allow object or string values
function setLocalStorage(key, value) {

	localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {

	var result = JSON.parse(localStorage.getItem(key));
	return result;
}


