
			var http = new XMLHttpRequest();
			var url = 'https://desolate-meadow-12518.herokuapp.com/rides';
			var params = "username=cqgUgd9M&lat=42.4069238&lng=-71.1188082";
			var min;
			var currentMin;
			var distance;
			var isVehicle = false;

			var all_vehicles = [];
			var all_passengers = [];

			var weiner_marker;
			var weiner_pos;
			var closest_weiner;
			var currWeinerMin;
			var weiner_exist = false;
			var weiner = {username: "", lat: 0, lng: 0};

			var vehicle_marker;
			var vehicle_pos;
			var vehicle = {username: "", lat: 0, lng: 0};

			var passenger_marker;
			var pass_pos;
			var passenger = {username: "", lat: 0, lng: 0};

			var myLat = 0;
			var myLng = 0;

			var me = new google.maps.LatLng(myLat, myLng);
			var myOptions = {
				zoom: 13, // The larger the zoom number, the bigger the zoom
				center: me,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var map;
			var marker;
			var infowindow = new google.maps.InfoWindow();

			function init() {
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				getMyLocation();
			}

			function getMyLocation() {
				if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
					navigator.geolocation.getCurrentPosition(function(position) {
						myLat = position.coords.latitude;
						myLng = position.coords.longitude;
						renderMap();
						request();
					});
				}
				else {
					alert("Geolocation is not supported by your web browser.  What a shame!");
				}
			}

			function renderMap() {

				me = new google.maps.LatLng(myLat, myLng);
				// Update map and go there...
				map.panTo(me);

				marker = new google.maps.Marker({
					position: me,
					title: "Username: cqgUgd9M"
				});

				marker.setMap(map);
				marker.setIcon("pusheen.png");	// customize marker

			}

			function request(){

				params = "username=cqgUgd9M&lat=" + myLat + "&lng=" + myLng;
				http.open('POST',url,true);
				//http.open("GET", "https://messagehub.herokuapp.com/messages.json", true);
				http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	
				http.onreadystatechange = function(){

					if(http.readyState == 4 && http.status == 200) {
						parsedMessage = JSON.parse(http.responseText);	// array of vehicles 
	
						alert(http.responseText);
							// push objects to appropriate arrays
							if(parsedMessage["vehicles"]){
								isVehicle = true;
								for (i = 0; i < parsedMessage["vehicles"].length; i++){
									if (parsedMessage["vehicles"][i].username == "WEINERMOBILE"){
										weiner_exist = true;
										weiner = {username: "WEINERMOBILE", lat: parsedMessage["vehicles"][i].lat, lng: parsedMessage["vehicles"][i].lng};

										all_vehicles.push({
											weiner
										})				
										renderWeiner();
									}
									else {
										vehicle = {username: parsedMessage["vehicles"][i].username, lat: parsedMessage["vehicles"][i].lat, lng: parsedMessage["vehicles"][i].lng};
										all_vehicles.push({
											vehicle
										})
										renderVehicle();
									}
								}

								// finding closest vehicle, weinermobile ---------------------------

								closest_weiner = checkDistance(parsedMessage["vehicles"][0].lat, parsedMessage["vehicles"][0].lng);
								min = checkDistance(parsedMessage["vehicles"][0].lat, parsedMessage["vehicles"][0].lng);

								for (count = 1; count < parsedMessage["vehicles"].length; count++) {
									if(parsedMessage["vehicles"].username == "WEINERMOBILE"){
										currWeinerMin = checkDistance(parsedMessage["vehicles"][count].lat, parsedMessage["vehicles"][count].lng);
										if(currentWeinerMin < closest_weiner){
											closest_weiner = currentWeinerMin;
										}
									}
						
									currentMin = checkDistance(parsedMessage["vehicles"][count].lat, parsedMessage["vehicles"][count].lng);
									if (currentMin < min){
										min = currentMin;
									}
								}

								if (weiner_exist){
									google.maps.event.addListener(marker, 'click', function(){
										infowindow.setContent(this.title + " Distance from closest vehicle: " + min + " The Weinermobile is  " + closest_weiner + " miles away from me!");
										infowindow.open(map, this);
									});
								}
								else {
									google.maps.event.addListener(marker, 'click', function(){
										infowindow.setContent(this.title + " Distance from closest vehicle: " + min + " The Weinermobile is nowhere to be seen!");
										infowindow.open(map, this);
									});
								}
										
							}

							// handling passenger case
							if(parsedMessage["passengers"]){
								isVehicle = false;
								for (j = 0; j < parsedMessage["passengers"].length; j++){
									if (parsedMessage["passengers"][j].username == "WEINERMOBILE"){
										weiner_exist = true;
										weiner = {username: "WEINERMOBILE", lat: parsedMessage["passengers"][j].lat, lng: parsedMessage["passengers"][j].lng};
										all_passengers.push({
											weiner
										})	
		
										renderWeiner();
									}
									else{
										passenger = {username: parsedMessage["passengers"][j].username, lat: parsedMessage["passengers"][j].lat, lng: parsedMessage["passengers"][j].lng};
										all_passengers.push({
											passenger
										})
										renderPassenger();
									}
								}

								// finding closest weinermobile, passenger
								closest_weiner = checkDistance(parsedMessage["passengers"][0].lat, parsedMessage["passengers"][0].lng);
								min = checkDistance(parsedMessage["passengers"][0].lat, parsedMessage["passengers"][0].lng);
				
								for (count = 1; count < parsedMessage["passengers"].length; count++) {
									if(parsedMessage["passengers"].username == "WEINERMOBILE"){
										weinerExists = true;
										currWeinerMin = checkDistance(parsedMessage["passengers"][count].lat, parsedMessage["passengers"][count].lng);
										if(currentWeinerMin < closest_weiner){
											closest_weiner = currentWeinerMin;
										}
									}
						
									currentMin = checkDistance(parsedMessage["passengers"][count].lat, parsedMessage["passengers"][count].lng);
									if (currentMin < min){
										min = currentMin;
									}
								}

									if (weiner_exist){
										google.maps.event.addListener(marker, 'click', function() {
											infowindow.setContent(this.title + " Distance from closest passenger: " + min + " The Weinermobile is  " + closest_weiner + " miles away from me!");
											infowindow.open(map, this);
										});
									}
									else {
										google.maps.event.addListener(marker, 'click', function() {
											infowindow.setContent(this.title + " Distance from closest passenger: " + min + " The Weinermobile is nowhere to be seen!");
											infowindow.open(map, this);
										});
									}
	
							}
					}
				}
				http.send(params);
			}

			//--------------------------
			function renderWeiner() {				
				if (isVehicle){
					weiner_pos = new google.maps.LatLng(all_vehicles[i].weiner.lat, all_vehicles[i].weiner.lng);
					weiner_marker = new google.maps.Marker({
						position: weiner_pos,
						title: "Username: WEINERMOBILE" + " Distance from you: " + checkDistance(all_vehicles[i].weiner.lat, all_vehicles[i].weiner.lng)
					});

					weiner_marker.setMap(map);
					weiner_marker.setIcon("weinermobile.png");

					google.maps.event.addListener(weiner_marker, 'click', function() {
						infowindow.setContent(this.title);
						infowindow.open(map, this);
					});
				}

				else{ 
					weiner_pos = new google.maps.LatLng(all_passengers[j].weiner.lat, all_passengers[j].weiner.lng);
					weiner_marker = new google.maps.Marker({
						position: weiner_pos,
						title: "Username: WEINERMOBILE" + " Distance from you: " + checkDistance(all_passengers[j].weiner.lat, all_passengers[j].weiner.lng)
					});

					weiner_marker.setMap(map);
					weiner_marker.setIcon("weinermobile.png");

					google.maps.event.addListener(weiner_marker, 'click', function() {
						infowindow.setContent(this.title);
						infowindow.open(map, this);
					});
				}
			}

			function renderVehicle() {
				vehicle_pos = new google.maps.LatLng(all_vehicles[i].vehicle.lat, all_vehicles[i].vehicle.lng);

				vehicle_marker = new google.maps.Marker({
					position: vehicle_pos,
					title: "Username: " + all_vehicles[i].vehicle.username + " Distance from you: " + checkDistance(all_vehicles[i].vehicle.lat, all_vehicles[i].vehicle.lng)
				});

				vehicle_marker.setMap(map);
				vehicle_marker.setIcon("car.png");

				google.maps.event.addListener(vehicle_marker, 'click', function() {
					infowindow.setContent(this.title);
					infowindow.open(map, this);
				});
			}

			function renderPassenger(){
				pass_pos = new google.maps.LatLng(all_passengers[j].passenger.lat, all_passengers[j].passenger.lng);
				passenger_marker = new google.maps.Marker({
					position: pass_pos,
					title: "Username: " + all_passengers[j].passenger.username + " Distance from you: " + checkDistance(all_passengers[j].passenger.lat, all_passengers[j].passenger.lng)
				});

				passenger_marker.setMap(map);
				passenger_marker.setIcon("pass_pusheen.png");

				google.maps.event.addListener(passenger_marker, 'click', function() {
					infowindow.setContent(this.title);
					infowindow.open(map, this);
				});

			}
			
			// FROM STACKOVERFLOW
			function checkDistance(other_lat, other_lng){
				Number.prototype.toRad = function() {
				   return this * Math.PI / 180;
				}

				var R = 3958.756 // 6371, km 
				//has a problem with the .toRad() method below.
				var x1 = myLat - other_lat;
				var dLat = x1.toRad();  
				var x2 = myLng - other_lng;
				var dLon = x2.toRad();  
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
				        Math.cos(myLat.toRad()) * Math.cos(other_lat.toRad()) * 
				        Math.sin(dLon/2) * Math.sin(dLon/2);  
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				distance = R * c; 
				return distance;

			}