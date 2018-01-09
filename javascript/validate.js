function zipValidation() {
	var zipInput = $("#zipCode").val().trim();
	console.log("zipInput", zipInput);
	var validation = validate.single(zipInput, {presence: true, format: /\d{5}(-\d{4})?/});
	// var validation = validate.single(zipInput, {presence: true, zip: true});
	console.log("validation", validation);
	return validation;
}