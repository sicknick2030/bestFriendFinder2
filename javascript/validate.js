function zipValidation() {
	var zipInput = $("#zipCode").val().trim();
	var validation = validate.single(zipInput, {presence: true, format: /\d{5}(-\d{4})?/});
	return validation;
}