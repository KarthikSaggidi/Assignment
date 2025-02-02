const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const nextButton = document.getElementById('next-button');
const resultsContainer = document.getElementById('results-container');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let questions = []; 
let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

async function fetchQuizData() {
    try {
        const response = await fetch('https://api.jsonserve.com/Uw5CrX');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid quiz data format received.");
        }

        questions = data; 
        console.log("Quiz data loaded successfully:", questions);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        alert("Failed to load quiz questions. Using default questions.");

        questions = [
            { question: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid", "Rome"], correctAnswer: "Paris" },
            { question: "Which planet is known as the 'Red Planet'?", options: ["Mars", "Jupiter", "Venus", "Saturn"], correctAnswer: "Mars" },
            { question: "What is the largest mammal in the world?", options: ["African Elephant", "Blue Whale", "Polar Bear", "Giraffe"], correctAnswer: "Blue Whale" }
        ];
    }
}

startButton.addEventListener('click', async () => {
    await fetchQuizData(); 
    startQuiz();
});

nextButton.addEventListener('click', handleNextQuestion);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
    startScreen.style.display = 'none';
    questionContainer.style.display = 'block';
    renderQuestion();
}

function renderQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        questionText.textContent = question.question;

        optionsList.innerHTML = ''; 

        question.options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => handleAnswerSelect(option));
            optionsList.appendChild(li);
        });

        nextButton.style.display = 'block'; 
    } else {
        showResults();
    }
}

function handleAnswerSelect(answer) {
    selectedAnswer = answer;
    const options = optionsList.querySelectorAll('li');
    options.forEach(option => {
        if (option.textContent === answer) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected'); 
        }
    });
}

function handleNextQuestion() {
    if (selectedAnswer !== null) { 
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            score++;
        }
        currentQuestion++;
        selectedAnswer = null; 
        renderQuestion();
    } else {
        alert("Please select an answer before proceeding."); 
    }
}

function showResults() {
    questionContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    finalScore.textContent = `Your final score: ${score} / ${questions.length}`;
    nextButton.style.display = 'none';
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    resultsContainer.style.display = 'none';
    startScreen.style.display = 'block'; 
}
