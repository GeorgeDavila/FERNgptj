/*
async function NLG(textinput) {
    const stringAdd2 = document.getElementById('aiText').value
    alert(`Hi ${stringAdd2}`)
}

export default NLG; */

async function sanitizeInput(userInputString) {
	//Removes unwanted expressions and symbols from the input

	userInputString = userInputString.replaceAll("/(\r\n|\n|\r)/gm", "");
	userInputString = userInputString.replaceAll('\\n', ' ');

	userInputString = userInputString.replaceAll('  ', ' '); //Maybe take this out

	if (userInputString.slice(-1) === " "){
		userInputString = userInputString.slice(0,-1); //remove last character if last char is a space
	}

	return userInputString;
}


async function sanitizeOutput(aiOutputString) {
	//Removes unwanted expressions and symbols from the ai writing
	aiOutputString = aiOutputString.replaceAll("\n"," ");
	aiOutputString = aiOutputString.replaceAll("\\n"," ");
	aiOutputString = aiOutputString.replaceAll("\\","");

	return aiOutputString;
}

async function useLastSentence(inputText){
    var sentenceSplitArray = inputText.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g); //https://stackoverflow.com/questions/11761563/javascript-regexp-for-splitting-text-into-sentences-and-keeping-the-delimiter

    var result = sentenceSplitArray[sentenceSplitArray.length -1];

	//if (result.length > 60){}
    return result;
}

async function addOptions(data){
    let jsonPasser = {"inputs": data,
    "options": {
        "use_gpu": false, 
        "use_cache": false,
        "wait_for_model": false
    }};

    return jsonPasser;
}

async function NLG(data) {
	
	let userInputSanitized = await sanitizeInput( data );

    userInputSanitized = await addOptions(userInputSanitized);

	const response = await fetch(
		"https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B",
		{
			headers: { Authorization: "Bearer YOUR_API_KEY_HERE" },
			method: "POST",
			body: JSON.stringify(userInputSanitized),
		}
	);
    let result = await response.json();
    //console.log(result);

	result = await sanitizeOutput( JSON.stringify(result[0]["generated_text"]).slice(1, -1) ); //slice removes quotation marks
    console.log(result);

	return result;
}

export default NLG;
