let pageIndexMismatchError = "Index mismatch error";
let answersmissing = "Answers not available in local storage";





// decides which method to load based on the last known value of the index variable in local storage
const main = () => {
  let index = localStorage.getItem("index");
  if (index === undefined) {
    throw "undefined";
  }
  if (index !== null) {
    genrateQnA(index, index);
  } else {
    loadFirst();
  }
};





// loads the first page of the feedback form. Button is "not-allowed" until the fetch call is successful
const loadFirst = async () => {
  controlDisplay("flex", "none", "none");
  let proceedButton = document.getElementById("proceed-btn");
  disableProceedButton(proceedButton);
  let questions = await fetchQuestions();
  localStorage.setItem("questions", JSON.stringify(questions));
  let answers = [];
  answers = setDefaultAnswers(questions, answers);
  localStorage.setItem("answers", answers);
  enableProceedButton(proceedButton);
};





const fetchQuestions = () => {
  let questions = fetch(
    "https://my-json-server.typicode.com/Sairam-Aravind/FreshFruits/questions"
  )
    .then(handleErrors)
    .then(response => response.json())
    .then(json => json);
  return questions;
};






const handleErrors = response => {
  if (!response.ok) {
    notifyUsers();
    throw response.statusText;
  }
  return response;
};





const setDefaultAnswers = (questions, answers) => {
  for (i = 0; i < questions.length; i++) {
    switch (questions[i].type) {
      case "rating": {
        answers.push(10);
        break;
      }
      case "boolean": {
        answers.push(true);
        break;
      }
      case "text": {
        answers.push(null);
        break;
      }
      default: {
        break;
      }
    }
  }
  return answers;
};
//module.exports = setDefaultAnswers






// this method controls the entire content that is rendered apart from the first page. 
// it removes the contents of the old tag and replaces them with new tags based on the questions json
// a div called tab container is created according the question and the answer type. 
//this gets rendered again on choosing a different answer
const genrateQnA = (prevIndex, index) => {
  let question = JSON.parse(localStorage.getItem("questions"));
  if (
    parseInt(index) > question.length ||
    parseInt(prevIndex) > question.length
  ) {
    console.log(pageIndexMismatchError);
    notifyUsers();
    throw pageIndexMismatchError;
  }
  controlDisplay("none", "flex", "none");
  let answers = localStorage.getItem("answers");
  if (answers === null || answers === undefined) {
    console.log(answersmissing);
    notifyUsers();
    throw answersmissing;
  }
  answers = answers.split(",");
  document.getElementById("question").innerHTML = question[index].question;
  let previousQuestionType = question[prevIndex].type;
  let questionType = question[index].type;
  removePrevContent(previousQuestionType);
  createTabContainerDiv(question, index, answers, questionType)
  document.getElementById(questionType).style.display = "flex";
  let length = question.length - 1;
  updateNextButton(length, index);
};





const createTabContainerDiv = (question, index, answers, questionType) => {
  let tabContainerdiv = document.createElement("div");
  tabContainerdiv.id = questionType;
  tabContainerdiv = genrateHTMLTags(tabContainerdiv, question, index, questionType, answers)
  tabContainerdiv = setClassName(tabContainerdiv, questionType);
  placeTabContainerDiv(tabContainerdiv)
}





const placeTabContainerDiv = (tabContainerdiv) => {
  let navButton = document.getElementsByClassName("nav-button-container")[0];
  document
    .getElementById("survey-container")
    .insertBefore(tabContainerdiv, navButton);
}





const genrateHTMLTags = (tabContainerdiv, question, index, questionType, answers) => {
  if (questionType === "text") {
    let div = document.createElement("div");
    div.className = `${questionType}-item`;
    let element = createtextelement();
    if (answers[index] !== "") {
      element.value = answers[index]
      element.placeholder = ""
    }
    element.addEventListener("change", function () {
      onPerformAction(answers, this.value, index);
    });
    div.append(element);
    tabContainerdiv.append(div);
  } else {
    question[index].options &&
      question[index].options.map(option => {
        let div = document.createElement("div");
        div.className = `${questionType}-item`;
        if (questionType === "boolean") {
          div.style.marginBottom = "58px";
        }
        elements = createRadioElement(option, questionType, index, answers);
        if (elements[2]) {
          div.className = "selected-tab"
        }
        element = elements[0];
        div.append(element);
        div.append(elements[1]);
        tabContainerdiv.append(div);
      });
  }
  return tabContainerdiv
};





const createRadioElement = (option, questionType, index, answers) => {
  let selectedTabflag = false
  element = document.createElement("input");
  element.type = "radio";
  element.id = option.points || option.value;
  let label = document.createElement("label");
  label.innerHTML = option.text;
  if (questionType === "boolean") {
    element.name = "boolean";
    element.value = option.value;
    label.value = option.value;
  }
  if (questionType === "rating") {
    element.name = "ratings";
    element.value = option.points;
    label.value = option.points;
    label.addEventListener("click", function () {
      onPerformAction(answers, this.value, index);
      genrateQnA(index, index);
    });
  }
  if (element.id === answers[index]) {
    element.checked = "true";
    if (questionType === "rating") {
      selectedTabflag = true
    };
  }
  element.addEventListener("click", function () {
    onPerformAction(answers, this.value, index);
    genrateQnA(index, index);
  });
  return [element, label, selectedTabflag];
};
//module.exports = createRadioElement





const createtextelement = () => {
  element = document.createElement("textarea");
  element.name = "comments";
  element.id = "text";
  element.cols = "75";
  element.rows = "10";
  element.style = "resize: none;";
  element.placeholder = "Add your answer here";
  return element;
};
////module.exports = createtextelement





const setClassName = (tabContainerdiv, type) => {
  switch (type) {
    case "rating": {
      tabContainerdiv.className = "tab-container";
      break;
    }
    case "boolean": {
      tabContainerdiv.className = "radio-button-container";
      break;
    }
    case "text": {
      tabContainerdiv.className = "text-area-container";
      break;
    }
    default: {
      tabContainerdiv.className = "changed";
    }
  }
  return tabContainerdiv;
};
////module.exports = setClassName





// navigation buttons
const onclickProceed = () => {
  localStorage.setItem("index", 0);
  controlDisplay("none", "flex", "none");
  genrateQnA(0, 0);
};





const disableProceedButton = proceedButton => {
  proceedButton.disabled = true;
  proceedButton.style.backgroundColor = "grey";
  proceedButton.style.cursor = "not-allowed";
};
////module.exports = disableProceedButton





const enableProceedButton = proceedButton => {
  proceedButton.disabled = false;
  proceedButton.style.backgroundColor = "#0F56B3";
  proceedButton.style.cursor = "pointer";
};
//module.exports = enableProceedButton





//Controls what happes on clicking the next button or submit button
const onClickNext = () => {
  let index = localStorage.getItem("index");
  let questions = JSON.parse(localStorage.getItem("questions"));
  if (parseInt(index) === questions.length - 1) {
    // on submit it removes all the data that is stored in the browser's local storage
    controlDisplay("none", "none", "flex");
    localStorage.setItem("index", index);
    let nextButton = document.getElementById("Next");
    if (nextButton.innerHTML === "Submit") {
      let answers = localStorage.getItem("answers");
      sendAnswers(answers);
      clearAll()
    }
  } else {
    genrateQnA(index, ++index);
    localStorage.setItem("index", index);
  }
};





const updateNextButton = (length, index) => {
  let nextButton = document.getElementById("Next");
  parseInt(index) === length
    ? (nextButton.innerHTML = "Submit")
    : (nextButton.innerHTML = "Next");
};
//module.exports = updateNextButton




const sendAnswers = (answers) => {
  console.log(answers);
  var data = new FormData();
  data.append("json", JSON.stringify(answers));
  //alert("reload the page if you wish to take the survey again")
  fetch(
    "https://my-json-server.typicode.com/Sairam-Aravind/FreshFruits/questions",
    {
      method: "POST",
      body: data
    }
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(JSON.stringify(data));
    });
  //sends the data for permanent storage
};






const onclickBack = () => {
  let index = localStorage.getItem("index");
  if (index < 1) {
    clearAll()
    loadFirst();
  } else {
    genrateQnA(index, --index);
    localStorage.setItem("index", index);
  }
};





const controlDisplay = (surveyStart, surveyContainer, surveyEnd) => {
  document.getElementById("survey-start").style.display = surveyStart;
  document.getElementById("survey-container").style.display = surveyContainer;
  document.getElementById("survey-end").style.display = surveyEnd;
};
//module.exports = controlDisplay





const notifyUsers = () => {
  alert("Sorry for the inconvenience, Contact the support team for assistance");
};
//module.exports = notifyUsers





const removePrevContent = type => {
  let oldTabContainer = document.getElementById(type);
  if (oldTabContainer !== null) {
    oldTabContainer.parentNode.removeChild(oldTabContainer);
  }
};
//module.exports = removePrevContent





const onPerformAction = (answers, value, index) => {
  answers[index] = value;
  localStorage.setItem("answers", answers);
};
//module.exports = onPerformAction





const clearAll = () => {
  localStorage.removeItem("index");
  localStorage.removeItem("questions");
  localStorage.removeItem("answers");
};
//module.exports = clearAll