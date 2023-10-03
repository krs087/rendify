/*
Rendify.ee
Rendify.ee Addition plugin js functions
Author: Rendify OÜ
Updated: 2023.10.03
Version: 1.1
*/

"use strict";

// Declare constants
const rendifyScript = document.getElementById('rendifyscript');
const rendifyApi = 'https://krs087.github.io/rendify/test-offline-request.json';//'http://rendify.localhost/jsplugin/request.json';
	//https://www.rendify.ee/public/customer-products/141
	//https://www.rendify.ee/public/customer-products/
const rendifyRedirect = 'https://www.rendify.ee/public/detail-view/';
	//https://www.rendify.ee/public/detail-view/207
let rendifyCustomer = false;
let rendifyTheme = false;
let rendifyItmes = false;
let rendifyWindow = false;
let rendifyProducts = false;
let rendifyZoom = false;

/*
++ add:
 * zoom level
 * automatically detect columns
*/

// Execute Rendify JS plugin
setTimeout(rendifyAddition,2000);

function rendifyOption(option,fallback) {
	return (rendifyScript.hasAttribute(option) && rendifyScript.getAttribute(option) !== '') ? rendifyScript.getAttribute(option) : fallback;
}

// Generate Rendify addition window and elements
function rendifyAddition() {
	if(rendifyScript) {
		rendifyTheme = rendifyOption('theme','default');
		rendifyItmes = rendifyOption('items',12);
		rendifyCustomer = rendifyOption('customer',false);
		rendifyZoom = rendifyOption('zoom',false);
		//rendifyElements();
		if(rendifyCustomer) {
			var rendifyDiv = document.createElement('div');
			rendifyDiv.id = 'rendifywindow';
			rendifyScript.insertAdjacentElement('afterend',rendifyDiv);
			//setTimeout(rendifyWindow,100);
			//setTimeout(rendifyFetch,200);
			var rw = document.getElementById('rendifywindow');
			rendifyWindow = (rw) ? rw : false;
			if(rendifyWindow) {
				// Add zoom level
				if(rendifyZoom) { rendifyWindow.setAttribute('style','zoom:'+rendifyZoom+'%;'); }
				// Add scripts and styles
				rendifyWindow.innerHTML += '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&amp;display=swap">';
				rendifyWindow.innerHTML += '<link rel="stylesheet" href="https://krs087.github.io/rendify/rendify.css">';
				// Add containers
				rendifyWindow.innerHTML += '<div class="latest__slider"><div class="latest__slider_content" id="rendifyproducts"></div></div>';
				rendifyWindow.innerHTML += '<a href="https://www.rendify.ee/public/customer-products/'+rendifyCustomer+'/" class="viewall" target="_blank">Vaata kõiki meie pakkumisi &#8599;</a>';
				var rr = document.getElementById('rendifyproducts');
				rendifyProducts = (rr) ? rr : false;
				// Execute next function
				if(rr) {
					//rendifyproducts
					rr.setAttribute('style','grid-template-columns:repeat('+rendifyItmes+',1fr);');
				}
				rendifyFetch();
			}
		}
	}
}

// Start DATA building
function rendifyData(data) {
	if(rendifyProducts) {
		var image = data.image;
		var title = data.name;
		var url = rendifyRedirect+data.id;
		var days = data.days;
		var time = data.startTs+'&nbsp;-&nbsp;'+data.endTs;
		var price = Math.floor(data.price)+'&nbsp;&euro;';
		var box = '';	
		box += '<div class="latest__box">';
		box += '<div class="latest__box_content">';
		box += '<img src="'+image+'" class="latest__box_image">';
		box += '<div class="latest__box_title">'+title+'</div>';
		box += '<div class="latest__box_info"><span class="title">Saadavus:</span><strong class="time">'+time+'</strong><strong class="day">'+days+'</strong></div>';
		box += '<a href="'+url+'" class="latest__box_button">'+price+'</a>';
		box += '</div>';
		box += '</div>';
		rendifyProducts.innerHTML += box;
	}
}

// rentDays remapping
function daysRemap(inObject) {

	// Templates
	const remapTemplate = {"MONDAY":1,"TUESDAY":2,"WEDNESDAY":3,"THURSDAY":4,"FRIDAY":5,"SATURDAY":6,"SUNDAY":7};
	const consolidatedTemplate = {1:"E",2:"T",3:"K",4:"N",5:"R",6:"L",7:"P"};

	// Remaping incoming days to numeric values
	const mappedNumbers = inObject.map(day => remapTemplate[day]);

	// Consolidate numeric values
	const grouped = [];
	let currentGroup = [];
	for (let i = 0; i < mappedNumbers.length; i++) {
		const currentNumber = mappedNumbers[i];
		if(currentGroup.length === 0 || currentNumber === currentGroup[currentGroup.length - 1] + 1 || i === 0) {
			currentGroup.push(currentNumber);
		} else {
			grouped.push(currentGroup);
			currentGroup = [currentNumber];
		}
	}
	if(currentGroup.length > 0) {
		grouped.push(currentGroup);
	}
	const consolidated = [];
	for(const subarray of grouped) {
		if (subarray.length > 2) {
			consolidated.push([subarray[0], subarray[subarray.length - 1]]);
		} else {
			consolidated.push(subarray);
		}
	}

	// Convert to readable template
	const mappedSubarrays = consolidated.map(subarray => subarray.map(number => consolidatedTemplate[number]));
	const result = mappedSubarrays.map(subarray => subarray.join('&nbsp;-&nbsp;')).join(', ');

	// Return
	return result;
}

// Generate time
function genTime(input) {
	const date = new Date(input);
	date.setMinutes(date.getMinutes() + 120);
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const formattedHours = hours < 10 ? `0${hours}` : hours;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes}`;
}

// Fetch data from rendify.ee
function rendifyFetch() {
	if(rendifyWindow && rendifyCustomer && rendifyProducts) {
		fetch(rendifyApi) //rendifyApi+rendifyCustomer
		.then(response => {
			if(!response.ok) {
				throw new Error('Network response was not OK');
			}
			return response.json();
		})
		.then(data => {
			const ids = ['id','images','name','priceDaily','startTs','endTs','rentDays'];
			var cc = 0;
			data.map(obj => {
				cc += 1;
				if(cc <= rendifyItmes) {
					const simplifiedObj = {};
					ids.forEach(id => {
						if(obj.hasOwnProperty(id)) {
							if(id === 'images') {
								simplifiedObj['image'] = obj['images'][0]['url'];
							}
							else if(id === 'priceDaily') {
								simplifiedObj['price'] = obj['priceDaily'];
							}
							else if(id === 'rentDays') {
								simplifiedObj['days'] = daysRemap(obj['rentDays']);
							}
							else if(id === 'startTs' || id === 'endTs') {
								simplifiedObj[id] = genTime(obj[id]);
							}
							else {
								simplifiedObj[id] = obj[id];
							}
						}
					});
					rendifyData(simplifiedObj);
				}
			});		
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}
	else {
		console.error('Rendify.ee script stopped!');
	}
}
