class Question {
    // DATA
    constructor(title, options, correctAnswerIndex) {
        this.title = title;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.id = 1;
    }

    // METHODS
    isCorrect(userAnswer) {
        return this.options[this.correctAnswerIndex] === userAnswer;
    }
    getCorrectAnswer() {
        return this.options[this.correctAnswerIndex];
    }
    createUI(index,questions) {
        if(index !== 1) {
            note.style.display = "none";
        }

        return `
        <div>
            <div class="progress-bar">
                <p>Question: ${index}/${questions.length} </p>
                <progress max="100" value=${(100 / questions.length)*index}></progress>
            </div>
        <form>
        <legend>${this.title}</legend>
        <div>
            ${this.options
              .map(
                option => `
                  <div class="option-list">
                                <input type="radio" class="toggle" id=${
                                  this.id
                                } name="option" value=${option}>
                                <label for=${this.id} class="label">
                                    <div class="options">
                                        <label for=${this
                                          .id++} class="text">${option}</label>
                                    </div>
                                </label>
                                </div>
                                `
              )
              .join("")}
        </div>
        
        </form>
        
        `;
    }
}
let questionsArr = [
  {
    title: "What is the capital of Mongolia?",
    options: ["Ulaanbaator", "Rabat", "Nairobi", "Maputo"],
    isCorrect: 0
  },
  {
    title: "What is the capital of Oman?",
      options: ["Dakar", "Amman", "Muscat", "Bishkek"],
    isCorrect: 2
  },
  {
      title: "What is the capital of Sweden?",
      options: ["Lome", "Stockholm", "Tunis", "Bern"],
    isCorrect: 1
  },
  {
      title: "What is the capital of Ukraine?",
      options: ["Kyiv", "Damascus", "Lasaka", "Taipei"],
    isCorrect: 0
  },
  {
      title: "What is the capital of Iceland?",
      options: ["Dublin", "Budapest", "Reykjavik", "Pyongyang"],
      isCorrect: 2
  },
  {
      title: "What is the capital of Jamaica?",
      options: ["Seoul", "Kingston", "Port-Luis", "San Salvador"],
      isCorrect: 1
  },
  {
      title: "What is the capital of Colombia?",
      options: ["Baku", "Bogota", "Beirut", "Bucharest"],
      isCorrect: 1
  },
  {
      title: "What is the capital of Norway?",
      options: ["PortLuis", "Kigali", "Maputo", "Oslo"],
      isCorrect: 3
  },
  {
      title: "What is the capital of Australia?",
      options: ["Sydney", "Canberra", "Melbourne", "Perth"],
      isCorrect: 1
  },
  {
      title: "What is the capital of Denmark?",
      options: ["Quito", "Manila", "Hanoi", "Copenhagen"],
      isCorrect: 3
  }
];
let questionsArrMapped = questionsArr.map(question => new Question(question.title, question.options, question.isCorrect))
    
    

let nextBtn = document.querySelector(".btn");
let root = document.getElementById("root");
let restartBtn = document.querySelector(".restart-btn");
let displayScore = document.querySelector(".final-score");
let errorMsg = document.querySelector(".error")
let optionsList = document.querySelector(".options")
let comment = document.querySelector(".comment")
let tbody = document.querySelector("tbody");
let tfoot = document.querySelector("tfoot");
let table = document.querySelector(".table");
let resultText = document.querySelector(".result-text");
let totalCorrect = document.querySelector(".total-correct");
let totalWrong = document.querySelector(".total-wrong");
let note = document.querySelector(".note")
let counterCorrect = 0;
let counterWrong = 0;
let sst = localStorage.getItem("storeSst") ? JSON.parse(localStorage.getItem("storeSst")) : [];
const NEGATIVE_MARKS = 0.5;

class Quiz {
    constructor(rootElm, nextElm, questions) {
        this.questions = questions;
        this.rootElm = rootElm;
        this.nextElm = nextElm;
        this.activeQuestionIndex = localStorage.getItem("quiz")
          ? JSON.parse(localStorage.getItem("quiz"))
          : 0;
        this.score = localStorage.getItem("score") ? JSON.parse(localStorage.getItem("score")) : 0;
    }
    nextQuestion(activeQuestionIndex, userSelectedAns) {
        errorMsg.innerText = "";
        userSelectedAns = userSelectedAns;
        this.updateTableSst(userSelectedAns);
        this.activeQuestionIndex = this.activeQuestionIndex+1;
        localStorage.setItem("quiz", JSON.stringify(this.activeQuestionIndex))
        if (this.activeQuestionIndex >= this.questions.length) {
            this.displayResult();
            return;
        }
        this.rootElm.innerHTML = this.questions[
          this.activeQuestionIndex
        ].createUI(this.activeQuestionIndex + 1, this.questions);

        window.addEventListener("load", instantiatefn);
    }

    updateTableSst(userSelectedAns) {
        let tableContent = {
            title: this.questions[this.activeQuestionIndex].title,
            correctAnswer: this.questions[this.activeQuestionIndex].getCorrectAnswer(),
            userAnswer: userSelectedAns
        }
        sst.push(tableContent);
        localStorage.setItem("storeSst", JSON.stringify(sst))
    }

    createTableUI(data=sst, root=tbody) {
        root.innerHTML = "";
        data.forEach (tableContent => {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td")
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");
            td1.innerText = tableContent.title
            td2.innerText = tableContent.correctAnswer;
            td3.innerText = tableContent.userAnswer;
            if (td2.innerText === td3.innerText) {
                counterCorrect++;
                let correct = document.createElement("i");
                correct.className = "far fa-check-circle";
                td4.append(correct);
            } else {
                counterWrong++;
                let wrong = document.createElement("i");
                wrong.className = "far fa-times-circle";
                td4.append(wrong);
            }
            root.append(tr);
            tr.append(td1, td2, td3, td4);
            totalCorrect.innerText = `${counterCorrect}`;
            totalWrong.innerText = `${counterWrong}`
        })
    }

    displayResult() {
        table.style.display = "block";
        this.createTableUI();
        this.rootElm.style.display = "none";
        this.nextElm.style.display = "none";
        displayScore.innerText = `Score: ${this.score}`;
        if (this.score <= 3) {
            comment.innerText = "Poor!! You need to Work Hard!!";
            comment.style.color = "red";
        } else if (this.score > 3 && this.score < 7) {
            comment.innerText = "Good!! But need to go through the Concepts thoroughly!!"
            comment.style.color = "rgb(243, 210, 63)";
        } else {
            comment.innerText = "Excellent!! Keep up the Good Work!!"
            comment.style.color = "green";
        }
        resultText.style.display = "block";
        resultText.innerText = "Questionwise Analysis:"
        restartBtn.style.display = "block";
        restartBtn.innerText = "Retake the Quiz"
        restartBtn.addEventListener("click", restartFn)
        localStorage.clear();
    }

    rootUI(negativeMarks = 0) {
        this.rootElm.style.display = "block";
        this.nextElm.style.display = "block";
       
        this.nextElm.addEventListener("click", () => {
            
            let inputs = document.querySelectorAll("input");
            let selectedInput = [...inputs].filter((input) => {
                return input.checked
            });
            if (!selectedInput[0]) {
                errorMsg.innerText = "Select an Answer to go forward!";
                return;
            }
            const currentQuestion = this.questions[this.activeQuestionIndex];
            
            if (currentQuestion.isCorrect(selectedInput[0].value)) {
                this.score++;
            } else {
                this.score = this.score - negativeMarks;
            }
            localStorage.setItem("score", JSON.stringify(this.score))
            this.nextQuestion(this.activeQuestionIndex, selectedInput[0].value)
        });
        
        this.rootElm.innerHTML = this.questions[
          this.activeQuestionIndex
        ].createUI(this.activeQuestionIndex + 1, this.questions);
        resultText.style.display = "none";
        restartBtn.style.display = "none";
        displayScore.innerText = "";
        comment.innerText = "";
        table.style.display = "none";
    }
}



let quiz = new Quiz(root, nextBtn, questionsArrMapped);
    quiz.rootUI(NEGATIVE_MARKS); 

function restartFn() {
    instantiatefn()
    sst =[];
}

function instantiatefn() {
    let quiz = new Quiz(root, nextBtn, questionsArrMapped);
    quiz.rootUI(NEGATIVE_MARKS);
}
    