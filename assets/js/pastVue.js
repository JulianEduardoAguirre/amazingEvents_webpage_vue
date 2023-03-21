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
				currentDate: ""
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
					this.events = data.events.filter( event => event.date < data.currentDate);
					this.backupEvents = data.events.filter( event => event.date < data.currentDate);
					this.getCategories(data.events)
				})
			},
			getCategories(eventsArray) {
				eventsArray.forEach(event => {
					if(!this.categories.includes(event.category)){
						this.categories.push(event.category);
					}
				});
				// console.log(this.categories);	//PERFECTO
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






