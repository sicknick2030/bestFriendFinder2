function initMap() {
	var uluru = {lat: -25.363, lng: 131.044};
	
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: uluru,
	});

	// center the map at the zipcode provided by the user
	geocodeZip("94110",geocoder,map);

	// create the shelterList, which adds markers to map
	var shelterList = addShelterInfo(transform(petList));
	console.log(shelterList);

}
