function initMap() {
		
	$("#zipSubmit").on("click",function(event) {

		// prevent refresh of page
		event.preventDefault();

		// initial center for the map
		var uluru = {lat: -25.363, lng: 131.044};

		// create geocoder object
		geocoder = new google.maps.Geocoder();

		// create map and add it to the div
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: uluru,
		});

		// grab zipcode from input form
		var currentZip = $("#zipCode").val().trim();

		// center the map at the zipcode provided by the user
		geocodeZip(currentZip,geocoder,map);

		// create the shelterList, which adds markers to map
		var shelterList = addShelterInfo(transform(petList));
		console.log(shelterList);

	});

}
