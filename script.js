const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const typeSelect = document.getElementById('type-select');
const generateTriviaBtn = document.getElementById('generate-trivia-btn');
const triviaQuestionsContainer = document.getElementById('trivia-questions');
const scoreContainer = document.getElementById('score');
const scoreValue = document.getElementById('score-value');
const newTriviaBtn = document.getElementById('new-trivia-btn');
const finishTriviaBtn = document.getElementById('finish-trivia-btn');

let triviaQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Obtener las categorías de la API y poblar el selector de categorías
fetch('https://opentdb.com/api_category.php')
  .then(response => response.json())
  .then(data => {
    const categories = data.trivia_categories;
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  });

// Event listener para el botón "Generar Trivia"
generateTriviaBtn.addEventListener('click', () => {
  const categoryId = categorySelect.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;

  // Limpiar preguntas y puntaje previos
  triviaQuestions = [];
  currentQuestionIndex = 0;
  score = 0;
  triviaQuestionsContainer.innerHTML = '';
  scoreContainer.style.display = 'none';

  // Obtener preguntas de la API según los parámetros seleccionados
  fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=${type}`)
    .then(response => response.json())
    .then(data => {
      triviaQuestions = data.results;
      showQuestion();
      generateTriviaBtn.disabled = true;
      finishTriviaBtn.disabled = false;
    })
    .catch(error => console.error(error));
});

// Event listener para el botón "Finalizar Trivia"
finishTriviaBtn.addEventListener('click', () => {
  finishTrivia();
});

// Event listener para el botón "Nueva Trivia"
newTriviaBtn.addEventListener('click', () => {
  triviaQuestionsContainer.innerHTML = '';
  triviaQuestionsContainer.style.display = 'none';
  scoreContainer.style.display = 'none';
  scoreValue.textContent = '0';
  generateTriviaBtn.disabled = false;
  finishTriviaBtn.disabled = true;
});

// Función para mostrar una pregunta
function showQuestion() {
  const question = triviaQuestions[currentQuestionIndex];
  triviaQuestionsContainer.innerHTML = '';

  const questionElement = document.createElement('div');
  questionElement.classList.add('question');
  questionElement.innerHTML = `
    <h3>Pregunta ${currentQuestionIndex + 1}:</h3>
    <p>${question.question}</p>
  `;

  const optionsElement = document.createElement('div');
  optionsElement.classList.add('options');

  let allOptions = question.incorrect_answers.concat(question.correct_answer);
  allOptions = shuffleArray(allOptions);

  allOptions.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.innerHTML = `
      <input type="${question.type === 'multiple' ? 'checkbox' : 'radio'}" name="question-${currentQuestionIndex}" value="${option}">
      <label>${option}</label>
    `;
    optionsElement.appendChild(optionElement);
  });

  questionElement.appendChild(optionsElement);
  triviaQuestionsContainer.appendChild(questionElement);
}

// Función para finalizar la trivia y mostrar el puntaje final
function finishTrivia() {
  const selectedOptions = Array.from(document.querySelectorAll(`input[name^="question-"]:checked`));
  selectedOptions.forEach(option => {
    const questionIndex = parseInt(option.name.split('-')[1]);
    const selectedOption = option.value;
    const correctOption = triviaQuestions[questionIndex].correct_answer;
    if (selectedOption === correctOption) {
      score += 100;
    }
  });

  scoreContainer.style.display = 'block';
  scoreValue.textContent = score;
  generateTriviaBtn.disabled = false;
  finishTriviaBtn.disabled = true;
}

// Función para mezclar un arreglo
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
