/*
Accepts raw input, returns an array of payments as struct
{
	type: String
    date: String
    amount: String
    received: String
}
EG.
{
      "type": "payment",
      "date": "20/06/2019",
      "amount": "100.00",
      "received": "20/06/2019"
}

The last item in the array is always a checksum of type 'checksum'
{
	type: "checksum"
    value: float
}
*/
{
	function flatten(array){
    	return array.flat()
	}
    // Remove "$" in payment data
    function clean_payments(array){
		array.forEach(function(el){
        	if(el.amount){
				el.amount = el.amount.replace(/\$/g,"") // global replace '/char/g'
                el.amount = el.amount.replace(/,/g,"") // replaces all instances of char
            }
        })
        return array
    }
    // Merge rows so that the type and amount are in the same struct
    function merge_rows(array){
    	let merged_array = []
        let i
        for(i = 0; i < array.length-1; i=i+2){
        	let row1 = array[i]
            let row2 = array[i+1]
            row1.amount = row2.amount
            row1.received = row2.received
            merged_array.push(row1)
        }
        return merged_array
    }
    // Remove anything that is NOT of type 'dishonour payment' or 'payment' or 'payment from client'
    function filter_types(array){
    	return array.filter(el => el.type == "dishonour payment" || el.type == "payment" || el.type == "payment from client")
    }
    // If a payment has dishonoured, set type to 'dishonour payment'
    // Payments alays appear in the same order
    function label_dishonours(array){
    	let i
        for(i = 0; i < array.length-1; i++){
        	if(array[i].type == 'dishonour payment'){
            	array[i+1].type = 'dishonour payment'
                i++
            }
        }
        return array
    }
    
    // Remove dishonours
    function remove_dishonours(array){
		return array.filter(el => el.type != 'dishonour payment')
    }
    
    function add_checksum(array){
    	let sum = 0.0
        let i
        for(i = 0; i < array.length; i++){
        	sum += parseFloat(array[i].amount)
        }
        array.push({
        	type: "checksum",
            value: sum
        })
        return array
    }
}

start 
= res:row+ 
{
	let raw = res 
    raw = flatten(raw)
    raw = clean_payments(raw)
    raw = merge_rows(raw)
    raw = filter_types(raw)
    raw = label_dishonours(raw)
    raw = remove_dishonours(raw)
    raw = add_checksum(raw)
	return raw
}

row = str:(date_type_method/receiptID_amount_recieved)+ (newline/endInput) {return str}

date_type_method 
	= d:date _ t:type not_newline* { return {type: t, date: d, amount: undefined, received: undefined}}
receiptID_amount_recieved 
	= number _ p:payment _ d:date_recieved not_newline* {return {type: "amount", date:undefined, amount:p, received: d}}

date_recieved 
	= d:(date/"")
    { 
    	if(d == ""){
    		return undefined
        }else{
        	return d
        }
    }
date = n:(number"/"number"/"number) { return n.join("")}
payment = p:(("$"/"-$")dollars"."cents) {return p.join("")}

cents = number

dollars
	= 
    d:(
    number","number","number
    /number","number
    /number
    ) {return d}
type 
	= 
    type:(
    text+ " " text+ " " text+
    /text+ " " text+
    /text+
    ) {return type.join("").toLowerCase() }
    
number = digits:[0-9]+ { return digits.join("") }
text = str:[a-z]i+ {return str.join("")}    

newline = [\n]
not_newline = [^\n]
endInput = ""

_ "whitespace" = [ \t\r]*