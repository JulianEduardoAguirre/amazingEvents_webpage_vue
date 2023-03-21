let asyncFuture = async function(){

	const div_tarjetas = document.getElementById("cartas");
	while(div_tarjetas.firstChild) {div_tarjetas.removeChild(div_tarjetas.firstChild);}	 

	const div_checkboxes = document.getElementById("checkboxes")
	while(div_checkboxes.firstChild) { div_checkboxes.removeChild(div_checkboxes.firstChild);}	//Delete previous content (if exists)

	try {

		// throw new Error('Error fetching API data') 																								//Thrown error for testing

		const response = await fetch(apiUrl);
		// const response = await fetch(localData);													//Discomment this line and comment the previous one if data is not being shown
		const dataRetr = await response.json().then( apiEvents => {
	
			let allCategoriesArray = [...categorySetGenerator2(apiEvents)]

	
		// *************** FIRST RENDERING SECTION *************** 
		// 									 global declarations

		// CARDS SECTION
		div_tarjetas.innerHTML = generateCards(filterByDate(apiEvents), allCategoriesArray);				//First time rendering cards (using all data)

		// CHECKBOXES
		// div_checkboxes.innerHTML = checkBoxGenerator(filterByDate(apiEvents));										//Use this for only checkboxes with available categories
		div_checkboxes.innerHTML = checkBoxGenerator(allCategoriesArray);												//First (and unique) time rendering checkboxes


	// *************** ADDING EVENT LISTENERS FOR FILTER SECTION *************** 

		const inputSearch = document.getElementById("search")
		inputSearch.addEventListener("input", filterContent)
		inputSearch.myParam = apiEvents;

		const otrosCheckboxes = document.querySelectorAll(".form-check-input")
		for (const checkbox of otrosCheckboxes) {
			checkbox.addEventListener("click", filterContent);
			checkbox.myParam = apiEvents;
		}		
	})
		
	} catch (error) {
			console.log(error)
			// Delete search bar container
			const div_form = document.getElementById("div-formulario")
			div_form.className = "d-none"

			// Show error message on screen
			div_tarjetas.innerHTML = `<div class="d-flex flex-column"> <p class="text-center" style="color:white;font-size:3rem;">An error ocurred!</p>
			<p class="text-center" style="color:white;font-size:2rem;">Try in another moment</p></div>`		
	}


}

asyncFuture();


