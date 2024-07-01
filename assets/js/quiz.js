let questions = [];
fetch('questions/group1.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        startQuiz();
    });

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
            alert('Quiz terminé !');
            window.location.href = 'results.html';
        }
    };

    showQuestion(questions[currentQuestionIndex]);
}
