
let asyncStats = async function(){
	const response = await fetch(apiUrl);
	// const response = await fetch(localData);													//Discomment this line and comment the previous one if data is not being shown
	const dataRetr = await response.json().then( datos1 => {


		let datos = generateStats(datos1);
		
		
		const tableGeneralStats = document.getElementById("table-event-statistics")
		const tableUpcoming = document.getElementById("table-upcoming")
		const tablePast = document.getElementById("table-past")
		
		var tBodyGeneral = tableGeneralStats.getElementsByTagName('tbody')[0];
		var tBodyUpcoming = tableUpcoming.getElementsByTagName('tbody')[0];
		var tBodyPast = tablePast.getElementsByTagName('tbody')[0];
		
		
		// GENERAL EVENTS STATS
		let tableEventStatsString = `<tr>
		<td class="italic">Events with the highest percentage of attendance</td>
		<td class="italic">Events with the lowest percentage of attendance</td>
		<td class="italic">Event with larger capacity</td>
		</tr>
		`

		// FOR ONLY ONE ROW
		rowNumber = 1

		// FOR ALL ROWS
		// rowNumber = datos.cota
		
		for (let index = 0; index < rowNumber; index++) {
			tableEventStatsString += `<tr>
			<td>${datos.maxPerc[index] !== "" ? datos.maxPerc[index].name : ""}</td>
			<td>${datos.minPerc[index] !== "" ? datos.minPerc[index].name : ""}</td>
			<td>${datos.maxCap[index] !== "" ? datos.maxCap[index].name : ""}</td>
			</tr>
			`			
		}

		tBodyGeneral.innerHTML = tableEventStatsString
		
		// UPCOMING STATS
		
		let tableUpcomingString = `					<tr>
		<td class="italic">Categories</td>
		<td class="italic">Revenues (estimated)</td>
		<td class="italic">Percentage of attendance (estimated)</td>
		</tr>`
		
		//Bad Mode
		// datos.upcoming.forEach( element => tableUpcomingString += `
		// <tr>
		// 	<td>${element.category}</td>
		// 	<td>$${element.revenue}</td>
		// 	<td>${(element.attendanceTotal / element.capacityTotal).toFixed(2) * 100}%</td>
		// </tr>
		// `)

		//Good Mode
		datos.upcoming.forEach( element => tableUpcomingString += `
		<tr>
			<td>${element.category}</td>
			<td>$${element.revenue}</td>
			<td>${element.avgPercentage.toFixed(2)}%</td>
		</tr>
		`)
		
		tBodyUpcoming.innerHTML = tableUpcomingString
		
		// PAST STATS
		
		let tablePastString = `					<tr>
		<td class="italic">Categories</td>
		<td class="italic">Revenues</td>
		<td class="italic">Percentage of attendance</td>
		</tr>`
		
		//Bad Mode
		// datos.past.forEach( element => tablePastString += `
		// <tr>
		// 	<td>${element.category}</td>
		// 	<td>$${element.revenue}</td>
		// 	<td>${(element.attendanceTotal / element.capacityTotal).toFixed(2) * 100}%</td>
		// </tr>
		// `)

		//Good Mode
		datos.past.forEach( element => tablePastString += `
		<tr>
			<td>${element.category}</td>
			<td>$${element.revenue}</td>
			<td>${element.avgPercentage.toFixed(2)}%</td>
		</tr>
		`)
		
		tBodyPast.innerHTML = tablePastString

	})

}

asyncStats();

