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
      question: "If your university offers scholarships only to students from a specific background, what principle from the Preamble ensures equal opportunity for everyone?",
      choices: ["A) Fraternity", "B) Liberty", "C) Equality", "D) Justice"],
      correctAnswer: 2 // C) Equality
    },
    {
      question: "If you are denied a job promotion because of your gender, which principle ensures you can demand fair treatment?",
      choices: ["A) Justice", "B) Equality", "C) Liberty", "D) Fraternity"],
      correctAnswer: 1 // B) Equality
    },
    {
      question: "If two people commit the same crime but only one is punished, which part of the Preamble ensures that both should be treated equally?",
      choices: ["A) Justice", "B) Equality", "C) Fraternity", "D) Secularism"],
      correctAnswer: 1 // B) Equality
    },
    {
      question: "In a competitive exam, you find that people from certain regions are getting special treatment. What principle helps you argue for equal treatment?",
      choices: ["A) Equality", "B) Liberty", "C) Justice", "D) Fraternity"],
      correctAnswer: 0 // A) Equality
    },
    {
      question: "If a school reserves certain positions only for students of a specific race, which Preamble principle protects the right to equal opportunity?",
      choices: ["A) Fraternity", "B) Liberty", "C) Equality", "D) Justice"],
      correctAnswer: 2 // C) Equality
    },
    {
      question: "If you’re denied a job promotion because of your caste, which Article ensures you can challenge this discrimination?",
      choices: ["A) Article 14", "B) Article 16", "C) Article 19", "D) Article 25"],
      correctAnswer: 1 // B) Article 16
    },
    {
      question: "If public resources are allocated only to specific communities, which Article protects your right to equality in accessing public goods?",
      choices: ["A) Article 19", "B) Article 16", "C) Article 14", "D) Article 21"],
      correctAnswer: 2 // C) Article 14
    },
    {
      question: "A university denies admissions to students from a particular race. Which Article allows you to challenge this under the principle of equality?",
      choices: ["A) Article 14", "B) Article 19", "C) Article 21", "D) Article 25"],
      correctAnswer: 0 // A) Article 14
    },
    {
      question: "If a school provides scholarships only to male students, which Article ensures equal opportunities for all genders?",
      choices: ["A) Article 14", "B) Article 15", "C) Article 16", "D) Article 25"],
      correctAnswer: 1 // B) Article 15
    },
    {
      question: "If you’re refused public service because of your religion, which Article guarantees you can challenge this discrimination?",
      choices: ["A) Article 14", "B) Article 15", "C) Article 19", "D) Article 16"],
      correctAnswer: 1 // B) Article 15
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
