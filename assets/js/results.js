// Fonction pour obtenir les paramètres de l'URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fonction pour afficher les résultats
function displayResults() {
    const score = parseInt(getUrlParameter('score'));
    const total = parseInt(getUrlParameter('total'));
    const timeTaken = parseInt(getUrlParameter('time'));
    const userAnswers = JSON.parse(getUrlParameter('answers'));
    const group = getUrlParameter('group');

    // Afficher le résumé
    const resultsSummary = document.getElementById('results-summary');
    resultsSummary.innerHTML = `
        <p class="text-xl mb-2">Your score: ${score} out of ${total}</p>
        <p class="text-lg mb-4">Time taken: ${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</p>
    `;

    // Charger et afficher les questions
    fetch(`questions/group${group}.json`)
        .then(response => response.json())
        .then(questions => {
            const questionReview = document.getElementById('question-review');
            questions.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;
                questionReview.innerHTML += `
                    <div class="mb-6 p-4 border rounded ${isCorrect ? 'bg-green-100' : 'bg-red-100'}">
                        <p class="font-bold mb-2">${index + 1}. ${question.question}</p>
                        <ul class="list-disc pl-5">
                            ${['choice1', 'choice2', 'choice3', 'choice4'].map((choice, i) => `
                                <li class="${i + 1 === question.answer ? 'text-green-700 font-bold' : ''} 
                                           ${i + 1 === userAnswer && !isCorrect ? 'text-red-700 line-through' : ''}">
                                    ${question[choice]}
                                    ${i + 1 === question.answer ? ' (Correct Answer)' : ''}
                                    ${i + 1 === userAnswer && !isCorrect ? ' (Your Answer)' : ''}
                                </li>
                            `).join('')}
                        </ul>
                        ${!isCorrect ? `<p class="mt-2 text-red-700">Your answer was incorrect. The correct answer is: ${question['choice' + question.answer]}</p>` : ''}
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('question-review').innerHTML = '<p>Error loading questions. Please try again.</p>';
        });
}

// Fonction pour recommencer le quiz
function retakeQuiz() {
    const group = getUrlParameter('group') || '1';
    window.location.href = `quiz.html?group=${group}`;
}

// Fonction pour choisir un autre groupe
function chooseAnotherGroup() {
    window.location.href = 'index.html';
}

// Exécuter ces fonctions quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    displayResults();
    document.getElementById('retake-btn').addEventListener('click', retakeQuiz);
    document.getElementById('choose-group-btn').addEventListener('click', chooseAnotherGroup);
});