const {createApp} = Vue

createApp({
		data() {
			return {
				urlApi: "https://mindhub-xj03.onrender.com/api/amazing",
				localData: "./assets/amazing_1.json",
				events: [],
				backupEvents: [],
				searchText: "",
				categories: [],
				categoriesSelected: [],
				currentDate: "",
				allStats: ""
			}
		},
		created(){
			this.getEvents();
		},
		mounted(){

		},
		methods:{
			getEvents(){
				fetch(this.urlApi)
				// fetch(this.localData)
				.then(response => response.json())
				.then(data => {
					// console.log(data)						//PERFECTO
					this.currentDate = data.currentDate;
					this.events = data.events;
					console.log(this.events)
					this.backupEvents = data.events;
					this.getCategories(data.events);
					this.allStats = this.generateStats(data);
					console.log("STATS")
					console.log(this.allStats)
				})
			},
			getCategories(eventsArray) {
				eventsArray.forEach(event => {
					if(!this.categories.includes(event.category)){
						this.categories.push(event.category);
					}
				});
				// console.log(this.categories);	//PERFECTO
			},
			categorySetGenerator (allEvents){
				let categoriesSet = new Set();
				allEvents.forEach( evento => categoriesSet.add(evento.category) )
				// return [...categoriesSet];																												// Return as an Array
				return categoriesSet;																																// Return as Set
			},

			generateStats(myObject) {
				console.log("HOLA")
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
				// let allCategories = [...categorySetGenerator(myObject.events)]
				let allCategories = this.categories;
			
				// Arranged to store categories for each time period (upcomind or past)
				let upcomingCategories = [...this.categorySetGenerator(myObject.events.filter( e => myObject.currentDate <= e.date))];
				let pastCategories = [...this.categorySetGenerator(myObject.events.filter( e => myObject.currentDate > e.date))];
			
				upcomingCategories = allCategories.filter(category => upcomingCategories.includes(category));
				pastCategories = allCategories.filter(category => pastCategories.includes(category));
			
				let upcomingEventsStats = []
				// upcomingCategories.forEach( catName => upcomingEventsStats.push(generateCategoryStats(catName, myObject.events.filter(event => myObject.currentDate <= event.date))) )		//Bad Mode
				upcomingCategories.forEach( catName => upcomingEventsStats.push(this.generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate <= event.date))) )			//Good Mode
			
				let pastEventsStats = []
				// pastCategories.forEach( catName => pastEventsStats.push(generateCategoryStats(catName, myObject.events.filter(event => myObject.currentDate > event.date))) )						//Bad Mode
				pastCategories.forEach( catName => pastEventsStats.push(this.generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate > event.date))) )							//Good Mode
			
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
			
			},
			generateCategoryStats2 (categoryName, eventsArray) {
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
			
				categoryData.avgPercentage = (categoryData.percentages.reduce((a, b) => a + b) / categoryData.percentages.length).toFixed(2);
			
				return categoryData;
			
			}

		},
		computed: {
			eventsFilter(){
				console.log(this.categoriesSelected.length)
				let inputSearchFiltered = this.backupEvents.filter(event => event.name.toLowerCase().includes(this.searchText.toLowerCase()));
				if(this.categoriesSelected.length > 0 ){
					this.events = inputSearchFiltered.filter(event => this.categoriesSelected.includes(event.category));
				} else {
					this.events = inputSearchFiltered;
				}
			}
		}






}).mount("#app")






