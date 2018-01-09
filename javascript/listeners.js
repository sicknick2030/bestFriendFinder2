// when zip code is submitted by user
$(document).on("click","#zipSubmit",function(event) {
	event.preventDefault();
	$("#messages").empty();

	var validationReturn = zipValidation();
	if (validationReturn === undefined) {
		getPets(event);
		initMap();
		showDropdowns(event);
	} else {
		$("#messages").text("Please enter a valid zip code");
	}
});

// when any of the pet search dropdowns are changed
$(document).on("change",".target",function(event)  {
	removeMarkers();
	getPets(event);
});

// when an animal is clicked
$(document).on("click",".animal", function(event) {
	event.preventDefault();
	showModal();
});

$(document).on("click",".favDiv", function(event) {
	event.preventDefault();
	showModal();
});

// when pet is favorited
$(document).on("click",".addFavorite",addFavorite);

// populates modals whenever animal or favDiv are clicked
$(document).on("click",".animal",populateModal);
$(document).on("click",".favDiv",populateModal);

// when modal is closed
$(document).on("click",".close",closeModal);
