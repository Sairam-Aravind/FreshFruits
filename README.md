# FreshFruits

          This is a basic front end UI of a feedback form for a fruit delivery
          
          This is developed using html css and js
          
          To check out the repo clone the repo and open the "index.html" file.
          
          the form collects the feedback from the user and post the answers. (a mock URL is used for this)
          
          the questions are loaded via a post method from the same repo. the questions are available in "db.json"
            
 ## Diffferent Methods
          "App.js"has all the required methods.The required data are stored in browser's local storage.
          
          main() - this is the onload method. it calls loadFirst() or genrateQnA based on the index value.
          
          the required data includes. "QUESTIONS", "INDEX" , ANSWERS"
          
          QUESTIONS- the questions which are got using a fetch call.
          
          INDEX- holds the current index value. used for page navigation and mapping questions along with answers
          
          ANSWERS - it stores all the responses. by default it assigns 10 for question type rating, true for question type boolean and null for question type text.
          
          "loadFirst()" - loads the first page or the welcome page of the feedback form. this is called when there is no question or index available in the localstorage.
          
          Navigation is handled via button.there are two types of buttons
          
          CONTAINED - This is used for moving forward along the form like proceed, Next, Submit
          
          OUTLINED - This is used for navigating backwards.
          
          onClickNext() - calls "generateQnA(previndex,index)" or calls "sendAnswers()" for the next button and submit button respectively
          
          onClickBack() - calls "genrateQnA(previndex,index)" or calls "loadFirst()" for the back button depending on the current index.
          
          genrateQnA(previndex,index) - this function creates all the html elements that are needed depending upon the question and question type.
          previndex is used to remove the contents of the previous question form "survey-container". index helps in adding the required questions.
          
          sendAnswers() - sends answers using post method. it also prints the answers in the console.
      
  ## Limitations
          uses the local storage of the browser for answers. This could be avoided by sending and receving deltas to servers
          
          This is best viewed in Mozilla Firefox browser
 ## References 
           Used "JSONServer-typicode- for hosting the Payload JSON
           
           https://developer.mozilla.org/en-US/docs/Web/JavaScript
           
           Design protoype - https://www.figma.com/proto/5xmGgoTkOcufGvzdDmOXIf/Material-X-Community-Copy?node-id=1355%3A288&scaling=contain
           
          


