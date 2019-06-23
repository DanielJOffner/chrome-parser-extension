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

//listens for incomming messages from popup.js
chrome.runtime.onMessage.addListener(function(message){

	//alert("message recieved");
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
});
/*
LEGACY CODE
*/




