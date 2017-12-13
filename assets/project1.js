//Show user welcome

//Get user name and location
$("#address-submit").on("click", function(event) {
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

	queryURL += keyTrails + "&lat=" + lat + "&lon=" + lng + "maxDistance=10";

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
	console.log(trails);
	for (i = 0; i < trails.length; i++) {
		var trail = trails[i];
		var imgURL = trail.imgMedium;
		var difficulty = trail.difficulty;
		var id = trail.id;
		var length = trail.length;
		var name = trail.name;
		var summary = trail.summary;
		var url = trail.url;
		var location = trail.location;


		var card = $("<div>");
		card.addClass("card");

		var container = $("<div>");
		container.addClass("imgContainer");
		container.append(card);

		var image = $("<img>");
		image.attr("src", imgURL);
		image.attr("alt", name);
		container.append(image);

		$("#results").append(card);



	}
}

