const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const nextButton = document.getElementById('next-button');
const previousButton = document.getElementById('previous-button');
const submitButton = document.getElementById('submit-button');
const progressBar = document.getElementById('progress-bar');
const resultContainer = document.getElementById('result-container');
const resultElement = document.createElement('p');
const solutionButton = document.createElement('button');

let currentQuestion = 0;
let selectedAnswer = null;
let userAnswers = [];
let score = 0;
let selectedQuestions = [];

// Example pool of questions
const questionPool = [
    {
      question: "If people in your community are being discriminated against based on their region, which part of the Preamble promotes unity?",
      choices: ["A) Justice", "B) Equality", "C) Fraternity", "D) Liberty"],
      correctAnswer: 2 // C) Fraternity
    },
    {
      question: "If a person is treated with disrespect in public because of their background, which Preamble principle ensures their dignity?",
      choices: ["A) Justice", "B) Fraternity", "C) Equality", "D) Secularism"],
      correctAnswer: 1 // B) Fraternity
    },
    {
      question: "If laws are being passed that divide the nation based on language, which principle can you rely on to promote unity?",
      choices: ["A) Fraternity", "B) Liberty", "C) Equality", "D) Justice"],
      correctAnswer: 0 // A) Fraternity
    },
    {
      question: "If people in your office are divided into groups based on religion, which Preamble principle can help promote unity and brotherhood?",
      choices: ["A) Equality", "B) Fraternity", "C) Justice", "D) Secularism"],
      correctAnswer: 1 // B) Fraternity
    },
    {
      question: "If a neighborhood refuses to allow people from a certain region to live there, which Preamble principle encourages unity and mutual respect?",
      choices: ["A) Justice", "B) Equality", "C) Fraternity", "D) Liberty"],
      correctAnswer: 2 // C) Fraternity
    },
    {
      question: "If people in a locality are discriminated against based on their language, which Article promotes fraternity and national unity?",
      choices: ["A) Article 21", "B) Article 51A", "C) Article 19", "D) Article 14"],
      correctAnswer: 1 // B) Article 51A
    },
    {
      question: "A community refuses to allow people from a different region to live there. Which Article encourages unity and mutual respect?",
      choices: ["A) Article 14", "B) Article 21", "C) Article 19", "D) Article 51A"],
      correctAnswer: 3 // D) Article 51A
    },
    {
      question: "If a person is denied dignity in a public place based on their caste, which Article ensures that all individuals are treated with respect?",
      choices: ["A) Article 19", "B) Article 21", "C) Article 51A", "D) Article 25"],
      correctAnswer: 1 // B) Article 21
    },
    {
      question: "If local laws prevent certain people from moving freely in a city, which Article protects their freedom of movement?",
      choices: ["A) Article 19", "B) Article 51A", "C) Article 14", "D) Article 21"],
      correctAnswer: 0 // A) Article 19
    },
    {
      question: "If a neighborhood restricts housing to certain communities, which Article ensures that every citizen has the right to live anywhere in the country?",
      choices: ["A) Article 19", "B) Article 21", "C) Article 51A", "D) Article 25"],
      correctAnswer: 0 // A) Article 19
    }
  ];
  
  

function selectRandomQuestions() {
    selectedQuestions = [];
    const indices = [];
    while (selectedQuestions.length < 5) {
        const randomIndex = Math.floor(Math.random() * questionPool.length);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
            selectedQuestions.push(questionPool[randomIndex]);
        }
    }
}

function loadQuestion() {
    const currentData = selectedQuestions[currentQuestion];
    questionElement.textContent = currentData.question;
    choicesElement.innerHTML = '';
    selectedAnswer = null;
    nextButton.disabled = true;
    previousButton.disabled = currentQuestion === 0;

    // Show "Submit" button only on the last question
    submitButton.style.display = currentQuestion === selectedQuestions.length - 1 ? 'block' : 'none';

    // Hide "Next" button on the last question
    nextButton.style.display = currentQuestion === selectedQuestions.length - 1 ? 'none' : 'inline-block';

    currentData.choices.forEach((choice, index) => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.classList.add('choice');
        li.addEventListener('click', () => selectAnswer(index, li));
        choicesElement.appendChild(li);
    });

    progressBar.style.width = ((currentQuestion + 1) / selectedQuestions.length) * 100 + '%';
}

function selectAnswer(index, element) {
    selectedAnswer = index;
    
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => choice.classList.remove('selected'));
    element.classList.add('selected');
    
    nextButton.disabled = false;
}

function showResults() {
    // Clear previous content
    questionElement.textContent = '';  // Clear the question text
    choicesElement.innerHTML = '';     // Clear the choices list

    // Display the score
    resultElement.textContent = `You scored ${score} out of ${selectedQuestions.length}!`;

    // Hide the "Next" button and "Previous" button, show the "Show Solution" button
    nextButton.style.display = 'none';
    previousButton.style.display = 'none';
    submitButton.style.display = 'none';

    // Ensure solutionButton is appended and visible
    solutionButton.textContent = "Show Solutions";
    solutionButton.id = 'show-solution-button'; // Assign the button ID for styling
    solutionButton.classList.add('btn'); // Add common button class
    solutionButton.style.display = 'block';
    solutionButton.style.margin = '0 auto';

    // Append the score and solution button to the result container
    resultContainer.appendChild(resultElement);
    resultContainer.appendChild(solutionButton);

    // Add the event listener for showing solutions
    solutionButton.addEventListener('click', showSolutions);
}


function showSolutions() {
    questionElement.textContent = "Solutions:";
    choicesElement.innerHTML = '';  // Clear previous content from choices

    // Hide the "Show Solution" button
    solutionButton.style.display = 'none';
    
    selectedQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('solution');
        questionDiv.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            <p>Your answer: ${question.choices[userAnswer] !== undefined ? question.choices[userAnswer] : 'No answer given'}</p>
            <p>Correct answer: ${question.choices[question.correctAnswer]}</p>
            <p>Status: ${isCorrect ? 'Correct' : 'Incorrect'}</p>
        `;
        questionDiv.style.color = isCorrect ? 'green' : 'red';

        choicesElement.appendChild(questionDiv);
    });
}

function handleNavigation(direction) {
    if (direction === 'next' && currentQuestion < selectedQuestions.length - 1) {
        userAnswers[currentQuestion] = selectedAnswer;
        if (selectedAnswer === selectedQuestions[currentQuestion].correctAnswer) {
            score++;
        }
        currentQuestion++;
        loadQuestion();
    } else if (direction === 'previous' && currentQuestion > 0) {
        userAnswers[currentQuestion] = selectedAnswer;
        currentQuestion--;
        loadQuestion();
    }
}

function handleSubmit() {
    userAnswers[currentQuestion] = selectedAnswer;
    if (selectedAnswer === selectedQuestions[currentQuestion].correctAnswer) {
        score++;
    }
    showResults();
}



nextButton.addEventListener('click', () => handleNavigation('next'));
previousButton.addEventListener('click', () => handleNavigation('previous'));
submitButton.addEventListener('click', handleSubmit);

// Initialize the quiz
selectRandomQuestions();
loadQuestion();
