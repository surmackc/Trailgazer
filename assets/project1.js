//Show user welcome




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
		$("#trail-card").insertAfter($(this));
		$("#trail-card").removeClass("hide");
	});

	$("body").on("click", ".directionButtonClass", function(event) {
		window.location = "https://www.google.com/maps/"
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

	var milesRadius = "maxDistance=10"

	var sourceSelect = $("#source")

	if(sourceSelect.val() === "10 Miles" ) {
    		milesRadius = "maxDistance=10";
    }

    if(sourceSelect.val() === "20 Miles" ) {
    		milesRadius = "maxDistance=20";
    }

    if(sourceSelect.val() === "30 Miles" ) {
    		milesRadius = "maxDistance=30";
    }

	if(sourceSelect.val() === "40 Miles" ) {
    		milesRadius = "maxDistance=40";
    }

	if(sourceSelect.val() === "50 Miles" ) {
    		milesRadius = "maxDistance=50";
    }

	if(sourceSelect.val() === "60 Miles" ) {
    		milesRadius = "maxDistance=60";
    }

	if(sourceSelect.val() === "70 Miles" ) {
    		milesRadius = "maxDistance=70";
    }

	if(sourceSelect.val() === "80 Miles" ) {
    		milesRadius = "maxDistance=80";
    }

	if(sourceSelect.val() === "90 Miles" ) {
    		milesRadius = "maxDistance=90";
    }

	if(sourceSelect.val() === "100 Miles" ) {
    		milesRadius = "maxDistance=100";
    }


	

	queryURL += keyTrails + "&lat=" + lat + "&lon=" + lng + milesRadius;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		var status = response.success;
		if (status === 1) {

			console.log(response);

			var trails = response.trails;

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
		card.append(image);

		var nameDiv = $('<div class="name">');
		var lengthDiv = $('<div class="length">');
		var difficultyDiv = $('<div class="difficulty">');
		var directionButton= $("<button>")

		nameDiv.text(trails[i].name);
		lengthDiv.text(trails[i].length);
		difficultyDiv.text(trails[i].difficulty);
		directionButton.text("Get Directions")

		directionButton.addClass("directionButtonClass")

		card.append(nameDiv);
		card.append(lengthDiv);
		card.append(difficultyDiv);
		card.append(directionButton)

		$("#resultList").append(card);
	}
}





//get placeID for each result and geocode

