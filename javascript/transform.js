// function to build a shelter list
// input: array of pets, ouput: array of shelters

function transform(petList) {

	// initiatialize list to return
	var shelterList = [];

	// function to check if shelterId is in shelter list
	function shelterInList(shelterList,shelterId) {
		var shelterInList = false;
		shelterList.forEach(function(shelter) {
			if (shelter.shelterId === shelterId) {
				shelterInList = true;
			}
		})
		return shelterInList;
	};

	// function to get index of shelter with shelterId in shelter list
	function shelterIndex(shelterList,shelterId) {
		var shelterIndex = null;
		shelterList.forEach(function(shelter,index) {
			if (shelter.shelterId === shelterId) {
				shelterIndex = index;
			}
		})
		return shelterIndex;
	}

	// function to get number of pets in shelter list
	function countPets(shelterList) {
		var count = 0;
		shelterList.forEach(function(shelter) {
			count += Object.keys(shelter["pets"]).length;
		})
		return count;
	}

	// iterate through the list of pets
	for (var i = 0; i < petList.length; i++) {

		// store shelter ID
		var shelterId = petList[i].shelterId.$t;

		// store pet ID for pet i in list
		var petId = petList[i].id.$t;
		
		// if shelter is NOT currently in the list
		if (!shelterInList(shelterList,shelterId)) {
			// add shelter and pet to the shelter list
			shelterList.push({"shelterId":shelterId,"pets":[petList[i]],});
		}
		// if shelter is ALREADY in the list
		else {
			// add pet to existing shelter in the list
			shelterList[shelterIndex(shelterList,shelterId)]["pets"].push(petList[i]); 
		}
		

	} // end of for loop that loops through original pet list

	// check that the number of pets in new list match number of pets in old list
	try {
		if (!(countPets(shelterList) === petList.length)) {
			throw new Error("The number of pets don't match!");
		}	
	}
	catch(error) {
		console.log(error.message);
	}

	// return the new list shelters
	return shelterList;

}; // end of function