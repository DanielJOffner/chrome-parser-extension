/*
LEGACY CODE
*/
// function to auto fill date fields on webpage
function autoFillDates(dates){
	for(i = 0; i < dates.length; i++){
		document.getElementById("datePaid-1".replace("1",i+1)).value = dates[i];
	}
	//after last date is entered, press calculate button on webpage
	//document.getElementById("calcButton").click(); //
}

//function to auto fill payment fields on webpage
function autoFillPayments(payments){
	for(i = 0; i < payments.length; i++){
		document.getElementById("addPart").click(); //click button on webpage to add new part payment
		document.getElementById("amountPaid-1".replace("1",i+1)).value = payments[i];
	}
}

// //listens for incomming messages from popup.js
chrome.runtime.onMessage.addListener(function(message){
  	try{
		var Array = message.split(",");  //declare the imcomming message
		if(Array[0] == "dates"){
			Array.shift(); 	//remove the identifier from position [0]
			Array.reverse(); //reverse order so oldest dates appear first
			autoFillDates(Array);
		}
		if(Array[0] == "payments"){
			Array.shift();//remove identifier from position [0]
			Array.reverse(); // reverse order so oldest payments appear first
			autoFillPayments(Array);
		}
	} catch (e){
		
	}
});
/*
END LEGACY CODE 
*/
const add_part_payment_btn = document.querySelector('#addPart')

// Listen for incomming messages
chrome.runtime.onMessage.addListener(function(message){
	try{
		let input = message // Declare the imcomming message
		if(input[0] == "new-payments"){
			input.shift() // Remove head
			input.pop() // Remove checksum
			input.reverse() // revese order (so that least recent payments are first)
			auto_fill_form(input)
		}
	}catch (e) {

	}
});


function get_dom_from_index(i){
	add_part_payment_btn.click() // Click the button to get the next form element
	i++ // Form elements index from 1
	return {
		date_el: document.querySelector('#datePaid-1'.replace("1",i)),
		amount_el: document.querySelector('#amountPaid-1'.replace("1",i)),
	}
}

function auto_fill_form(payments){
	for(i = 0; i < payments.length; i++){
		let form = get_dom_from_index(i)
		form.date_el.value = payments[i].date
		form.amount_el.value = payments[i].amount	
	}
}




