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
	$("#input").css("height","45%");
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

			var animalID = pets[i].id.$t;
			var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Add to favorites:").html("&#9734");
			animalDiv.append(favoriteButton);


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
			
				var breed = pets[i].breeds.breed.$t;
				var breedDiv = $("<div class='breed' value='" + breed + "'>").text(breed);
				animalDiv.append(breedDiv);

				var idAge = pets[i].age.$t;
				var ageDiv = $("<div class='age' value='" + idAge + "'>").text(idAge);
				animalDiv.append(ageDiv);

			$(".results").append(animalDiv);
			
		} // end if
	}

	// $("#modalContainer").children().addClass("modal");
};

function populateModal() {
	$(".modal-content").empty();
	$(".modal-content").html('<span class="close">&times;</span>');
	var animalID = this.id;
	console.log(this);
	console.log(animalID, "animalID");

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
			var favoritePhoto = '';
			if ("photos" in pet.media && typeof pet.media.photos.photo[2].$t != "undefined") {
				favoritePhoto = pet.media.photos.photo[2].$t;
			} else {
				favoritePhoto = "https://writeandrescue.files.wordpress.com/2014/06/oops-cat1.jpg?w=620";
			}
			var description = pet.description.$t;

			var animalDiv = $("<div class ='modalAnimalDiv'>");

			var animalName = pet.name.$t;
			var animalNameDiv = $("<h2>").text(animalName);
			animalDiv.append(animalNameDiv);

			var animalImageURL = '';
			var animalImage = '';

			if ("photos" in pet.media && typeof pet.media.photos.photo[2].$t != "undefined") {
				animalImageURL = pet.media.photos.photo[2].$t;
				animalImage = $("<img class='modalAnimal'>").attr({
					src: animalImageURL,
					id: animalID,
				});
			} else {
				animalImage = $("<img class=modalAnimal>").attr("src", "https://writeandrescue.files.wordpress.com/2014/06/oops-cat1.jpg?w=620");
			}

			var animalURL = "https://www.petfinder.com/petdetail/" + animalID;
			// var URLButton = $("<button class='goToPetFinder' value='" + animalID + "'>").text("Go to PetFinder");
			var PFLink = $("<button class=petFinderLink>").text("Go to PetFinder");
			PFLink.html("<a href='" + animalURL + "'>Go to Pet Finder</a>");
			// PFLink.html("Go to PetFinder");
			console.log(animalURL,"animalURL");
			console.log(PFLink,"PFLink");
			animalDiv.append(PFLink);

			animalDiv.append(animalImage);
			
			var favoriteButton = $("<button class='addModalFavorite' value='" + animalID + "'>").text("Add to Favorites");
			animalDiv.append(favoriteButton);

			var modalDescription = $("<p class='addModalDescription' value='" + description + "'>").text(description);
			animalDiv.append(modalDescription);

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
	console.log(this);

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
			var favoriteAge = pet.age.$t;
			var favoriteBreed = pet.breeds.breed.$t;

			dbFav.push({
				favoriteID: animalID,
				favoriteName: favoriteName,
				favoriteShelterID: favoriteShelterID,
				favoritePhoto: favoritePhoto,
				favoriteBreed: favoriteBreed,
				favoriteAge: favoriteAge,
				favoriteBreed: favoriteBreed,
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
	var favNameDiv = $("<h2 class='favName'>").text(favName);
	favDiv.append(favNameDiv);

	var favImageURL = snapshot.val().favoritePhoto;
	var favImage = $("<img class='favAnimal'>").attr("src", favImageURL);
	favDiv.append(favImage);

	var favBreedURL = snapshot.val().favoriteBreed;
	var favBreed = $("<p class='favBreed'>").text(favBreedURL);
	favDiv.append(favBreed);

	var favAgeURL = snapshot.val().favoriteAge;
	var favAge = $("<p class='favAge'>").text(favAgeURL);
	favDiv.append(favAge);

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

