document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello Bulma!');
});
getModalInputInfo = () => {
	//store input values into vraiables
	var name = $('input[type="text"]').val();
	var email = $('input[type="email"]').val();
	var age = $('#age-checkbox').val();
	var cuisineType = $('#cuisine-type').val();
	var bars = $('#bar-options').val();
	

	//turn variables into objects
	var currentInfo = {
		name: name,
		email: email,
		age: age,
		options: [cuisineType]
	}

	if (bars === "true") {
		currentInfo.options.push('bar');
	}

	console.log(bars)

	saveAboutYou(currentInfo)
	
}

saveAboutYou = (currentInfo) => {
	//create array
	var aboutYouInfo = [];

	// add form information to array
	aboutYouInfo.push(currentInfo);

	//save newest information to local storage
	localStorage.setItem('about-you', JSON.stringify(aboutYouInfo));

	clearScreen();

	initMap(aboutYouInfo);
}

clearScreen = () => {
	$('.card-container').remove();
}

// map of activiteies pulls up 
let map;
let service;
let infowindow;
var request;
var marker = [];

initMap = (aboutYouInfo) => {
	map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.1627, lng: -86.7816 },
    zoom: 15,
	mapId: "4e61ecbe9e376a4a"
  });

  	var aboutYouInfo = JSON.parse(localStorage.getItem('about-you'));

  	if(aboutYouInfo) {
		for(i = 0; i < aboutYouInfo[0].options.length; i++) { 
			searchForPlaces(aboutYouInfo[0].options[i]);
		}
	}
}

searchForPlaces = (currentOption) => {
	request = {
		location: { lat: 36.1627, lng: -86.7816 },
		radius: 5000,
		keyword: currentOption,
		openNow: 'true',
		rankby: 'prominence'
	}
  
	service = new google.maps.places.PlacesService(map);
  
	service.nearbySearch(request, placeMarkersOnMap);
  
	google.maps.event.addListener(map, 'rightclick', (e) => {
		map.setCenter(e.latLng);
		clearResults(markers);
  
		var request = {
			location: e.latLng,
			radius: 5000,
			keyword: currentOption
		}
		service.nearbySearch(request, placeMarkersOnMap);
	})
	infowindow = new google.maps.InfoWindow();
}

createCardsFromApi = (results) => {

	//create container to hold all cards
	cardContainer = document.createElement('div');
	cardContainer.classList = 'card-container';
	$('#results').append(cardContainer);
				
	const card = document.createElement('div');
		$(card).addClass('card').appendTo(cardContainer)

	const cardContent = document.createElement('div');
		$(cardContent).addClass('card-content').appendTo(card)
	
	const resultIcon = document.createElement('img')
		$(resultIcon).addClass('icon')
		.attr('src', results[0].icon)
		.attr('alt', 'result_Icon')

	const resultTitle = document.createElement('p')
		$(resultTitle).addClass('title result-title')
		.html(' ' + results[0].name);

	const resultAddress = document.createElement('p')
		$(resultAddress).addClass('result-address')
		.html(results[0].vicinity);
	
	const resultRating = document.createElement('p')
		$(resultRating).addClass('card-detail')
		.html('Ratings: ' + results[0].rating);
	
	const resultPhoto = document.createElement('img')
		$(resultPhoto)
		.attr('src', results[0].photos[0].getUrl())
		.attr('alt', 'result_Photo')
		
	const resultPriceLevel = document.createElement('p')
		$(resultPriceLevel).html('').addClass('card-detail')
		if (results[0].price_level == 0) {
			$(resultPriceLevel).html('Price Level: Free')
		}
		else if (results[0].price_level == 1) {
			$(resultPriceLevel).html('Price Level: Inexpensive')
		}
		else if (results[0].price_level == 2) {
			$(resultPriceLevel).html('Price Level: Moderate')
		}
		else if (results[0].price_level == 3) {
			$(resultPriceLevel).html('Price Level: Expensive')
		}
		else if (results[0].price_level == 4) {
			$(resultPriceLevel).html('Price Level: Very Expensive')
		}
		else $(resultPriceLevel).html('Price Level: Unknown')

	resultTitle.prepend(resultIcon)
	cardContent.append(resultTitle, resultPhoto, resultAddress, resultRating, resultPriceLevel)

}

placeMarkersOnMap = (results, status) => {

	if(status == google.maps.places.PlacesServiceStatus.OK) {
		for(i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
		createCardsFromApi(results);
	}
	
}

createMarker = (place) => {

	marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	
	google.maps.event.addListener(marker, 'click', (e) => {
		var placeDetail = "<b>" + place.name + "</b> <br/>" + place.vicinity;
		infowindow.setContent(placeDetail);
		infowindow.setPosition(e.latLng);
    	infowindow.open(map);
	});
}

// CONTACT US
saveContactUs = () => {
	var cName = $('#contact-us-name').val()
	var cEmail = $('#contact-us-email').val()
	var cExperience = $('#are-you-happy').val()
	var cMessage = $('#message').val()


	// console.log('apples')
	var contactUsForm = {
		name: cName,
		email: cEmail,
		expirence: cExperience,
		message: cMessage
	}
	//pull down from local storage
	var savedContactUsInfo = JSON.parse(localStorage.getItem('contact-us')) || [];

	//push new content to local storage
	savedContactUsInfo.push(contactUsForm)

	//save to local storage
	localStorage.setItem('contact-us', JSON.stringify(savedContactUsInfo))

}

$('#save-changes').click(getModalInputInfo);
$('#submitBtn').click(saveContactUs)

$("#showModal").click(function() {
	$(".modal").addClass("is-active");  
})
	  
$(".close").click(function() {
    $(".modal").removeClass("is-active");
})
