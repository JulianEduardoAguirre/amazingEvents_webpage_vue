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
				categoriesSelected: []
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
					this.events = data.events;
					console.log(this.events)
					this.backupEvents = data.events;
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
		}






}).mount("#app")






