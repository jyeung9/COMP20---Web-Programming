

		console.log("here i am 1");
			var http = new XMLHttpRequest();
			var url = 'https://hans-moleman.herokuapp.com/rides';
			var params = "username=cqgUgd9M&lat=42.4069238&lng=-71.1188082";
			var min;
			var currentMin;
			var distance;
			var isWeiner = false;

			const cars = {
				username: "",
				lat: 0,
				lng: 0,
				isWeiner: false;
			}
			// var weiner_marker;
			// var weiner_lat;
			// var weiner_lng;

			// var weiner_arr = [];
			// var passenger_arr = [];
			// var vehicle_arr = [];
			// var weiner = {username: "", lat: 0, lng: 0};
			// var vehicle = {username: "", lat: 0, lng: 0};

			// var vehicle_marker;
			// var vehicle_lat;
			// var vehicle_lng;
			var myLat2 = 30;
			var myLng2 = -31;
			var me2 = new google.maps.LatLng(myLat2, myLng2);

			http.open('POST',url,true);
			//http.open("GET", "https://messagehub.herokuapp.com/messages.json", true);
			http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			console.log("here i am 2");

			//--------------------------
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
				console.log("inside init()");
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				getMyLocation();

				marker2 = new google.maps.Marker({
					position: me2,
					title: "testing",
					icon: "pusheen2.png"
				});

			marker2.setMap(map);

				http.onreadystatechange = function(){
	
				if(http.readyState == 4 && http.status == 200) {
					console.log("here i am 4");
					parsedMessage = JSON.parse(http.responseText);	// array of vehicles 

						for (i = 0; i < parsedMessage["vehicles"].length; i++){
							if (parsedMessage["vehicles"][i].username == "WEINERMOBILE"){
								console.log("found Weinermobile");
								weiner = {username: "WEINERMOBILE", lat: parsedMessage["vehicles"][i].lat, lng: parsedMessage["vehicles"][i].lng};
								weiner_arr.push({
									weiner
								})					
							}
							else {
								console.log("found vehicle");
								console.log(parsedMessage["vehicles"]);
								vehicle = {username: parsedMessage["vehicles"][i].username, lat: parsedMessage["vehicles"][i].lat, lng: parsedMessage["vehicles"][i].lng};
								vehicle_arr.push({
									vehicle
								})
							}
						}

						console.log("vehicles: " + vehicle_arr);
						console.log("weinermobiles: " + weiner_arr);

						// iterate through to find closest vehicle
						min = checkDistance(parsedMessage["vehicles"][0].lat, parsedMessage["vehicles"][0].lng);

						for (count = 1; count < parsedMessage["vehicles"].length; count++) {
							if(parsedMessage["vehicles"].username == "WEINERMOBILE"){
								console.log("found Weinermobile");
							}
				
							currentMin = checkDistance(parsedMessage["vehicles"][count].lat, parsedMessage["vehicles"][count].lng);
							if (currentMin < min){
								min = currentMin;
								console.log("min: " + min);
							}
						}
					
					console.log("parsed stuff ");
					//alert(http.responseText);
				}
					google.maps.event.addListener(marker2, 'click', function() {
					infowindow.setContent(marker2.title);
					infowindow.open(map, marker2);
				});
			}
			http.send(params);

			}
			//------------------------
			function getMyLocation() {
				console.log("I am here 1");
				if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
					navigator.geolocation.getCurrentPosition(function(position) {
						console.log("I am here 2");
						myLat = position.coords.latitude;
						myLng = position.coords.longitude;
						renderMap();
						console.log("coordinates: " + myLat, myLng);
					});
				}
				else {
					alert("Geolocation is not supported by your web browser.  What a shame!");
				}
			}

			//--------------------------
			function renderMap() {
				console.log("inside renderMap");
				me = new google.maps.LatLng(myLat, myLng);
				// Update map and go there...
				map.panTo(me);
				
				// Create a marker
				marker = new google.maps.Marker({
					position: me,
					title: "Username: " + " Distance from closest vehicle: " + "Distance from Weinermobile: "
				});
				marker.setMap(map);
				marker.setIcon("pusheen.png");	// customize marker
					
				// Open info window on click of marker
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});

				
				for (int i = 0; i < weiner_arr.length; i++){

					weiner = new google.maps.LatLng(weiner_arr[i].lat, weiner_arr[i].lng);
					weiner_marker = new google.maps.Marker({
						position: me,
						title: "Username: " + " Distance from closest vehicle: " + "Distance from Weinermobile: "
					});
					marker.setMap(map);
					marker.setIcon("weinermobile.png");	// customize marker
						
					// Open info window on click of marker
					google.maps.event.addListener(weiner_marker, 'click', function() {
						infowindow.setContent(weiner_marker.title);
						infowindow.open(map, weiner_marker);
					});
				}

				

				// if(isWeiner){
				// 	weiner_marker = new google.maps.Marker({
				// 		position: weiner,
				// 		title: "hi there"
				// 	});

				// 	weiner_marker.setMap(map);
				// 	weiner_marker.setIcon("weinermobile.png");

				// 	google.maps.event.addListener(weiner_marker, 'click', function() {
				// 		infowindow.setContent(weiner_marker.title);
				// 		infowindow.open(map, weiner_marker);
				// 	});

				// 	isWeiner = false;
				// }
			}

			function checkDistance(other_lat, other_lng){
				console.log("inside check distance");
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
				console.log("computed distance");
				return distance;
				
				console.log(distance);
			}