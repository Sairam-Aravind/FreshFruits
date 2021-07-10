const createtextelement = require("./App");
test("creating text element", () => {
  let text = createtextelement()
  expect(text.id).toBe("text");
  expect(text.name).toBe("comments");
});

const controlDisplay = require("./App");
test("choosing the approriate display value for containers with respect to index", () => {
  let surveyStart = document.createElement("div");
  surveyStart.setAttribute("id", "survey-start");
  surveyStart.style.display = "block";
  document.body.appendChild(surveyStart);

  let surveyContainer = document.createElement("div");
  surveyContainer.setAttribute("id", "survey-container");
  surveyStart.style.display = "block";
  document.body.append(surveyContainer);

  let surveyEnd = document.createElement("div");
  surveyEnd.setAttribute("id", "survey-end");
  surveyStart.style.display = "block";
  document.body.append(surveyEnd);

  controlDisplay("none", "none", "flex");

  let surveyend = document.getElementById("survey-end");

  expect(surveyend.style.display).toBe("flex");
  expect(surveyStart.style.display).not.toBe("block");
});

const disableProceedButton = require("./App");
test("disable proceed button before fetch question completes", () => {
  let button = document.createElement("button");
  button.setAttribute("id", "proceed-btn");
  button.style.backgroundColor = "red";
  document.body.append(button);
  disableProceedButton(button);
  let proceedButton = document.getElementById("proceed-btn");
  expect(proceedButton).not.toBe("null");
  expect(proceedButton.disabled).toBe(true);
  expect(proceedButton.style.backgroundColor).toBe("grey");
  expect(proceedButton.style.cursor).toBe("not-allowed");
});

const enableProceedButton = require("./App");
test("enable proceed button after fetch question completes", () => {
  let button = document.createElement("button");
  button.setAttribute("id", "proceed-btn");
  button.style.backgroundColor = "red";
  button.disabled = true
  document.body.append(button);
  enableProceedButton(button);
  let proceedButton = document.getElementById("proceed-btn");
  expect(proceedButton).not.toBe("null");
  expect(proceedButton.disabled).toBe(false);
  expect(proceedButton.style.backgroundColor).toBe("rgb(15, 86, 179)");
  expect(proceedButton.style.cursor).toBe("pointer");
});

const setDefaultAnswers = require("./App");
test("setting default answer in the answers array for storing them in the local storage", () => {
  const questions = [{
    "type": "rating",
    "question": "How do you rate the delivery experience?",
    "options": [
      {
        "text": "Great",
        "points": "10"
      }]
  }]
  let answers = []
  answers = setDefaultAnswers(questions, answers)
  expect(answers["0"]).toBe(10)
})

const updateNextButton = require("./App");
test("updating Next Button for last question", () => {
  let button = document.createElement("button");
  button.setAttribute("id", "Next");
  button.innerHTML = "test"
  document.body.append(button)
  updateNextButton(3, 3)
  expect(button.innerHTML).toBe("Submit")
  updateNextButton(0, 3)
  expect(button.innerHTML).toBe("Next")
})

const notifyUsers = require("./App");
test("nofiying user incase of any error", () => {
  jest.spyOn(window, "alert")
  window.alert = jest.fn()
  notifyUsers()
  expect(alert).toHaveBeenCalled()
})

const onPerformAction = require("./App");
test("for any input check if the value is stored", () => {
  jest.spyOn(window.localStorage.__proto__, "setItem");
  window.localStorage.__proto__.setItem = jest.fn();
  let answers = ["10", "10", true, ""]
  let value = "10"
  let index = "0"
  onPerformAction(answers, value, index)
  expect(answers[index]).toBe("10")
  expect(localStorage.setItem).toHaveBeenCalled()
})

const removePrevContent = require("./App");
test("removing previous node", () => {
  let div = document.createElement("div");
  div.setAttribute("id", "test-rating")
  document.body.append(div)
  removePrevContent("test-rating")
  expect(document.getElementById("test-rating")).toBeNull()
  console.log(div)
})

const clearAll = require("./App")
test("removing the data from local Storage", () => {
  jest.spyOn(window.localStorage.__proto__, "removeItem");
  window.localStorage.__proto__.removeItem = jest.fn();
  clearAll()
  expect(localStorage.removeItem).toHaveBeenCalledTimes(3)
})

const setClassName = require("./App");
test("setting the class name for the div", () => {
  let div = document.createElement("div")
  div.setAttribute("id", "container")
  document.body.append(div)
  setClassName(div, "rating");
  expect(div.className).toBe("tab-container");
  setClassName(div, "boolean")
  expect(div.className).toBe("radio-button-container")
  setClassName(div, "text")
  expect(div.className).toBe("text-area-container")
  setClassName(div, "type")
  expect(div.className).toBe("changed")
})

const createRadioElement = require("./App");
test("creating a radio button", () => {
  let options = [{
    "options": [
      {
        "text": "Yes, Definitely",
        "value": false
      }
    ]
  }]
  let questionType = "boolean"
  let index = "2"
  let answers = ["10", "10", true, ""]
  let elements = createRadioElement(options, questionType, index, answers)
  expect(elements[2]).toBeFalsy()
})