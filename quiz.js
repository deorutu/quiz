(function () {
	var questionsObject = {}; // holds all the questions as an object from JSON file
	var currQuestionObject = {}; 
	var currentQuestion = 0; 
	var numberOfQuestions = 0;
	var answerSelected = []; // array to hold the user's selection for each question
	var elementSubmit = document.getElementById("submit"); // grab the buttons so we can use them
	var elementBack = document.getElementById("back");

	// fetch the required JSON file and when it's properly loaded, run the specified function
	function fetchJSONFile(path, callback) {
	    var httpRequest = new XMLHttpRequest();
	    httpRequest.onreadystatechange = function() {
	        if (httpRequest.readyState === 4) {
	            if (httpRequest.status === 200) {
	                var data = JSON.parse(httpRequest.responseText);
	                if (callback) callback(data);
	            }
	        }
	    };
	    httpRequest.open('GET', path);
	    httpRequest.send(); 
	}

	// build the current question text
	function buildQuestion(currQuestion){
		currQuestionObject = questionsObject.questions[currQuestion];
		var i;

		$("#questionsText").fadeOut(function () {
			var newQuestionText = "";
			newQuestionText += currQuestionObject.question + "<br>";
			
			for (i = 0, len = currQuestionObject.choices.length; i < len; i += 1){
				newQuestionText += "<input type = 'radio' name = 'choice' id = 'choice" + i + "'><label for = 'choice" + i + "'>" + currQuestionObject.choices[i] + "</label><br>";
			}
			
			$("#questionsText").html(newQuestionText).fadeIn();

			if (answerSelected[currentQuestion] != undefined) {
				var elemAnswerSelected = document.getElementById("choice" + answerSelected[currentQuestion]);
				elemAnswerSelected.checked = true;
			}

		});
	}

	elementSubmit.onclick = function (e) {
		if (!e) e = window.event;
		if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

		var inputElements = document.getElementsByTagName("input");
		var numOfRadioButtons = inputElements.length - 2; // remove submit and back button
		var isAChoiceMade = false;
		var j;

		for (j = 0; j < numOfRadioButtons; j += 1){
			if (inputElements[j].checked == true) {
				answerSelected[currentQuestion] = j;
				isAChoiceMade = true;
			}
		}

		if (isAChoiceMade) {
			currentQuestion += 1;

			if (currentQuestion < numberOfQuestions) {
				buildQuestion(currentQuestion);
			}
			else {
				var questionsForm = document.getElementById("questionsForm");
				var quizCompletedText = document.createElement("div");
				var correctAnswers = 0;
				var k;

				for (k = 0; k < numberOfQuestions; k += 1){
					if (answerSelected[k] == questionsObject.questions[k].correctAnswer) {
						correctAnswers += 1;
					}
				}

				quizCompletedText.innerHTML = "<p>Quiz completed. Your score is " + correctAnswers + "</p>";	
				questionsForm.appendChild(quizCompletedText);
			}
		}
		else {
			alert("Please enter a choice to continue.");
		}
	};

	elementBack.onclick = function (e) {
		if (!e) e = window.event;
		if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
		
		if (currentQuestion > 0) {	
			currentQuestion -= 1;
			buildQuestion(currentQuestion);
		}					
	}

	// begin by fetching the questions JSON file and instantiate the questionsObject, then build the first question
	fetchJSONFile('questions.json', function(data){
	    questionsObject = data; // instantiate the questions object
	    numberOfQuestions = questionsObject.questions.length; // we need to know how many questions there are
	    buildQuestion(currentQuestion); // build the first question, currentQuestion is currently set to 0
	});

})();