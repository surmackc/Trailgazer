Hiking Project: https://www.hikingproject.com/data/get-trails?lat=37.5374&lon=-77.5275maxDistance=10&key=200192640-ba183a7097944b95e4bcb0d383b4e8a3

	APIKey: 200192640-ba183a7097944b95e4bcb0d383b4e8a3
	example lat and longitude: &lat=37.5374&lon=-77.5275

	Docs: https://www.hikingproject.com/data


Google Places API:
	https://maps.googleapis.com/maps/api/place/nearbysearch/json
	?location=-33.8670522,151.1957362
	&radius=10
	&types=parking
	&name=trail
	&key=AIzaSyA8eCdWZSDLdo0dIwZUahlyE1v_iMdw0l4

	APIKey: AIzaSyA8eCdWZSDLdo0dIwZUahlyE1v_iMdw0l4

	Docs: https://developers.google.com/places/web-service/intro


Google Maps Geocoding: Use code under Docs link below

	APIKey: AIzaSyDRt0EcXbppvF46BuzFPFx447lYL6psmuU

	Docs: https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple

	Lat/Lon to address: https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDRt0EcXbppvF46BuzFPFx447lYL6psmuU

	Address to Lat/lon: https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDRt0EcXbppvF46BuzFPFx447lYL6psmuU

<!-- 	//creates a map with input lat / long
		var geocoder;
		  var map;
		  function initialize() {
		    geocoder = new google.maps.Geocoder();
		    var latlng = new google.maps.LatLng(-34.397, 150.644);
		    var mapOptions = {
		      zoom: 8,
		      center: latlng
		    }
		    map = new google.maps.Map(document.getElementById('map'), mapOptions);
		  }

		//takes an address input and places a marker on a map
		  function codeAddress() {
		    var address = document.getElementById('address').value;
		    geocoder.geocode( { 'address': address}, function(results, status) {
		      if (status == 'OK') {
		        map.setCenter(results[0].geometry.location);
		        var marker = new google.maps.Marker({
		            map: map,
		            position: results[0].geometry.location
		        });
		      } else {
		        alert('Geocode was not successful for the following reason: ' + status);
		      }
		    });
		  }

		//HTML code to render map
		<body onload="initialize()">
		 <div id="map" style="width: 320px; height: 480px;"></div>
		  <div>
		    <input id="address" type="textbox" value="Richmond, VA">
		    <input type="button" value="Encode" onclick="codeAddress()">
		  </div>
		</body>    -->


Flickr Photos API: https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=611177be4e51d421c921fe371e1b3bcc&per_page=10&format=json&nojsoncallback=1

	Get Photo: https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=611177be4e51d421c921fe371e1b3bcc&photo_id=24073316357&format=json&nojsoncallback=1

	APIKey: 611177be4e51d421c921fe371e1b3bcc

	Docs: 	https://www.flickr.com/services/api/flickr.photos.search.html
			https://www.flickr.com/services/api/misc.urls.html

	How To: https://www.w3resource.com/API/flickr/tutorial.php





database.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().employeeName);
      console.log(childSnapshot.val().role);
      console.log(childSnapshot.val().startDate);
      console.log(childSnapshot.val().monthlyRate);


      // full list of items to the well
      $(".table").append("<tr class='well'><td id='name'> " + childSnapshot.val().employeeName +
        " </td><td id='email'> " + childSnapshot.val().role +
        " </td><td id='age'> " + childSnapshot.val().startDate +
        " </td><td id='comment'> " + childSnapshot.val().monthlyRate + " </span></tr>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });






// full list of items to the well
      $(".table").append("<tr class='well'><td id='name'> " + childSnapshot.val().employeeName +
        " </td><td id='email'> " + childSnapshot.val().role +
        " </td><td id='age'> " + childSnapshot.val().startDate +
        " </td><td id='comment'> " + childSnapshot.val().monthlyRate + " </span></tr>");
