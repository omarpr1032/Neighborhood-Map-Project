// Global Variables
var sidebarCollapsed = false;
const foursquareClientID = "EJUVUP3N1RXOYF33BRRLUSA0W5EDY5ZQWOLOAJWIALKOZKJF";
const foursquareClientSecret = "XQRIRGFFFM22ACACPMTL2HDYHCZXUJ4SNY5KPLOOSFQPR5TL";
var map;


// Sidebar Collapse Toggle
function ToggleSidebar(){
	// Get the sidebar element
  	var sidebar = document.getElementById("sidebar");

	// Sidebar Collapse
	if(sidebarCollapsed == true){
		sidebar.style.marginLeft=0;
		sidebarCollapsed = false;
	}else{
		sidebar.style.marginLeft="-260px";
		sidebarCollapsed = true;
	}
}

// Knockout Application View Model
var AppViewModel = function (){
	var self = this;
	this.markers = [];
	
	// Populate the Info Window with Foursquare API Address Content
	this.showInfoWindow = function(){
		var marker = this;
		var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' + marker.lng + 
			'&client_id=' + foursquareClientID +'&client_secret=' + foursquareClientSecret + '&query=' + marker.title + 
			'&v=20181009' + '&m=foursquare';

		$.getJSON(fourSquareUrl, function(result){
			var response = result.response.venues[0];
			self.street = response.location.formattedAddress[0];
			self.city = response.location.formattedAddress[1];
			self.zip = response.location.formattedAddress[3];

			var htmlContentFoursquare ='<h6>' + marker.title +'</h6>' + '<div>' + '<h7> Address: </h7>' +'<p>' + self.street + '</p>' + '</div>';
			
			self.infoWindow.setContent(htmlContentFoursquare);
			self.infoWindow.open(map,marker);
		});
	};

	//Google Map Initialization
	 this.initMap= function(){
		// Get the div element for map
		var mapDiv = document.getElementById('map');
		 // Define the map options
		var mapOptions = {
			center: {lat:18.159092,lng:-66.095541},
			zoom: 13
		};

		// Constructor creates a new map - only center and zoom are required.
		var map = new google.maps.Map(mapDiv, mapOptions);

		 // Create the map markers for each location
		 for (var i =0; i< locations.length; i++){			
			this.marker = new google.maps.Marker({
				map: map,
				position:{
					lat: locations[i].lat,
					lng: locations[i].lng
				},
				title: locations[i].title,
				lat: locations[i].lat,
				lng: locations[i].lng,
				id: i,
				animation: google.maps.Animation.DROP
			});
			
		 	// Add to array of markers
	 		this.markers.push(this.marker);
			// Create the listeners for the markers
			this.marker.addListener("click", self.showInfoWindow);
		 };
		 
		 // Define the Info Window
		 this.infoWindow = new google.maps.InfoWindow(); 
	}

	 // Load Map
	this.initMap();
	
	// Search Filter Observable
  	this.filter = ko.observable("");
	
	// Filter Computed Function
	this.filteredLocations = ko.computed(function(){
		var result = [];
		for (var i=0; i < self.markers.length; i++){
			var marker = self.markers[i];
			// Filter and only show the filtered markers
			if(marker.title.toLocaleLowerCase().includes(self.filter().toLowerCase())){
				result.push(marker);
				self.markers[i].setVisible(true);
			}else{
				self.markers[i].setVisible(false);
			}
		};
		// Return the markers locations array
		return result;
	});
};

showError = function showError() {
    alert(
        'Google Maps did not load. Please verify your network connection and try again!'
    );
};

// Use knockout JS
function startApp() {
    ko.applyBindings(new AppViewModel());
}





