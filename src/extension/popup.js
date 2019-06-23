const parse = PARSER 
const input = document.querySelector('#input')
const display_error = document.querySelector('#error')

// Global array to store payments data
let payments;

// Tell the user if the parser was succesful or not
function displayError(error){
	if(error){
		display_error.className = "error";
	}else{
		display_error.className = "success"
	}
}

// Listens for input events in the textarea 'input'
input.addEventListener('input', (e) =>{
	try{
		payments = parse(e.target.value)
	} catch (e) {
		displayError(true)
	}
})


// function to send Array to content script 'injected.js'
// the content script expects incomming messages to be an array where the first el
// is an identifier about what type of data is incoming.
function messageContentScript(payments){
	payments.push("new-payments")
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, payments + "");
	});
}
