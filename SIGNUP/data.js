import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoG5BxEgTgDE2regx3LvIGPwq2cdLPXb4",
    authDomain: "newconnect-26b26.firebaseapp.com",
    projectId: "newconnect-26b26",
    storageBucket: "newconnect-26b26.appspot.com",
    messagingSenderId: "164407708826",
    appId: "1:164407708826:web:701d4a9ed960a99c34a323"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userId = null;

onAuthStateChanged(auth, user => {
    if (user) {
        userId = user.uid; // Get the logged-in user's ID
    } else {
        // No user is signed in, redirect to login page
        window.location.href = "../SIGNUP/signup.html";
    }
});

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
    { question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: 2 },
    { question: "Which planet is known as the Red Planet?", choices: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: 1 },
    { question: "What is the largest ocean on Earth?", choices: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: 3 },
    { question: "Which country is known as the Land of the Rising Sun?", choices: ["China", "Japan", "Thailand", "India"], correctAnswer: 1 },
    { question: "What is the currency of the United States?", choices: ["Euro", "Dollar", "Pound", "Yen"], correctAnswer: 1 },
    { question: "What is the tallest mountain in the world?", choices: ["K2", "Everest", "Kangchenjunga", "Lhotse"], correctAnswer: 1 },
    { question: "Who wrote 'Romeo and Juliet'?", choices: ["Shakespeare", "Hemingway", "Dickens", "Twain"], correctAnswer: 0 },
    { question: "Which element has the chemical symbol 'O'?", choices: ["Oxygen", "Gold", "Osmium", "Oganesson"], correctAnswer: 0 },
    { question: "In which year did the Titanic sink?", choices: ["1902", "1912", "1922", "1932"], correctAnswer: 1 },
    { question: "What is the smallest country in the world?", choices: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], correctAnswer: 2 },
    { question: "Which planet is closest to the Sun?", choices: ["Venus", "Mars", "Mercury", "Earth"], correctAnswer: 2 },
    { question: "Which continent is the largest by area?", choices: ["Africa", "Asia", "North America", "Europe"], correctAnswer: 1 },
    { question: "What is the main ingredient in guacamole?", choices: ["Tomato", "Onion", "Avocado", "Cucumber"], correctAnswer: 2 },
    { question: "Who painted the Mona Lisa?", choices: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], correctAnswer: 1 },
    { question: "Which planet has the most moons?", choices: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctAnswer: 0 },
    { question: "What is the chemical symbol for water?", choices: ["HO", "O2", "CO2", "H2O"], correctAnswer: 3 },
    { question: "Which is the longest river in the world?", choices: ["Nile", "Amazon", "Yangtze", "Mississippi"], correctAnswer: 1 },
    { question: "Who was the first man to walk on the Moon?", choices: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "John Glenn"], correctAnswer: 1 },
    { question: "Which organ is primarily responsible for pumping blood?", choices: ["Liver", "Brain", "Heart", "Lungs"], correctAnswer: 2 },
    { question: "What is the capital of Australia?", choices: ["Sydney", "Melbourne", "Canberra", "Perth"], correctAnswer: 2 },
    // Add your questions here
];

function selectRandomQuestions() {
    selectedQuestions = [];
    const indices = [];
    while (selectedQuestions.length < 10) {
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

    solutionButton.textContent = "Show Solutions";
    solutionButton.id = 'show-solution-button'; // Assign the button ID for styling
    solutionButton.classList.add('btn'); // Add common button class
    solutionButton.style.display = 'block';
    solutionButton.style.margin = '0 auto';
    saveScore(score);

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

function saveScore(score) {
    if (userId) {
      setDoc(doc(db, 'quizScores', userId), {
        score: score,
        date: new Date()
      }).then(() => {
        console.log("Score saved successfully!");
      }).catch(error => {
        console.error("Error saving score: ", error);
      });
    } else {
      console.error("No user ID found, cannot save score.");
    }
  }

nextButton.addEventListener('click', () => handleNavigation('next'));
previousButton.addEventListener('click', () => handleNavigation('previous'));
submitButton.addEventListener('click', handleSubmit);

// Initialize the quiz
selectRandomQuestions();
loadQuestion();
