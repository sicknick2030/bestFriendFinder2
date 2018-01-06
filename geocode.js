// function to return latitude and longitude for a zip code

function geocodeZip(zipcode,geocoder,map) {

	geocoder.geocode( {componentRestrictions: {
    postalCode: zipcode,
  	}}, function(results, status) {
		if (status === "OK") {			
			map.setCenter(results[0].geometry.location);
    	}
		else {
			alert("Geocode was not successful for the following reasons ", status)
		}
	});

}

function geocodeAddress(address,geocoder,map) {

	geocoder.geocode( 
		{address: address},
		function(results,status) {
			if (status === "OK") {
	    		var marker = new google.maps.Marker({
	      			map: map,
	      			position: results[0].geometry.location,
	    		});
			}
			else {
				alert("Geocode was not successful for the following reasons ", status)
			}
		});

}