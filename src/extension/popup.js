const parse = PARSER 
const input = document.querySelector('#input')
const go_button = document.querySelector('#go_button')
const display_error = document.querySelector('#error')

// Global array to store payments data
// If parsed, payment data is stored as an array of structs (objects)
let payments = []

// Wipe payments to empty array 
function clear_payments(){ payments = [] }

// Tell the user if the parser was succesful or not
function displayError(error){
	if(error){
		display_error.className = "error";
		display_error.innerHTML = "Error: failed to parse data"
	}else{
		display_error.className = "success"
		display_error.innerHTML = `Success: checksum $${0}`, get_check_sum()
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
go_button.addEventListener('click', (e) =>{ messageContentScript() })

// function to send Array to content script 'injected.js'
// the content script expects incomming messages to be an array where the first el
// is an identifier about what type of data is incoming.
function messageContentScript(){
	payments.unshift("new-payments") // Tell the content script that this is from the new version (not legacy code)
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, payments);
	});
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