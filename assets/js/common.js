// FOR MULTICOLORED BEHAVIOR (USE CTRL+B ON ANY PAGE)
let colorsSS = sessionStorage.getItem("colors");
if (colorsSS == null){
	sessionStorage.setItem("colors", false);
}

let colouredCards = sessionStorage.getItem("colors");

document.onkeydown = function (key){
	if(key.ctrlKey && key.which == 66){
		// alert("Ctrl + B shortcut combination was pressed");

		let dummy = sessionStorage.getItem("colors");
		let dummy2 = JSON.parse(dummy) === true;

		if(!dummy2){
			// alert("Colors enabled.\nReloading");
			swal({
				title: "Colors enabled",
				text: "Just a moment...",
				icon: "success",
			});
		} else {
			// alert("Colors disabled.\nReloading");
			swal({
				title: "Colors disabled",
				text: "Just a moment...",
				icon: "error",
			});
		}

		let millisecondsToWait = 1500;
		setTimeout(function(){
			window.location.reload();
		}, millisecondsToWait);

		sessionStorage.setItem("colors", !dummy2);
	}

}

// DATA SOURCES
let apiUrl = "https://mindhub-xj03.onrender.com/api/amazing"
let localData = "./assets/amazing_1.json";


// GO TO DETAILS
function viewDetails(cardId) {
	window.location.href = `./details.html?id=${cardId}`
}

// CARD STYLE ARRAY
// let cardStyleArray = ["card-magenta",	"card-blue","card-green",	"card-yellow", "card-white", "card-red", 
// 	"card-purple", "card-orange", "card-cyan", "card-brown"];

// CARDS & DETAILS STYLE ARRAY (For colored animations)
let colorStyles = ["red", "blue", "green", "yellow", "orange", "magenta", "cyan", "purple", "white", "brown", "silver"];



// CATEGORIES SET GENERATION
const categorySetGenerator = (allEvents) => {
	let categoriesSet = new Set();
	allEvents.forEach( evento => categoriesSet.add(evento.category) )
	// return [...categoriesSet];																												// Return as an Array
	return categoriesSet;																																// Return as Set
}

const categorySetGenerator2 = (myObj) => {
	let categoriesSet = new Set();
	myObj.events.forEach( evento => categoriesSet.add(evento.category) )
	// return [...categoriesSet];																												// Return as an Array
	return categoriesSet;																																// Return as Set
}


// CHECKBOX SQUARES GENERATOR
const checkBoxGenerator = (categoriesArray) => {

	let checkBoxHTML = `<div class="d-flex flex-wrap d-sm-flex my-1 gap-2">`;

	categoriesArray.forEach(categoria => 
		{ checkBoxHTML += `	<div class="form-check ms-2">
			<input type="checkbox" class="form-check-input" value="${categoria}" id="checkCat-${categoria}">
			<label class="form-check-label" for="checkCat-${categoria}">${categoria}</label>
			</div>`
		
		});

	checkBoxHTML += "</div>"
	return checkBoxHTML;
}


// SINGLE CARD GENERATOR
function generateCard(evento, refDate, cardClassColor, withColour){

	return `<div class="mb-4 d-flex justify-content-center" onclick="viewDetails(${evento._id})">
	<div class="card ${withColour ? "card-".concat(cardClassColor) : ""} h-100">
		<img src="${evento.image}" class="card-img-top" alt="${evento.name} image">
		<div class="card-body">
		<h5 class="card-title text-center">${evento.name}</h5>
		<div class="d-flex mb-0 justify-content-evenly">
			<p class="card-price d-inline mb-0"><small>${evento.date}</small></p>
			<p class="card-price d-inline mb-0"><strong>$${evento.price}</strong></p>
		</div>
		<hr class="mb-2 mt-2">
			<p class="card-text mb-2">${evento.description}</p>
		</div>
		<div class="card-footer">
		<btn onclick="viewDetails(${evento._id})" class=${refDate >= evento.date ? '"btn btn-outline-secondary"':'"btn btn-outline-info"'} >View Details</btn>
		</div>
	</div>
</div>
`
}


// ALL-CARDS GENERATOR FUNCTION
function generateCards(myObj, categoriesArray){

	let cardsHTML = `<div class="d-flex flex-wrap my-5 justify-content-around">`
	let withColors = JSON.parse(sessionStorage.getItem("colors")) === true;
	// withColors = false;																																								//Discomment this line for no multiple colors

	if (myObj.events.length != 0){
		myObj.events.forEach((event) => {
			let colorStyle = colorStyles[categoriesArray.indexOf(event.category) % colorStyles.length]
			// cardsHTML += generateCard(event, myObj.currentDate, colorStyle, colouredCards)
			cardsHTML += generateCard(event, myObj.currentDate, colorStyle, withColors)
		})
	} else {
		cardsHTML += `<div class="d-flex flex-column"> <p class="text-center" style="color:white;font-size:3rem;">Oops, no coincidences!</p><p class="text-center" style="color:white;font-size:2rem;">Try adjusting your search parameters</p></div>`
	}

	return cardsHTML + `</div>`
}


// FILTER BASED ON SEARCH BAR
function filterContent(my_object) {
	// Checkboxes (only selected)
	let categoriesFound = [];
	document.querySelectorAll(".form-check-input").forEach( e => {if(e.checked == true) categoriesFound.push(e.value)})

	// Input search current value
	let searchWord = document.getElementById("search").value.toLowerCase();
	let allCategoriesArray2 = [...categorySetGenerator2(my_object.currentTarget.myParam)]


	let filteredObj = filterByDate(my_object.currentTarget.myParam)																			
	let filteredEvents = filteredObj.events																																	//Initially, got all the events


	// Apllying the filters
	if ( categoriesFound.length != 0){
		filteredEvents = filteredEvents.filter( evento => categoriesFound.includes(evento.category))
	}

	if (searchWord != ""){
		filteredEvents = filteredEvents.filter( evento => evento.name.toLowerCase().includes(searchWord))
	}

	// Return object
	let filteredContent = {
		currentDate: my_object.currentTarget.myParam.currentDate,
		events: filteredEvents
	}

	const cards_div = document.getElementById("cartas");
	cards_div.innerHTML = generateCards(filteredContent, allCategoriesArray2);
}


// FILTER BASED ON CURRENT PAGE
function filterByDate(myObject) {

	let currentURL = window.location.href
	let eventsFilteredByDate = myObject.events
	if( currentURL.includes("upcoming")){
		eventsFilteredByDate = myObject.events.filter( e => e.date >= myObject.currentDate)
	} else if (currentURL.includes("past")){
		eventsFilteredByDate = myObject.events.filter( e => e.date < myObject.currentDate)
	}

	// Return object
	let filteredObj = {
		currentDate: myObject.currentDate,
		events: eventsFilteredByDate
	}

	return filteredObj;

}


// GENERATES ALL STATS FROM UNFILTERED DATA
function generateStats(myObject) {

	// FOR MAJOR CAPACITY
	let capacitiesAll = []
	myObject.events.forEach(event => capacitiesAll.push(event.capacity))

	// higher capacity events
	let majorCapacity = myObject.events.filter( event => event.capacity == Math.max(...capacitiesAll))


	// ATTENDANCE PERCENTAGES
	let percentages = []

	// myObject.events.forEach(event => percentages.push({																																//ALL EVENTS
	myObject.events.filter(e => e.date < myObject.currentDate).forEach(event => percentages.push({												//ONLY PAST EVENTS
		_id: event._id,
		name: event.name,
		capacity: event.capacity,
		attendance: event.hasOwnProperty("assistance") ? event.assistance : event.estimate,
		percentage: (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) / event.capacity * 100
	})) 


	// let maximumPerc = Math.max.apply(Math, percentages.map(event => event.percentage));
	// let arrayMaximunAtt = percentages.filter(event => event.percentage == maximumPerc)
	let arrayMaximunAtt = percentages.filter(event => event.percentage == Math.max.apply(Math, percentages.map(event => event.percentage)))

	// let minimumPerc = Math.min.apply(Math, percentages.map(event => event.percentage));
	// let arrayMinimunAtt = percentages.filter(event => event.percentage == minimumPerc)
	let arrayMinimunAtt = percentages.filter(event => event.percentage == Math.min.apply(Math, percentages.map(event => event.percentage)))

	let maxCapLenght = majorCapacity.length
	let maxAttLenght = arrayMaximunAtt.length
	let minAttLenght = arrayMinimunAtt.length

	let mayorLenght = Math.max(maxCapLenght, maxAttLenght, minAttLenght)


	// STATS BY CATEGORY (FUTURE EVENTS AND PAST EVENTS)
	// All categories for sorting purposes
	let allCategories = [...categorySetGenerator(myObject.events)]

	// Arranged to store categories for each time period (upcomind or past)
	let upcomingCategories = [...categorySetGenerator(myObject.events.filter( e => myObject.currentDate <= e.date))];
	let pastCategories = [...categorySetGenerator(myObject.events.filter( e => myObject.currentDate > e.date))];

	upcomingCategories = allCategories.filter(category => upcomingCategories.includes(category));
	pastCategories = allCategories.filter(category => pastCategories.includes(category));

	let upcomingEventsStats = []
	// upcomingCategories.forEach( catName => upcomingEventsStats.push(generateCategoryStats(catName, myObject.events.filter(event => myObject.currentDate <= event.date))) )		//Bad Mode
	upcomingCategories.forEach( catName => upcomingEventsStats.push(generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate <= event.date))) )			//Good Mode

	let pastEventsStats = []
	// pastCategories.forEach( catName => pastEventsStats.push(generateCategoryStats(catName, myObject.events.filter(event => myObject.currentDate > event.date))) )						//Bad Mode
	pastCategories.forEach( catName => pastEventsStats.push(generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate > event.date))) )							//Good Mode

	// OBJECT TO RETURN
	let allStats = {
		cota: mayorLenght,
		maxCap: majorCapacity,
		maxPerc: arrayMaximunAtt,
		minPerc: arrayMinimunAtt,
		upcoming: upcomingEventsStats,
		past: pastEventsStats
	}

	return allStats;

}

// GENERIC CATEGORY STATS GENERATOR
// For Bad Mode (Not Used)
let generateCategoryStats = (categoryName, eventsArray) => {
	let categoryData = {
		category: categoryName,
		attendanceTotal: 0,
		capacityTotal: 0,
		revenue: 0,
	}

	eventsArray.filter( event => {if(event.category == categoryName) {
		categoryData.attendanceTotal += event.hasOwnProperty("assistance") ? event.assistance : event.estimate;
		categoryData.capacityTotal += event.capacity
		categoryData.revenue += (event.price * (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) )
	}})

	return categoryData;

}


// For Good Mode
let generateCategoryStats2 = (categoryName, eventsArray) => {
	let categoryData = {
		category: categoryName,
		percentages: [],
		avgPercentage: "",
		revenue: 0,
	}

	eventsArray.filter( event => {if(event.category == categoryName) {
		categoryData.percentages.push((event.hasOwnProperty("assistance") ? event.assistance : event.estimate) / event.capacity * 100);
		categoryData.revenue += (event.price * (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) );
	}})

	categoryData.avgPercentage = categoryData.percentages.reduce((a, b) => a + b) / categoryData.percentages.length

	return categoryData;

}

let modifyColorVariable = function (key){
	if(key.ctrlKey && key.which == 66){
		alert("Ctrl + B shortcut combination was pressed");
	}
}