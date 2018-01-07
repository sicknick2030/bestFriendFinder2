function initMap() {
		
	// $("#zipSubmit").on("click",function(event) {

		// initial center for the map
		var USAcenter = {lat: 39.8283, lng: -98.5795};

		// create geocoder object
		geocoder = new google.maps.Geocoder();

		// grab zipcode from input form
		var currentZip = $("#zipCode").val().trim();

		// create map and add it to the div
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: USAcenter,
		});

		geocodeZip(currentZip,geocoder,map);
	// });

}
