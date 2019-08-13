const parse = PARSER 
const input = document.querySelector('#input')
const go_button = document.querySelector('#go_button')
const download_button = document.querySelector('#download_btn')
const copy_button = document.querySelector('#copy_btn')
const display_error = document.querySelector('#error')

// Global array to store payments data
// If parsed, payment data is stored as an array of structs (objects)
let payments = []

// Wipe payments to empty array 
function clear_payments(){ payments = [] }

// Tell the user if the parser was succesful or not
function displayError(error){
	if(error){
		download_button.style.display = "none"
		copy_button.style.display = "none"
		display_error.className = "error";
		display_error.innerHTML = "Error: failed to parse data"
	}else{
		download_button.style.display = "inline-block"
		copy_button.style.display = "inline-block"
		display_error.className = "success"
		display_error.innerHTML = `Success: checksum $${get_check_sum()}`
	}
}


// Get checksum of all payments
// Checksum is always the last objet in the array (after being parsed)
function get_check_sum(){
	let last_index = payments.length - 1
	let checkum = payments[last_index]
	return checkum.value
}

// Listens for input events in the textarea 'input'
input.addEventListener('input', (e) =>{
	clear_payments()
	try{
		payments = parse(e.target.value)
		displayError(false)
	} catch (e) {
		displayError(true)
	}
})

// Listens for events on the go button
go_button.addEventListener('click', (e) =>{ 
	messageContentScript() 
})

// Listens for events on the download button
download_button.addEventListener('click', (e) => {
	downloadToCVS()
})


// Listens for events on the copy button
copy_button.addEventListener('click', (e) => {
	copyToClipboard()
})

// function to send Array to content script 'injected.js'
// the content script expects incomming messages to be an array where the first el
// is an identifier about what type of data is incoming.
function messageContentScript(){
	payments.unshift("new-payments") // Tell the content script that this is from the new version (not legacy code)
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, payments);
	});
}

function downloadToCVS(){
	let csvArray = genCSVArray()
	let blob = new Blob(csvArray, {type: "text/csv"});
	let url = URL.createObjectURL(blob);
	chrome.downloads.download({
		url: url 
	});
}

function copyToClipboard(){
	navigator.clipboard.writeText(genClipboardText())
	.then(() => {
		console.log('Text copied to clipboard');
	})
	.catch(err => {
		// This can happen if the user denies clipboard permissions:
		console.error('Could not copy text: ', err);
	});
}


// Returns an array with the format
// ["Amount", ",", "Date", "\n"]
function genCSVArray(){
	let csvArray = []
	csvArray.push("Date",",","Amount","\n")
	payments.forEach(payment => {
		if(payment.type == "payment"){
			csvArray.push(
				payment.date,
				",",
				payment.amount,
				"\n"
			)
		}
	});
	return csvArray
}

function genClipboardText(){
	let clipboardText = ""
	payments.forEach(payment =>{
		if(payment.type == "payment"){
			amount = payment.amount
			date = payment.date
			clipboardText += `${date}\t${amount}\n`
		}
	})
	return clipboardText
}



// Dummy data for testing only
function fill_dummy_data(){
	payments = [{
		type: "payment",
		date: "20/06/2019",
		amount: "100.00",
		received: "20/06/2019"
  	},
	{
		type: "payment",
		date: "20/06/2019",
		amount: "100.00",
		received: "20/06/2019"
	},
	{
		type: "payment",
		date: "20/06/2019",
		amount: "100.00",
		received: "20/06/2019"
	},
	{
		type: "checksum",
		value: 10.40
	}]
}