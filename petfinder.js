// function zipValidation(zipCode) {
// 	var isValid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(zipCode);
//     if (isValid)
//         alert('Valid ZipCode');
//     else {
//         alert('Invalid ZipCode');
//     }
// }

// https://validatejs.org/
// function zipValidation() {
// 	var pattern = /\d{5}(-\d{4})?/;
// 	validate({}, {zipCode: {format: pattern}});
// }

// initializes firebase
var config = {
    apiKey: "AIzaSyBj0VNeS_U8PR-NDxZNYUnfb67Ca76FEzw",
    authDomain: "bestfriendfinder-26231.firebaseapp.com",
    databaseURL: "https://bestfriendfinder-26231.firebaseio.com",
    projectId: "bestfriendfinder-26231",
    storageBucket: "bestfriendfinder-26231.appspot.com",
    messagingSenderId: "739384275677"
  };

firebase.initializeApp(config);
var db = firebase.database().ref();
var dbFav = firebase.database().ref("/favorites");

console.log("wow");

var PetFinderAPIKey = "156a1b8fa2233c99240e24d804ef4754"; 

function getPets(event) {
	event.preventDefault();
	$("#results").empty();

	var petType = $("#petType").val().trim();
	var zipCode = $("#zipCode").val().trim();
	var petAge = $("#petAge").val().trim();
	var petSize = $("#petSize").val().trim();
	var petGender = $("#petGender").val().trim();

	var queryURL = "https://api.petfinder.com/pet.find";

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: petType,
			location: zipCode,
			age: petAge,
			size: petSize,
			sex: petGender,
			output: "basic",
			format: "json",
			count: 10,
		},
		success: function(petApiData) {
			var pets = petApiData.petfinder.pets.pet;
			shelterList = transform(pets);
			addShelterInfo(shelterList);
			console.log("shelter list: ",shelterList);

			console.log("pets", pets);

			for (var i = 0; i < pets.length; i++) {
				var animalDiv = $("<div class ='animalDiv'>");

				var animalName = pets[i].name.$t;
				var animalNameDiv = $("<h2>").text(animalName);
				animalDiv.append(animalNameDiv);

				var animalImageURL = pets[i].media.photos.photo[2].$t;
				var animalImage = $("<img class='animal'>").attr("src", animalImageURL);
				animalDiv.append(animalImage);

				// var animalDescription = pets[i].description.$t;
				// var animalDescriptionDiv = $("<p>").text(animalDescription);
				// animalDiv.append(animalDescriptionDiv);

				var animalID = pets[i].id.$t;
				var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Favorite");
				animalDiv.append(favoriteButton);

				$("#results").append(animalDiv);

				// NEED TO GENERATE A LIST OF SHELTERS
				// AND THEN PULL THE SHELTER INFO FROM PETFINDER TO GIVE TO THE GOOGLE MAPS API
			}
		}
	})
}

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

			// add shelter information to shelter
			shelter["shelterInfo"] = shelterInfo;

			// if full shelter address exists, then geocode it and add it to map
			if ("$t" in shelterInfo.address1 && "$t" in shelterInfo.city &&
				"$t" in shelterInfo.state && "$t" in shelterInfo.zip) {
				var address = shelterInfo.address1.$t + ", " + shelterInfo.city.$t +
								", " + shelterInfo.state.$t + " " + shelterInfo.zip.$t;
				geocodeAddress(address,geocoder,map);
			}
			else { // otherwise, log the shelter to console
				console.log(shelterInfo.name.$t);
			}
			// refreshMap(map,shelter["shelterInfo"]);
		}
	});
};

// adds shelter info to each shelter in list
function addShelterInfo(shelterList) {

	shelterList.forEach(function(shelter) {
		getShelterInfo(shelter.shelterId,shelter);
	});

	// refreshMap(map,shelterList);
	return shelterList;

}

$(document).on("click", "#zipSubmit", getPets);
$(document).on("change",".target",getPets);

function addFavorite() {
	var animalID = this.value;

	var queryURL = "https://api.petfinder.com/pet.get";
	
	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			id: animalID,
			output: "basic",
			format: "json",
		},
		success: function(petResponse) {
			console.log(petResponse);
			var pet = petResponse.petfinder.pet;
			var favoriteName = pet.name.$t;
			var favoriteShelterID = pet.shelterId.$t;
			var favoritePhoto = pet.media.photos.photo[2].$t;

			dbFav.push({
				favoriteID: animalID,
				favoriteName: favoriteName,
				favoriteShelterID: favoriteShelterID,
				favoritePhoto: favoritePhoto,
			});
		}
	})
}

$(document).on("click",".addFavorite",addFavorite);

// this will pull the favorites from firebase and display
// NEED FRONT END HELP HERE: 

dbFav.on("child_added", function(snapshot) {
	console.log("child_added", snapshot.val());

	var favDiv = $("<div class ='favDiv'>");

	var favName = snapshot.val().favoriteName;
	var favNameDiv = $("<h2>").text(favName);
	favDiv.append(favNameDiv);

	// var favImageURL = snapshot.val().favoritePhoto;
	// var favImage = $("<img class='animal'>").attr("src", favImageURL);
	// favDiv.append(favImage);

	$("#favorites").append(favDiv);
})

// helper functions below

function getBreeds() {
	console.log("getBreeds");
	var queryURL = "https://api.petfinder.com/breed.list";
	var petType = $("#petType").val().trim();

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: petType,
			output: "basic",
			format: "json",
		},
		success: function(breedResponse) {
			console.log(breedResponse.petfinder.breeds.breed);
		}
	})
}

$(document).on("click","#getBreedList", getBreeds);

function showShelter()  {
	var queryURL = "https://api.petfinder.com/shelter.get";
	
	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			id: "CA827",
			output: "basic",
			format: "json",
		},
		success: function(shelterResponse) {
			// console.log(shelterResponse);
		}
	})
}

$(document).on("click","#getShelters",showShelter);

