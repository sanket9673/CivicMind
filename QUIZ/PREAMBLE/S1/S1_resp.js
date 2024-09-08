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
        question: "If you're being paid less than others for the same work, which part of the Preamble helps you demand equality?",
        choices: [
            "A) Liberty",
            "B) Justice",
            "C) Fraternity",
            "D) Secularism"
        ],
        correctAnswer: 1 // Index for "B) Justice"
    },
    {
        question: "You notice that public resources are being unfairly distributed among different groups. What part of the Preamble can guide you to fight for fair allocation?",
        choices: [
            "A) Liberty",
            "B) Equality",
            "C) Justice",
            "D) Fraternity"
        ],
        correctAnswer: 2 // Index for "C) Justice"
    },
    {
        question: "Your local government introduces a new law that increases taxes for certain communities. What principle from the Preamble ensures you can challenge this discrimination?",
        choices: [
            "A) Equality",
            "B) Secularism",
            "C) Liberty",
            "D) Justice"
        ],
        correctAnswer: 3 // Index for "D) Justice"
    },
    {
        question: "You and your colleagues are not being given equal opportunities for promotion at work. Which part of the Preamble protects your right to fairness?",
        choices: [
            "A) Equality",
            "B) Justice",
            "C) Liberty",
            "D) Fraternity"
        ],
        correctAnswer: 1 // Index for "B) Justice"
    },
    {
        question: "If a law is passed that unfairly impacts a certain gender or group of people, which principle can be used to challenge it?",
        choices: [
            "A) Liberty",
            "B) Justice",
            "C) Equality",
            "D) Secularism"
        ],
        correctAnswer: 1 // Index for "B) Justice"
    },
    {
        question: "If you're being paid less than others for the same work, which Article supports your right to equal pay?",
        choices: [
            "A) Article 19",
            "B) Article 14",
            "C) Article 21",
            "D) Article 25"
        ],
        correctAnswer: 1 // Index for "B) Article 14"
    },
    {
        question: "If a new law unfairly impacts a certain group’s livelihood, which Article ensures that no person is deprived of life or liberty except by law?",
        choices: [
            "A) Article 21",
            "B) Article 32",
            "C) Article 14",
            "D) Article 19"
        ],
        correctAnswer: 0 // Index for "A) Article 21"
    },
    {
        question: "If your city implements policies that exclude marginalized communities from economic benefits, which Article can challenge this injustice?",
        choices: [
            "A) Article 19",
            "B) Article 14",
            "C) Article 21",
            "D) Article 25"
        ],
        correctAnswer: 1 // Index for "B) Article 14"
    },
    {
        question: "You face job discrimination due to your social background. Which Articles ensure equal job opportunities?",
        choices: [
            "A) Article 14 and 16",
            "B) Article 32 and 21",
            "C) Article 25 and 30",
            "D) Article 19 and 16"
        ],
        correctAnswer: 0 // Index for "A) Article 14 and 16"
    },
    {
        question: "If the government seizes your property unfairly, which Article protects your right to be treated with dignity and fairness?",
        choices: [
            "A) Article 32",
            "B) Article 19",
            "C) Article 21",
            "D) Article 14"
        ],
        correctAnswer: 2 // Index for "C) Article 21"
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
