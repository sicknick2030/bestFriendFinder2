// when zip code is submitted by user
$(document).on("click","#zipSubmit",function(event) {
	event.preventDefault();
	getPets(event);
	initMap();
	showDropdowns(event);
});

// when any of the pet search dropdowns are changed
$(document).on("change",".target",getPets);

// when an animal is clicked
$(document).on("click",".animal", function(event) {
	event.preventDefault();
	populateModal(event);
	showModal(event);
});

// when pet is favorited
$(document).on("click",".addFavorite",addFavorite);

// when modal is closed
$(document).on("click",".close",closeModal);
