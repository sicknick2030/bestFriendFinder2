// returns latitude and longitude for a zip code
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

// adds shelter address to the map
function geocodeAddress(shelter,address,geocoder,map) {

	geocoder.geocode( 
		{address: address},
		function(results,status) {
			if (status === "OK") {
	    		var marker = new google.maps.Marker({
	      			map: map,
	      			position: results[0].geometry.location,
	      			label: shelter.pets.length.toString(),
	      			title: shelter.shelterInfo.name.$t,
	    		});
			}
			else {
				alert("Geocode was not successful for the following reasons ", status)
			}
		});

}

