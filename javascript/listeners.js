// when zip code is submitted by user
$(document).on("click","#zipSubmit",function(event) {
	event.preventDefault();
	getPets(event);
	initMap();
});

// when any of the pet search dropdowns are changed
$(document).on("change",".target",getPets);

// when pet is favorited
$(document).on("click",".addFavorite",addFavorite);

$(document).on("click","#zipSubmit",showDropdowns);
