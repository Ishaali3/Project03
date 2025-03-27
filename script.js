// Fetch quiz data
async function fetchQuizData() {
  const response = await fetch('https://my-json-server.typicode.com/yourusername/quiz-app/quizData');
  const data = await response.json();
  return data;
}

// Fetch questions based on selected quiz
async function fetchQuestions(quizId) {
  const response = await fetch(`https://my-json-server.typicode.com/yourusername/quiz-app/questions?quizId=${quizId}`);
  const data = await response.json();
  return data;
}

// Initialize Handlebars
const mainTemplate = Handlebars.compile(document.getElementById('main-template').innerHTML);
const quizTemplate = Handlebars.compile(document.getElementById('quiz-template').innerHTML);
const feedbackTemplate = Handlebars.compile(document.getElementById('feedback-template').innerHTML);
const resultsTemplate = Handlebars.compile(document.getElementById('results-template').innerHTML);

// Render main page
async function renderMain() {
  const quizData = await fetchQuizData();
  const html = mainTemplate({ quizzes: quizData });
  document.getElementById('app').innerHTML = html;
}

// Render quiz page
async function renderQuiz(quizId) {
  const questions = await fetchQuestions(quizId);
  let currentQuestionIndex = 0;
  let score = 0;

  function renderNextQuestion() {
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const html = quizTemplate({ question });
      document.getElementById('app').innerHTML = html;

      const options = document.querySelectorAll('.option-btn');
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          const answer = e.target.textContent;
          if (answer === question.correctAnswer) {
            score++;
            showFeedback(true);
          } else {
            showFeedback(false, question.explanation);
          }
        });
      });
    } else {
      renderResults();
    }
  }

  function showFeedback(isCorrect, explanation = '') {
    const feedbackHtml = feedbackTemplate({ isCorrect, explanation });
    document.getElementById('app').innerHTML = feedbackHtml;
    
    setTimeout(() => {
      currentQuestionIndex++;
      renderNextQuestion();
    }, 1000);
  }

  function renderResults() {
    const pass = score / questions.length > 0.8;
    const resultMessage = pass
      ? `Congratulations! You passed the quiz.`
      : `Sorry, you failed the quiz.`;
    const html = resultsTemplate({ score, resultMessage });
    document.getElementById('app').innerHTML = html;
  }

  renderNextQuestion();
}

// Start quiz when user selects a quiz
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('start-quiz-btn')) {
    const quizId = e.target.getAttribute('data-quiz-id');
    renderQuiz(quizId);
  }
});

// Render initial page
renderMain();
