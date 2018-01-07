// function to get shelter info for a shelter and add it to shelter object
function getShelterInfo(shelterId,shelter) {

	var queryURL = "https://api.petfinder.com/shelter.get";

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			id: shelterId,
			format: "json",
		},
		success: function(response) {
			
			// pull shelter information object from API response
			var shelterInfo = response.petfinder.shelter;

			// add shelter information to shelter object
			shelter["shelterInfo"] = shelterInfo;

			// if full shelter address exists, then geocode it and add it to map
			if (shelterInfo != undefined && "$t" in shelterInfo.address1 && "$t" in shelterInfo.city &&
				"$t" in shelterInfo.state && "$t" in shelterInfo.zip) {
				var address = shelterInfo.address1.$t + ", " + shelterInfo.city.$t +
								", " + shelterInfo.state.$t + " " + shelterInfo.zip.$t;
				geocodeAddress(shelter,address,geocoder,map);
			}
			else { // otherwise, add the shelter to the sheltersNoAddress div
				if (shelterInfo != undefined) {
					// create the div to hold the shelter info
					var shelterDiv = $("<div id='shelter'></div>");
					// build the various components
					shelterDiv.append($("<div id='sheltername'></div>").text(shelter.shelterInfo.name.$t));
					shelterDiv.append($("<div id='shelteremail'></div>").text(shelter.shelterInfo.email.$t));
					shelterDiv.append($("<div id='shelterphone'></div>").text(shelter.shelterInfo.phone.$t));
					// add the complete div to the sheltersNoAddress div
					$("#sheltersNoAddress").append(shelterDiv);
				}
			}
		}
	});
};

// adds shelter info to each shelter in list
function addShelterInfo(shelterList) {

	shelterList.forEach(function(shelter) {
		getShelterInfo(shelter.shelterId,shelter);
	});

	return shelterList;

}