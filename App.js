// decides which method to load based on the last known value of the index variable in local storage
const main = () => {
    let index = localStorage.getItem("index")
    if (index!==null) {
        genrateQnA(index,index)
    } else {
        loadFirst()
    }
}
// loads the first page of the feedback form. Button is "not-allowed" until the fetch call is successful
const loadFirst = async() => {
    document.getElementById("survey-start").style.display = "flex"
    document.getElementById("survey-end").style.display = "none"
    document.getElementById("survey-container").style.display = "none"
    let proceedButton=document.getElementById("proceed-btn")
    proceedButton.style.backgroundColor = "grey"
    proceedButton.style.cursor = "not-allowed"
    let questions = await fetch('https://my-json-server.typicode.com/Sairam-Aravind/FreshFruits/questions')
    .then(response => response.json())
    .then(json => json)
    let answers = []
    localStorage.setItem("questions",JSON.stringify(questions))
    for(i=0;i<questions.length;i++) {
        switch (questions[i].type) {
            case "rating" : {
                answers.push(10)
                break
            }
            case "boolean" : {
                answers.push(true)
                break
            }
            case "text" : {
                answers.push(null)
                break
            }
        }
    }
    localStorage.setItem("answers",answers)
    proceedButton.disabled = false
    proceedButton.style.backgroundColor = "#0F56B3"
    proceedButton.style.cursor = "pointer"
}
// this method controls the entire content that is rendered apart from the first page. it removes the contents of the old tag and replaces them with new tags based on the questions json
const genrateQnA = (prevIndex,index) => {
    document.getElementById("survey-start").style.display = "none"
    document.getElementById("survey-container").style.display = "flex"
    document.getElementById("survey-end").style.display = "none"
    let question = JSON.parse(localStorage.getItem("questions"))
    let answers = localStorage.getItem("answers")
    answers = answers.split(",")
    document.getElementById("question").innerHTML = question[index].question
    let oldTabContainer = document.getElementById(question[prevIndex].type)
    if(oldTabContainer != null) {
    oldTabContainer.parentNode.removeChild(oldTabContainer) 
    }
    // a div called tab container is created according the question and the answer type. this gets rendered again on choosing the different answer
    let tabContainerdiv = document.createElement('div')
    tabContainerdiv.id = question[index].type
    let element;
    if(question[index].type === 'text') {
        let div = document.createElement('div')
        div.className = `${question[index].type}-item`
        element = document.createElement('textarea')
        element.name = 'comments'
        element.id = 'text'
        element.cols = '75'
        element.rows = '10'
        element.style = "resize: none;"
        element.placeholder = "Any Comments"
        element.addEventListener('change', function() {
            answers[index] = this.value
            localStorage.setItem("answers",answers)
        });
        div.append(element)
        tabContainerdiv.append(div)
    } else {
        question[index].options && 
        question[index].options.map(option => {
        let div = document.createElement('div')
        div.className = `${question[index].type}-item`
        element=document.createElement('input')
        element.type = 'radio'
        element.id = option.points || option.value
        let label = document.createElement('label')
        label.innerHTML = option.text
        if (question[index].type==='boolean') {
            div.style.marginBottom = '58px'
            element.name = "boolean"
            element.value = option.value
            label.value = option.value
        }
        if(question[index].type === 'rating') {
            element.name = "ratings"
            element.value = option.points
            label.value = option.points
            label.addEventListener('click', function() {
                answers[index] = this.value
                localStorage.setItem("answers",answers)
                genrateQnA(index,index)
            });
        }
        if(element.id === answers[index]) {
            element.checked = 'true'    
            if(question[index].type==='rating')
            div.className = "selected-tab"
        }
        element.addEventListener('click', function() {
            answers[index] = this.value
            localStorage.setItem("answers",answers)
            genrateQnA(index,index)
        });
        div.append(element)
        div.append(label)
        tabContainerdiv.append(div)
        })
        switch (question[index].type) {
            case "rating" : {
                tabContainerdiv.className = 'tab-container'
                break
            }
            case "boolean": {
                tabContainerdiv.className = 'radio-button-container'
                break
            }
            case "text": {
                tabContainerdiv.className = 'text-area-container'
                break
            }
        }
}
    let navButton = document.getElementsByClassName("nav-button-container")[0]
    document.getElementById("survey-container").insertBefore(tabContainerdiv,navButton)
    document.getElementById(question[index].type).style.display = "flex"
    let length = question.length-1
    let nextButton = document.getElementById("Next")
    parseInt(index)===length? nextButton.innerHTML = "Submit" : nextButton.innerHTML = "Next"
}
const onclickProceed = () => {
    localStorage.setItem("index",0)
    document.getElementById("survey-start").style.display = "none"
    document.getElementById("survey-container").style.display = "flex"
    document.getElementById("survey-end").style.display = "none"
    genrateQnA(0,0)
}

//Controls what happes on clicking the next button or submit button
const onClickNext = () => {
   let index = localStorage.getItem("index")
   let questions = JSON.parse(localStorage.getItem("questions"))
   if(parseInt(index)===questions.length-1){
    // on submit it removes all the data that is stored in the browser's local storage
    document.getElementById("survey-start").style.display = "none"
    document.getElementById("survey-container").style.display = "none"
    document.getElementById("survey-end").style.display = "flex"
    localStorage.setItem("index",index)
    let nextButton = document.getElementById("Next")
    if(nextButton.innerHTML === "Submit") {
        localStorage.removeItem("index")
        localStorage.removeItem("questions")
        let answers = localStorage.getItem("answers")
        sendAnswers(answers)
        localStorage.removeItem("answers")

    }
   } else {
    genrateQnA(index,++index)
    localStorage.setItem("index",index)
   }
}

const onclickBack = () => {
    let index = localStorage.getItem("index")
    if(index<1){
        localStorage.removeItem("index")
        localStorage.removeItem("questions")
        localStorage.removeItem("answers")
        loadFirst()
    } else {
    genrateQnA(index,--index)
    localStorage.setItem("index",index)
    }
}

const sendAnswers = (answers) => {
    console.log(answers)
    var data = new FormData();
    data.append( "json", JSON.stringify(answers) );
    fetch("https://my-json-server.typicode.com/Sairam-Aravind/FreshFruits/questions",
    {
    method: "POST",
    body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ alert( JSON.stringify( data ) ) })
    //sends the data for permanent storage
}