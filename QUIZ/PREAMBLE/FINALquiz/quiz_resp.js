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
    {
        question: "If you're being paid less than others for the same work, which part of the Preamble helps you demand equality?",
        choices: ["A) Liberty", "B) Justice", "C) Fraternity", "D) Secularism"],
        correctAnswer: 1
    },
    {
        question: "You notice that public resources are being unfairly distributed among different groups. What part of the Preamble can guide you to fight for fair allocation?",
        choices: ["A) Liberty", "B) Equality", "C) Justice", "D) Fraternity"],
        correctAnswer: 2
    },
    {
        question: "If a new law unfairly impacts a certain group’s livelihood, which Article ensures that no person is deprived of life or liberty except by law?",
        choices: ["A) Article 21", "B) Article 32", "C) Article 14", "D) Article 19"],
        correctAnswer: 0
    },
    {
        question: "If your city implements policies that exclude marginalized communities from economic benefits, which Article can challenge this injustice?",
        choices: ["A) Article 19", "B) Article 14", "C) Article 21", "D) Article 25"],
        correctAnswer: 1
    },
    {
        question: "You face job discrimination due to your social background. Which Articles ensure equal job opportunities?",
        choices: ["A) Article 14 and 16", "B) Article 32 and 21", "C) Article 25 and 30", "D) Article 19 and 16"],
        correctAnswer: 0
    },
    {
        question: "Your workplace restricts you from practicing your religion during work hours. Which principle from the Preamble ensures your freedom to worship?",
        choices: ["A) Secularism", "B) Fraternity", "C) Liberty", "D) Justice"],
        correctAnswer: 2
    },
    {
        question: "You are told not to express certain political opinions in public. Which principle can defend your right to freely share your political views?",
        choices: ["A) Equality", "B) Liberty", "C) Secularism", "D) Fraternity"],
        correctAnswer: 1
    },
    {
        question: "You wish to write an article critical of the government, but are discouraged from doing so. What principle protects your freedom of expression?",
        choices: ["A) Liberty", "B) Fraternity", "C) Justice", "D) Equality"],
        correctAnswer: 0
    },
    {
        question: "Your school tries to force students to follow a particular religion. Which Article can be invoked to protect your right to choose your faith?",
        choices: ["A) Article 14", "B) Article 25", "C) Article 21", "D) Article 19"],
        correctAnswer: 1
    },
    {
        question: "If you wish to write a newspaper article criticizing the government but fear repercussions, which Article protects your right to do so?",
        choices: ["A) Article 19", "B) Article 14", "C) Article 21", "D) Article 25"],
        correctAnswer: 0
    },
    {
        question: "If two people commit the same crime but only one is punished, which part of the Preamble ensures that both should be treated equally?",
        choices: ["A) Justice", "B) Equality", "C) Fraternity", "D) Secularism"],
        correctAnswer: 1
    },
    {
        question: "In a competitive exam, you find that people from certain regions are getting special treatment. What principle helps you argue for equal treatment?",
        choices: ["A) Equality", "B) Liberty", "C) Justice", "D) Fraternity"],
        correctAnswer: 0
    },
    {
        question: "If you’re denied a job promotion because of your caste, which Article ensures you can challenge this discrimination?",
        choices: ["A) Article 14", "B) Article 16", "C) Article 19", "D) Article 25"],
        correctAnswer: 1
    },
    {
        question: "If public resources are allocated only to specific communities, which Article protects your right to equality in accessing public goods?",
        choices: ["A) Article 19", "B) Article 16", "C) Article 14", "D) Article 21"],
        correctAnswer: 2
    },
    {
        question: "A university denies admissions to students from a particular race. Which Article allows you to challenge this under the principle of equality?",
        choices: ["A) Article 14", "B) Article 19", "C) Article 21", "D) Article 25"],
        correctAnswer: 0
    },
    {
        question: "If laws are being passed that divide the nation based on language, which principle can you rely on to promote unity?",
        choices: ["A) Fraternity", "B) Liberty", "C) Equality", "D) Justice"],
        correctAnswer: 0
    },
    {
        question: "If people in your office are divided into groups based on religion, which Preamble principle can help promote unity and brotherhood?",
        choices: ["A) Equality", "B) Fraternity", "C) Justice", "D) Secularism"],
        correctAnswer: 1
    },
    {
        question: "If a neighborhood refuses to allow people from a certain region to live there, which Preamble principle encourages unity and mutual respect?",
        choices: ["A) Justice", "B) Equality", "C) Fraternity", "D) Liberty"],
        correctAnswer: 2
    },
    {
        question: "If people in a locality are discriminated against based on their language, which Article promotes fraternity and national unity?",
        choices: ["A) Article 21", "B) Article 51A", "C) Article 19", "D) Article 14"],
        correctAnswer: 1
    },
    {
        question: "A community refuses to allow people from a different region to live there. Which Article encourages unity and mutual respect?",
        choices: ["A) Article 14", "B) Article 21", "C) Article 19", "D) Article 51A"],
        correctAnswer: 3
    }
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
