// ============================================
// AccessThriveEx Quiz - CyberVast Limited
// ============================================


// Quiz Data - 5 Questions
const quizData = [
    {
        question: "What is the primary purpose of the Access Bank 'YourThrive' program?",
        options: [
            "To provide loans to small businesses",
            "To empower youth with digital skills and career opportunities",
            "To offer banking services to rural communities",
            "To promote international trade"
        ],
        correct: 1
    },
    {
        question: "Which of the following is a core value of Cybervast Limited?",
        options: [
            "Profit maximization only",
            "Innovation, Excellence, and Integrity",
            "Outsourcing all operations",
            "Avoiding technological advancement"
        ],
        correct: 1
    },
    {
        question: "What does 'AccessThriveEx' primarily focus on?",
        options: [
            "Real estate investment",
            "Experiential learning and professional development",
            "Traditional banking operations",
            "Agricultural financing"
        ],
        correct: 1
    },
    {
        question: "In web development, what does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Code Structure Syntax"
        ],
        correct: 2
    },
    {
        question: "Which programming language is primarily used for adding interactivity to web pages?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        correct: 2
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

// DOM Elements
const questionText = document.getElementById('questionText');
const answerContainer = document.getElementById('answerContainer');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const questionCounter = document.getElementById('questionCounter');
const progressBar = document.querySelector('.progress-bar');

// Initialize Quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    loadQuestion();
}

// Load Current Question
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    // Update question text with animation
    questionText.style.opacity = '0';
    setTimeout(() => {
        questionText.textContent = question.question;
        questionText.style.opacity = '1';
    }, 150);
    
    // Clear previous answers
    answerContainer.innerHTML = '';
    
    // Update progress
    const progress = ((currentQuestion) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    
    // Create answer buttons with staggered animation
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.style.opacity = '0';
        button.style.transform = 'translateY(10px)';
        button.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        button.addEventListener('click', () => selectAnswer(index));
        answerContainer.appendChild(button);
        
        // Staggered fade in
        setTimeout(() => {
            button.style.transition = 'all 0.3s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Reset state
    selectedAnswer = null;
    answered = false;
    nextBtn.classList.add('hidden');
}

// Handle Answer Selection
function selectAnswer(index) {
    if (answered) return;
    
    answered = true;
    selectedAnswer = index;
    
    const buttons = answerContainer.querySelectorAll('.answer-btn');
    const correctIndex = quizData[currentQuestion].correct;
    
    // Disable all buttons and show correct/incorrect
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        
        if (i === correctIndex) {
            btn.classList.add('correct');
        }
        
        if (i === index && i !== correctIndex) {
            btn.classList.add('incorrect');
        }
        
        if (i === index) {
            btn.classList.add('selected');
        }
    });
    
    // Update score
    if (index === correctIndex) {
        score++;
    }
    
    // Show next button
    nextBtn.classList.remove('hidden');
    
    // Update button text for last question
    if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = 'Finish Quiz <span class="arrow">✓</span>';
    } else {
        nextBtn.innerHTML = 'Next Question <span class="arrow">→</span>';
    }
}

// Handle Next Button Click
nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
});

// Show Final Results
function showResults() {
    // Update to 100%
    progressFill.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);
    questionCounter.textContent = 'Quiz Complete!';
    
    // Clear and show results
    questionText.textContent = 'Quiz Completed! 🎉';
    answerContainer.innerHTML = '';
    nextBtn.classList.add('hidden');
    
    const percentage = Math.round((score / quizData.length) * 100);
    
    // Determine message and color
    let message = '';
    let emoji = '';
    if (percentage === 100) {
        message = 'Perfect Score! Outstanding! 🌟';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = 'Excellent work! Well done! 👏';
        emoji = '🎉';
    } else if (percentage >= 60) {
        message = 'Good job! Keep learning! 📚';
        emoji = '👍';
    } else {
        message = 'Keep practicing! You\'ll improve! 💪';
        emoji = '🌱';
    }
    
    // Create results HTML
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results-container';
    resultsDiv.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${emoji}</div>
        <div class="score-display">${score}/${quizData.length}</div>
        <div class="score-message">${message}</div>
        <p class="score-details">You scored ${percentage}% on the AccessThriveEx Quiz</p>
        <button class="restart-btn" onclick="restartQuiz()">
            <span>↺</span> Restart Quiz
        </button>
    `;
    
    answerContainer.appendChild(resultsDiv);
    
    // Animate in
    setTimeout(() => {
        resultsDiv.style.opacity = '1';
        resultsDiv.style.transform = 'translateY(0)';
    }, 100);
}

// Restart Quiz
function restartQuiz() {
    // Fade out
    const container = document.querySelector('.quiz-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        initQuiz();
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
}

// Start the quiz
document.addEventListener('DOMContentLoaded', initQuiz);