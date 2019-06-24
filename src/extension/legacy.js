
//delcare global arrays for payments and dates
var dates = [];
var payments = [];

const parse = PARSER // In ./parse/parse.js PARSER is defined using window. 

// function to send Array to content script 'injected.js'
function messageContentScript(Array){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, Array + "");
	});
}

//function to remove '$' spaces and commas
function cleanPayment(Array){
	for(i=1; i < Array.length; i++){
		Array[i] = Array[i].replace("$","");
		Array[i] = Array[i].replace(" ","");
		Array[i] = Array[i].replace(",","");
	}
}

//function to convert dd-month-yy to dd/mmm/yyyy
function convertDateFormat(Array){
	for(i=1; i < Array.length; i++){
		var SplitString = Array[i].split("-"); //split d-m-yy into Array

		SplitString[0] = SplitString [0]; //no changes required to day format
		SplitString[1] = convertMonth(SplitString[1]);
		SplitString[2] = convertYear(SplitString[2]);

		Array[i] = SplitString[0]+"/"+SplitString[1]+"/"+SplitString[2];
	}
}

//converts yy to yyyy
//return yyyy
function convertYear(yy){
		return "20" + yy;
}

//function to change mmm to mm format
//returns mm
function convertMonth(mmm){
	var mm = "";
	switch (mmm){
		case "Jan":
				mm = "01";
				break;
		case "Feb":
				mm = "02";
				break;
		case "Mar":
				mm = "03";
				break;
		case "Apr":
				mm = "04";
				break;
		case "May":
				mm = "05";
				break;
		case "Jun":
				mm = "06";
				break;
		case "Jul":
				mm = "07";
				break;
		case "Aug":
				mm = "08";
				break;
		case "Sep":
				mm = "09";
				break;
		case "Oct":
				mm = "10";
				break;
		case "Nov":
				mm = "11";
				break;
		case "Dec":
				mm = "12";
				break;
	}
	return mm;
}

//Converts Data to two arrays and pushes to content script
function convertToArray(){
	//empty prevous values in global arrays
	dates = [];
	payments = [];

	//push identifer to first value in each array, this is so chrome messaging can differentiate the two
	dates.push("dates");
	payments.push("payments");

	var data = $('textarea[name=excel_data]').val();//convert textarea to array

	var rows = data.split("\n"); 	//split data into rows

	//split rows into dates and payments and add to global arrays
	for(var i in rows){
		var row = rows[i].split("\t");
		dates.push(row[0]);
		payments.push(row[1]);
	}

	//clean up empty field at the end of each array
	dates.pop(dates.length);
	payments.pop(payments.length);

	//call functions to clean up payments and convert date format
	cleanPayment(payments);
	//convertDateFormat(dates);

	//call function to send arrays to the content script running on the webpage
	messageContentScript(payments);
	messageContentScript(dates);


	//let res = parse("this is some text")
}

//event listener, when 'calculate' button is pressed run convertToArray() function
document.getElementById('onlyButton').addEventListener('click', convertToArray);
