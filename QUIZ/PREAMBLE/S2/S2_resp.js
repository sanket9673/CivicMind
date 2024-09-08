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
        question: "If your social media post is censored by authorities, which part of the Preamble protects your right to express your thoughts?",
        choices: ["Justice", "Liberty", "Equality", "Fraternity"],
        correctAnswer: 1 // Index for "Liberty"
    },
    {
        question: "Your workplace restricts you from practicing your religion during work hours. Which principle from the Preamble ensures your freedom to worship?",
        choices: ["Secularism", "Fraternity", "Liberty", "Justice"],
        correctAnswer: 2 // Index for "Liberty"
    },
    {
        question: "You are told not to express certain political opinions in public. Which principle can defend your right to freely share your political views?",
        choices: ["Equality", "Liberty", "Secularism", "Fraternity"],
        correctAnswer: 1 // Index for "Liberty"
    },
    {
        question: "You wish to write an article critical of the government, but are discouraged from doing so. What principle protects your freedom of expression?",
        choices: ["Liberty", "Fraternity", "Justice", "Equality"],
        correctAnswer: 0 // Index for "Liberty"
    },
    {
        question: "If you are not allowed to discuss certain topics in public because of your beliefs, which part of the Preamble protects your freedom of thought?",
        choices: ["Justice", "Secularism", "Liberty", "Equality"],
        correctAnswer: 2 // Index for "Liberty"
    },
    {
        question: "If your workplace restricts you from practicing your religion, which Article guarantees your freedom of religion?",
        choices: ["Article 19", "Article 14", "Article 25", "Article 21"],
        correctAnswer: 2 // Index for "Article 25"
    },
    {
        question: "You are prevented from expressing your opinion on social media. Which Article protects your right to freedom of speech?",
        choices: ["Article 19", "Article 14", "Article 25", "Article 21"],
        correctAnswer: 0 // Index for "Article 19"
    },
    {
        question: "Your school tries to force students to follow a particular religion. Which Article can be invoked to protect your right to choose your faith?",
        choices: ["Article 14", "Article 25", "Article 21", "Article 19"],
        correctAnswer: 1 // Index for "Article 25"
    },
    {
        question: "If you wish to write a newspaper article criticizing the government but fear repercussions, which Article protects your right to do so?",
        choices: ["Article 19", "Article 14", "Article 21", "Article 25"],
        correctAnswer: 0 // Index for "Article 19"
    },
    {
        question: "If a public office refuses to serve you because of your religious beliefs, which Article ensures you can challenge this unfair treatment?",
        choices: ["Article 25", "Article 21", "Article 19", "Article 14"],
        correctAnswer: 0 // Index for "Article 25"
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
