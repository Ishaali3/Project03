const quizDataUrl = "https://my-json-server.typicode.com/ishaali/project03/quizData"; // Mock API URL
let currentQuestionIndex = 0;
let studentName = "";
let quizData = [];
let score = 0;
let startTime;

document.getElementById("startQuizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    studentName = document.getElementById("studentName").value;
    const selectedQuiz = document.getElementById("quizSelect").value;
    loadQuizData(selectedQuiz);
});

async function loadQuizData(quizType) {
    try {
        const response = await fetch(quizDataUrl);
        quizData = await response.json();
        currentQuestionIndex = 0;
        score = 0;
        startTime = Date.now();
        renderQuestion();
    } catch (error) {
        console.error("Error loading quiz data:", error);
    }
}

function renderQuestion() {
    if (currentQuestionIndex < quizData.length) {
        const question = quizData[currentQuestionIndex];
        const source = document.getElementById("quizTemplate").innerHTML;
        const template = Handlebars.compile(source);
        const context = {
            questionText: question.question,
            answers: question.answers,
            currentQuestionIndex: currentQuestionIndex + 1,
            totalQuestions: quizData.length
        };
        document.getElementById("quizApp").innerHTML = template(context);
        setupAnswerEvents(question);
    } else {
        finishQuiz();
    }
}

function setupAnswerEvents(question) {
    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";
    question.answers.forEach((answer, index) => {
        const answerButton = document.createElement("button");
        answerButton.classList.add("btn", "btn-secondary", "m-2");
        answerButton.textContent = answer;
        answerButton.addEventListener("click", function() {
            evaluateAnswer(answer, question.correctAnswer);
        });
        answersContainer.appendChild(answerButton);
    });
}

function evaluateAnswer(selectedAnswer, correctAnswer) {
    const feedbackDiv = document.getElementById("feedback");
    if (selectedAnswer === correctAnswer) {
        score++;
        feedbackDiv.textContent = "Brilliant!";
        feedbackDiv.classList.remove("d-none");
        setTimeout(function() {
            feedbackDiv.classList.add("d-none");
            currentQuestionIndex++;
            renderQuestion();
        }, 1000);
    } else {
        feedbackDiv.textContent = `Sorry, the correct answer was: ${correctAnswer}`;
        feedbackDiv.classList.remove("d-none");
        const gotItButton = document.createElement("button");
        gotItButton.textContent = "Got it";
        gotItButton.classList.add("btn", "btn-info");
        gotItButton.addEventListener("click", function() {
            feedbackDiv.classList.add("d-none");
            currentQuestionIndex++;
            renderQuestion();
        });
        feedbackDiv.appendChild(gotItButton);
    }
}

function finishQuiz() {
    const timeTaken = (Date.now() - startTime) / 1000;
    const percentage = (score / quizData.length) * 100;
    let resultMessage = "";

    if (percentage >= 80) {
        resultMessage = `Congratulations, ${studentName}! You passed the quiz.`;
    } else {
        resultMessage = `Sorry, ${studentName}. You failed the quiz.`;
    }

    document.getElementById("quizApp").innerHTML = `
        <h2>${resultMessage}</h2>
        <p>Your score: ${score} / ${quizData.length}</p>
        <p>Time taken: ${timeTaken.toFixed(2)} seconds</p>
        <button onclick="startNewQuiz()">Retake Quiz</button>
    `;
}

function startNewQuiz() {
    document.getElementById("quizApp").innerHTML = `
        <h1>Welcome to the Online Quiz</h1>
        <form id="startQuizForm">
            <input type="text" id="studentName" placeholder="Enter your name" class="form-control" required>
            <select id="quizSelect" class="form-control" required>
                <option value="quiz1">Quiz 1: JavaScript Basics</option>
                <option value="quiz2">Quiz 2: Python Basics</option>
            </select>
            <button type="submit" class="btn btn-primary mt-3">Start Quiz</button>
        </form>
    `;
}
