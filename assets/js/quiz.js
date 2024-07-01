// quiz.js

let questions = [];

// Function to parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fetch questions based on selected group
function fetchQuestions(group) {
    return fetch(`questions/group${group}.json`) // Adjust filename format if needed
        .then(response => response.json())
        .then(data => {
            questions = data;
            startQuiz();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function startQuiz() {
    let currentQuestionIndex = 0;
    const questionContainer = document.getElementById('question-container');

    function showQuestion(question) {
        questionContainer.innerHTML = `
            <h2>${question.question}</h2>
            ${question.choices.map((choice, index) => `
                <button onclick="selectAnswer(${index})">${choice}</button>
            `).join('')}
        `;
    }

    window.selectAnswer = function(selectedIndex) {
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (selectedIndex === correctAnswer) {
            alert('Correct!');
        } else {
            alert('Wrong!');
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            alert('Quiz completed!');
            window.location.href = 'results.html';
        }
    };

    showQuestion(questions[currentQuestionIndex]);
}

// Main logic to start quiz based on selected group
document.addEventListener('DOMContentLoaded', function() {
    const selectedGroup = getUrlParameter('group');
    if (selectedGroup) {
        fetchQuestions(selectedGroup);
    }
});
