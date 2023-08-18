
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let mydata = JSON.parse(this.responseText);
            let numberofdata = mydata.length;

            createBullets(numberofdata)
            addQuestionData(mydata[currentIndex], numberofdata)

            countdown(6,numberofdata)

            ////////
            submitButton.onclick = function () {
                let rightanswer = mydata[currentIndex].right_answer
                currentIndex++;

                checkanswer(rightanswer, numberofdata);
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionData(mydata[currentIndex], numberofdata)
                handleBullets();
                clearInterval(countdownInterval)
                countdown(6,numberofdata)
                handleresult(numberofdata)

            }
        }
    };

    myRequest.open("GET", "main.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let h2 = document.createElement("h2")
        let h2content = document.createTextNode(obj.title)
        h2.appendChild(h2content);
        quizArea.appendChild(h2)

        for (let i = 1; i <= 4; i++) {
            let mydiv = document.createElement("div")
            mydiv.className = "answer";

            /////
            let inputradio = document.createElement("input");
            inputradio.type = "radio"
            inputradio.name = "question"
            inputradio.id = `answer_${i}`
            inputradio.dataset.answer = obj[`answer_${i}`];
            mydiv.appendChild(inputradio)
            /////
            let mylabel = document.createElement("label");
            mylabel.htmlFor = `answer_${i}`
            let labeltext = document.createTextNode(obj[`answer_${i}`])
            mylabel.appendChild(labeltext);
            mydiv.appendChild(mylabel)
            answersArea.appendChild(mydiv)
        }
    }

}

function checkanswer(ranswer, count) {
    let choosenanswer;
    let inputradio = document.getElementsByName("question")
    for (let i = 0; i < inputradio.length; i++) {

        if (inputradio[i].checked) {
            choosenanswer = inputradio[i].dataset.answer
        }
        if (ranswer === choosenanswer) {
            console.log("good")
            rightAnswers++;
        }
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function handleresult (count){
    if (currentIndex === count){
        quizArea.remove()
        answersArea.remove()
        bullets.remove()
        submitButton.remove()

        if ( rightAnswers > count/2 && rightAnswers < count ){
            let span = document.createElement("span")
            span.className = "good"
            let textspan = document.createTextNode( `your result is ${rightAnswers} from ${count}`)
            span.appendChild(textspan);
            resultsContainer.appendChild(span)
        }
        else if ( rightAnswers === count ){
            let span = document.createElement("span")
            span.className = "perfect"
            let textspan = document.createTextNode( `your result is ${rightAnswers} from ${count}`)
            span.appendChild(textspan);
            resultsContainer.appendChild(span)
        }
        else {
            let span = document.createElement("span")
            span.className = "bad"
            let textspan = document.createTextNode( `your result is ${rightAnswers} from ${count}`)
            span.appendChild(textspan);
            resultsContainer.appendChild(span)
        }
    }
}

function countdown (duration,count) {
    if (currentIndex < count){
        let minutes,seconds ;
        countdownInterval =  setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10  ? `0${minutes}` : minutes
            seconds = seconds < 10  ? `0${seconds}` : seconds
            countdownElement.innerHTML = minutes +":"+ seconds

            if(--duration < 0 ){
                clearInterval(countdownInterval);
                submitButton.click()
            }
        },1000)
    }
}
