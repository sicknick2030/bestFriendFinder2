
New Functionality

1) When a shelter marker on the map is clicked, an Info Window is displayed with shelter name, email, phone number, and nav link

2) When a shelter marker on the map is clicked, the pets displayed are filtered to include only those pets at the shelter

3) When an Info window is closed using the (X), the pet filter is turned off and all pets for the search are displayed

4) The marker for a shelter displays the number of pets at the shelter that meet search criteria

5) All shelters that don't have an address are added to a div with id="sheltersNoAddress" in the project2.html file. See accompanying image for the div format and ids for the shelter name, email, and phone number.

-----------------------------------

New Files

"Globals.js" contains global variables that are accessible by all functions
-> map, geocode objects
-> pets list, shelters list

"Listeners.js" contains all document-level event listeners. Move document level listeners to this file
-> listener for when zip code submit button is clicked
-> listener for when any of the search dropdowns are changed
-> listener for when favorites button is clicked

"Shelterinfo.js" contains petfinder API calls for the "shelter.get" API endpoint


-----------------------------------

New Functions

"displayPets(pets,shelterID)" in the petfinder.js file displays pets for the search and also does the task of filtering the pets for a specific marker when a marker is clicked