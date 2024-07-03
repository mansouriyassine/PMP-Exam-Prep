import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const history = useHistory();
  const { selectedAnswers, questions } = location.state || { selectedAnswers: [], questions: [] };

  const handleRetakeClick = () => {
    history.push('/quiz');
  };

  const handleChooseAnotherGroupClick = () => {
    history.push('/question-groups');
  };

  return (
    <div>
      <h1>Quiz Results</h1>
      <button onClick={handleRetakeClick}>Retake the exam</button>
      <button onClick={handleChooseAnotherGroupClick}>Choose another group of questions</button>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <p>{question.question}</p>
            <p>Your answer: {selectedAnswers[index]}</p>
            <p>Correct answer: {question.correctAnswer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
