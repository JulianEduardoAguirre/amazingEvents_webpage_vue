const {createApp} = Vue

createApp({
		data() {
			return {
				urlApi: "https://mindhub-xj03.onrender.com/api/amazing",
				localData: "./assets/amazing_1.json",
				event: "",
				cardId: "",
				assistanceOrEstimated: ""
			}
		},
		created(){
			this.getId();
			this.getEvent();
		},
		mounted(){

		},
		methods:{
			getEvent(){
				fetch(this.urlApi)
				// fetch(this.localData)
				.then(response => response.json())
				.then(data => {
					// console.log(data)						//PERFECTO
					this.event = data.events.filter( event => event._id == this.cardId)[0];
					this.assistanceOrEstimated = this.event.hasOwnProperty("assistance") ? "<span class='cap-conf'>Estimated:</span>  ".concat(`${this.event.assistance}`):"<span class='cap-conf'>Assistance:</span>: ".concat(`${this.event.estimate}`);
					console.log(this.event)
					console.log(this.event.assistance)
					console.log(this.event.estimate)
				})
			},
			goToDetails(cardId){
				window.location.href = `./details.html?id=${cardId}`
			},
			getId(){
				let params = new URLSearchParams(document.location.search);
				this.cardId = params.get("id");
				console.log(this.cardId);
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






