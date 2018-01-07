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
				// create new marker on map for shelter
	    		var marker = new google.maps.Marker({
	      			map: map,
	      			position: results[0].geometry.location,
	      			animation: google.maps.Animation.DROP,
	      			label: shelter.pets.length.toString(),
	    		});
	    		marker["id"] = shelter.shelterId;
	    		markers.push(marker);
	    		// create google maps URL for navigating to shelter
	    		var mapsURL = "https://www.google.com/maps/search/?api=1&query=" + address;
	    		// create link to google maps URL
	    		var mapsLink = "<a href=" + mapsURL + ">Navigate to shelter</a>"
	    		// create div for info window
	    		var infoDiv = 
	    		"<div id='mapinfo'>" +
	    			"<div id='sheltername' style='font-weight:bold'>" + shelter.shelterInfo.name.$t + "</div>" +
	    			"<div id='shelteremail'>Email: " + shelter.shelterInfo.email.$t + "</div>" +
	    			"<div id='shelterphone'>Phone: " + shelter.shelterInfo.phone.$t + "</div>" +
	    			"<div id='shelternav'>" + mapsLink + "</div>"
	    		// create info window for shelter
	    		var infowindow = new google.maps.InfoWindow({
	    			content: infoDiv,
	    		});
	    		// display info window if marker is clicked and filter the pets displayed
	    		marker.addListener("click",function() {
	    			infowindow.open(map,marker);
	    			displayPets(pets,marker.id);
	    		});
	    		// remove filter on pets displayed if info window is closed
	    		infowindow.addListener("closeclick",function() {
	    			displayPets(pets);
	    		});
			}
			else {
				alert("Geocode was not successful for the following reasons ", status)
			}
		});

}

