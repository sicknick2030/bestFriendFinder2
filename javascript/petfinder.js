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

function showDropdowns () {
	$("#search").css("display","block");
	$("#whole").css("display","block");
}

console.log("wow!");

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
			count: 25,
		},
		success: function(petApiData) {
			// empty current shelters Div
			$("#sheltersNoAddress").empty();

			pets = petApiData.petfinder.pets.pet;
			shelterList = transform(pets);
			addShelterInfo(shelterList);

			console.log("pets", pets);
			console.log("shelter list: ",shelterList);

			displayPets(pets);
		},
	});
};

// function to display pets to the right of the map
function displayPets(pets,shelterId) {
	// empty current contents of the results and div
	$(".results").empty();

	// step through list of pets and add name and photo to the results div
	for (var i = 0; i < pets.length; i++) {

		// if a shelter Id is specified, then check to see that it matches the marker's shelter Id
		if (shelterId === undefined || (shelterId != undefined && pets[i].shelterId.$t === shelterId)) {

			var animalID = pets[i].id.$t;

			var animalDiv = $("<div class ='animalDiv'>");

			var animalName = pets[i].name.$t;
			var animalNameDiv = $("<h2>").text(animalName);
			animalDiv.append(animalNameDiv);

			var animalImageURL = '';
			var animalImage = '';

			if ("photos" in pets[i].media && typeof pets[i].media.photos.photo[2].$t != "undefined") {
				animalImageURL = pets[i].media.photos.photo[2].$t;
				animalImage = $("<img class='animal'>").attr({
					src: animalImageURL,
					id: animalID,
				});
			} else {
				animalImage = $("<img class='animal'>").attr("src", "https://writeandrescue.files.wordpress.com/2014/06/oops-cat1.jpg?w=620");
			}

			animalDiv.append(animalImage);
			
			var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Favorite");
			animalDiv.append(favoriteButton);

			$(".results").append(animalDiv);
			
		} // end if
	}

	// $("#modalContainer").children().addClass("modal");
};

function populateModal() {
	var animalID = this.id;

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

			var animalDiv = $("<div class ='animalDiv'>");

			var animalName = pet.name.$t;
			var animalNameDiv = $("<h2>").text(animalName);
			animalDiv.append(animalNameDiv);

			var animalImageURL = '';
			var animalImage = '';

			if ("photos" in pet.media && typeof pet.media.photos.photo[2].$t != "undefined") {
				animalImageURL = pet.media.photos.photo[2].$t;
				animalImage = $("<img class='animal'>").attr({
					src: animalImageURL,
					id: animalID,
				});
			} else {
				animalImage = $("<img class='animal'>").attr("src", "https://writeandrescue.files.wordpress.com/2014/06/oops-cat1.jpg?w=620");
			}

			animalDiv.append(animalImage);
			
			var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Favorite");
			animalDiv.append(favoriteButton);

			$(".modal-content").append(animalDiv);

		}
	})
}

function showModal() {
	$("#modalContainer").css("display","block");
}

function closeModal() {
	$("#modalContainer").css("display","none");
}

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

// function getBreeds() {
// 	console.log("getBreeds");
// 	var queryURL = "https://api.petfinder.com/breed.list";
// 	var petType = $("#petType").val().trim();

// 	$.ajax({
// 		url: queryURL,
// 		jsonp: "callback",
// 		dataType: "jsonp",
// 		data: {
// 			key: PetFinderAPIKey,
// 			animal: petType,
// 			output: "basic",
// 			format: "json",
// 		},
// 		success: function(breedResponse) {
// 			console.log(breedResponse.petfinder.breeds.breed);
// 		}
// 	})
// }

// $(document).on("click","#getBreedList", getBreeds);

// function showShelter()  {
// 	var queryURL = "https://api.petfinder.com/shelter.get";
	
// 	$.ajax({
// 		url: queryURL,
// 		jsonp: "callback",
// 		dataType: "jsonp",
// 		data: {
// 			key: PetFinderAPIKey,
// 			id: "CA827",
// 			output: "basic",
// 			format: "json",
// 		},
// 		success: function(shelterResponse) {
// 			// console.log(shelterResponse);
// 		}
// 	})
// }

// $(document).on("click","#getShelters",showShelter);

