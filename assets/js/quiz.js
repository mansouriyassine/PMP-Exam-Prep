// quiz.js - Updated to work with revised JSON structure

let questions = [];
let currentQuestionIndex = 0;

// Function to parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fetch questions based on selected group
function fetchQuestions(group) {
    console.log('Fetching questions for group:', group);
    return fetch(`questions/group${group}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Fetch response:', response);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid or empty question data');
            }
            console.log('Fetched data:', data);
            questions = data;
            startQuiz();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            document.getElementById('question-container').innerHTML = `<p>Error loading questions: ${error.message}. Please try again.</p>`;
        });
}

function startQuiz() {
    console.log('Starting quiz with questions:', questions);
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    const choices = [
        question.choice1,
        question.choice2,
        question.choice3,
        question.choice4
    ];
    questionContainer.innerHTML = `
        <h2>Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
        <h3>${question.question}</h3>
        ${choices.map((choice, index) => `
            <button onclick="selectAnswer(${index})">${choice}</button>
        `).join('')}
    `;
}

window.selectAnswer = function(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    currentQuestion.userAnswer = selectedIndex + 1; // Adjust for 1-based indexing in answers
    if (selectedIndex + 1 === currentQuestion.answer) {
        alert('Correct!');
    } else {
        const correctChoiceKey = `choice${currentQuestion.answer}`;
        alert(`Wrong! The correct answer was: ${currentQuestion[correctChoiceKey]}`);
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        handleQuizCompletion();
    }
};

function handleQuizCompletion() {
    const score = questions.reduce((acc, q) => acc + (q.userAnswer === q.answer ? 1 : 0), 0);
    const percentage = (score / questions.length) * 100;
    const resultMessage = `Quiz completed! Your score: ${score}/${questions.length} (${percentage.toFixed(2)}%)`;
    
    console.log(resultMessage);
    alert(resultMessage);

    // Display results in the question container
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>Quiz Results</h2>
        <p>${resultMessage}</p>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;
    
    // You can add logic here to save the score or redirect to a results page
    // For example: window.location.href = `results.html?score=${score}&total=${questions.length}`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    questions.forEach(q => delete q.userAnswer);
    startQuiz();
}

// Main logic to start quiz based on selected group
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    const selectedGroup = getUrlParameter('group');
    console.log('Selected group:', selectedGroup);
    if (selectedGroup) {
        fetchQuestions(selectedGroup);
    } else {
        console.error('No group selected');
        document.getElementById('question-container').innerHTML = `<p>No group selected. Please go back and choose a group.</p>`;
    }
});