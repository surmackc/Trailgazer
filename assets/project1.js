//Show user welcome

var trails;

var trailsLat

var trailsLng




//Get user name and location
$(document).ready(function() {
	$("#address-submit").on("click", function getAddress(event) {
		// prevent page from refreshing when form tries to submit itself
		event.preventDefault();

		// Capture user inputs and store them into variables
		var address = $("#address-input").val().trim();

		// Console log each of the user inputs to confirm we are receiving them
		console.log(address);

		// Clear localStorage
		localStorage.clear();

		// Store all content into localStorage
		localStorage.setItem("address", address);

		geocode(address);
	});

	$(".search-results").on("click", ".imgDiv", function showDetails() {
		console.log($(this));
		var index = $(this).data("index");
		// $("#trail-card").insertAfter($(this));   //decided not to do this for now
		// $("#trail-card").removeClass("hide");    //decided not to do this for now

		$.each(trails[index], function populate(key, value) {
			if ( $(`#trail-${key}`) ) {
				$(`#trail-${key}`).text(value);
			}

			if ( ($(`#trail-${key}`)) && (key.startsWith("img")) ) {
				$(`#trail-${key}`).attr("src", value);
			}
		});
	});

	$("body").on("click", ".directionButtonClass", function(event) {
		
		var spefLat = $(this).attr("data-lat")
		var spefLng = $(this).attr("data-lng")
		var spefName = $(this).attr("data-name")

		var url = "https://www.google.com/maps/dir/?api=1";
		//var origin = "&origin=" + tempLatitude + "," + tempLongitude;
		var destination = "&destination=" + spefName;
		var newUrl = new URL(url  + destination);
		

		window.open(newUrl , "_blank")
	});
});



function geocode(address) {
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=";

	queryURL += keyMaps + "&address=" + address;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		var status = response.status;
		if (status === "OK") {
			console.log(response);

			var locationRef = response.results[0].geometry.location;
			var lat = locationRef.lat;
			var lng = locationRef.lng;

			console.log(lat, lng);
			localStorage.setItem("lat", lat);
			localStorage.setItem("lng", lng);

			getTrails(lat, lng);

		} else {
			alert('Geocode unsuccessful.');
		}
	});



	//May want to validate response somehow later
}

function getTrails(lat, lng) {

	var queryURL = "https://www.hikingproject.com/data/get-trails?key=";

	var milesRadius = "&maxDistance=10"

	var sourceSelect = $("#source")

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

			console.log(response);

			trails = response.trails;

			localStorage.setItem("trails", trails);

			renderCards(trails);

		} else {
			alert("Trails query unsuccessful.");
		}


	});

	//May want to validate response somehow later

	


}

function renderCards(trails) {
	$("#resultList").empty();

	for (i = 0; i < trails.length; i++) {

		

		var card = $("<div>");
		card.data("index", i);
		card.addClass("imgDiv col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3");

		var image = $("<img>");
		image.attr("src", trails[i].imgMedium);
		image.attr("alt", trails[i].name);
		if (image.attr("src") == "") {
			var imagesArray = ["http://www.visitbitterrootvalley.com/wp-content/uploads/2014/10/hiking-pano-bear-creek.jpg", "https://www.pigeonforge.com/wp-content/uploads/bote-500.jpg", "https://www.nps.gov/common/uploads/grid_builder/akr/crop16_9/FD49899A-1DD8-B71B-0BD128907FBB8C3A.jpg?width=950&quality=90&mode=crop", "https://s3-us-east-2.amazonaws.com/visitdetroit-useast2-ohio/content/uploads/2017/05/17102109/wsi-imageoptim-hiking-trails-1300x865.jpg", "http://media.montalvoarts.org/uploads/images/2010/October/img_1589%20(Modified)1726.jpg", "https://www.nps.gov/slbe/planyourvisit/images/fall_trail.jpg", "http://greerarizona.com/wp-content/themes/prototype-greer/images/hike/01_hiking_trails.jpg", "https://www.mtcharlestonresort.com/images/gallery/hike-ski/mtchaz_hiking_6.jpg", "http://www.uniquelyminnesota.com/images/mn-hiking-0530.jpg", "http://cdn.boulevards.com/files/2014/07/best-hikes-in-santa-cruz1.jpg", "https://glengordonmanor.com/wp-content/uploads/2017/09/Marys-Rock.jpg"]
			var randomImages = imagesArray[Math.floor(imagesArray.length * Math.random())];
			image.attr("src", randomImages);
		}
		card.append(image);

		var directionButton= $("<button>")
		var nameDiv = $('<div class="name">');
		var lengthDiv = $('<div class="length">');
		var difficultyDiv = $('<div class="difficulty">');

		nameDiv.text(trails[i].name);
		lengthDiv.text(trails[i].length);
		difficultyDiv.text(trails[i].difficulty);
		directionButton.text("Get Directions")
		directionButton.addClass("directionButtonClass")
		directionButton.attr("data-lat", trails[i].latitude)
		directionButton.attr("data-lng", trails[i].longitude)
		directionButton.attr("data-name", trails[i].name)

		card.append(nameDiv);
		card.append(lengthDiv);
		card.append(difficultyDiv);
		card.append(directionButton);

		$("#resultList").append(card);


	}
}
//<<<<<<< HEAD








//=======
//>>>>>>> dab2137e867946d1f055016bd327004362d6f1e8
//get placeID for each result and geocode

//autocomplete

      var placeSearch, autocomplete;
      var componentForm = { };

      function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
			(document.getElementById('address-input')),
            {types: ['geocode']});

        autocomplete.addListener('place_changed', fillInAddress);
      }

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

      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }

