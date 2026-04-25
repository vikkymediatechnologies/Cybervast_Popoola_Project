// ============================================
//  AccessThriveEx Quiz — CyberVast Limited
//  script.js
// ============================================

// ── Quiz Questions ──────────────────────────
const quizData = {
  html: [
    {
        q: "What does HTML stand for?",
        opts: [
            "Hyper Transfer Markup Language",
            "HyperText Markup Language",
            "High-Tech Modern Language",
            "HyperText Machine Language"
        ],
        correct: 1
    },
    {
        q: "Which HTML tag is used to create a hyperlink?",
        opts: ["&lt;link&gt;", "&lt;href&gt;", "&lt;a&gt;", "&lt;url&gt;"],
        correct: 2
    },
    {
        q: "What is the correct HTML element for the largest heading?",
        opts: ["&lt;h6&gt;", "&lt;heading&gt;", "&lt;head&gt;", "&lt;h1&gt;"],
        correct: 3
    },
    {
        q: "Which attribute is used to provide alternative text for an image?",
        opts: ["title", "src", "alt", "name"],
        correct: 2
    },
    {
        q: "What does the &lt;br&gt; tag do in HTML?",
        opts: [
            "Creates bold text",
            "Inserts a line break",
            "Creates a button",
            "Adds a border"
        ],
        correct: 1
    }
],

    css: [
        {
            q: "What does CSS stand for?",
            opts: [
                "Computer Style Sheets",
                "Creative Style System",
                "Cascading Style Sheets",
                "Code Structure Syntax"
            ],
            correct: 2
        },
        {
            q: "Which CSS property is used to change the text colour?",
            opts: ["text-color", "font-color", "color", "foreground"],
            correct: 2
        },
        {
            q: "How do you centre a block element horizontally using CSS?",
            opts: [
                "text-align: center",
                "position: center",
                "margin: 0 auto",
                "align: center"
            ],
            correct: 2
        },
        {
            q: "Which CSS unit is relative to the font-size of the root element?",
            opts: ["em", "px", "rem", "vh"],
            correct: 2
        },
        {
            q: "Which property is used to add space INSIDE an element's border?",
            opts: ["margin", "spacing", "padding", "border-spacing"],
            correct: 2
        }
    ],

    js: [
        {
            q: "Which keyword declares a block-scoped variable in JavaScript?",
            opts: ["var", "let", "const", "define"],
            correct: 1
        },
        {
            q: "What will typeof [] return in JavaScript?",
            opts: ["array", "list", "object", "undefined"],
            correct: 2
        },
        {
            q: "Which method adds an element to the END of an array?",
            opts: ["shift()", "unshift()", "pop()", "push()"],
            correct: 3
        },
        {
            q: "What does DOM stand for in web development?",
            opts: [
                "Document Object Model",
                "Data Output Module",
                "Direct Object Manipulation",
                "Document Output Manager"
            ],
            correct: 0
        },
        {
            q: "Which symbol is used for STRICT equality comparison in JavaScript?",
            opts: ["==", "=", "===", "!="],
            correct: 2
        }
    ]
};

// ── Topic config (labels, CSS class suffixes) ─
const topicConfig = {
    html: { label: 'HTML',       accent: 'acc-html', badge: 'badge-html', prog: 'prog-html', btn: 'btn-html' },
    css:  { label: 'CSS',        accent: 'acc-css',  badge: 'badge-css',  prog: 'prog-css',  btn: 'btn-css'  },
    js:   { label: 'JavaScript', accent: 'acc-js',   badge: 'badge-js',   prog: 'prog-js',   btn: 'btn-js'   }
};

// ── App state ────────────────────────────────
let state = {
    topic:    null,
    current:  0,
    score:    0,
    answered: false,
    answers:  []       // { correct: bool, rightAns: string }
};

// ── Screen management ────────────────────────
const SCREENS = ['intro-screen', 'topic-screen', 'quiz-screen', 'results-screen'];

function showScreen(id) {
    SCREENS.forEach(sid => {
        const el = document.getElementById(sid);
        if (!el) return;
        el.style.display = 'none';
        el.style.opacity = '0';
    });

    const target = document.getElementById(id);
    if (!target) return;

    target.style.display      = 'flex';
    target.style.flexDirection = 'column';
    target.style.alignItems    = 'center';

    // Small delay so the browser registers display:flex before fading in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            target.style.opacity = '1';
        });
    });
}

// ── Navigation ───────────────────────────────
function showTopics() {
    showScreen('topic-screen');
}

function backToTopics() {
    showScreen('topic-screen');
}

// ── Start a quiz for the chosen topic ────────
function startQuiz(topic) {
    state = { topic, current: 0, score: 0, answered: false, answers: [] };

    const cfg = topicConfig[topic];

    // Badge
    const badge = document.getElementById('topic-badge');
    badge.textContent = cfg.label;
    badge.className   = 'quiz-topic-badge ' + cfg.badge;

    // Accent bar
    document.getElementById('quiz-accent').className = 'quiz-box-accent ' + cfg.accent;

    // Progress fill colour
    document.getElementById('prog-fill').className = 'progress-fill ' + cfg.prog;

    // Next button colour
    const nb = document.getElementById('next-btn');
    nb.className = 'btn-next hidden ' + cfg.btn;

    showScreen('quiz-screen');
    loadQuestion();
}

// ── Render current question ──────────────────
function loadQuestion() {
    const qs      = quizData[state.topic];
    const q       = qs[state.current];
    const total   = qs.length;

    state.answered = false;

    // Progress bar
    const progress = (state.current / total) * 100;
    const progFill = document.getElementById('prog-fill');
    progFill.style.width = progress + '%';
    progFill.parentElement.setAttribute('aria-valuenow', Math.round(progress));

    // Counter
    document.getElementById('q-counter').textContent =
        'Question ' + (state.current + 1) + ' of ' + total;

    // Question text (fade)
    const qtEl = document.getElementById('q-text');
    qtEl.style.opacity = '0';
    setTimeout(() => {
        qtEl.textContent  = q.q;
        qtEl.style.transition = 'opacity 0.3s ease';
        qtEl.style.opacity = '1';
    }, 120);

    // Hide next button; update its label
    const nb = document.getElementById('next-btn');
    nb.classList.add('hidden');
    nb.innerHTML = (state.current < total - 1)
        ? 'Next Question <span class="arrow" aria-hidden="true">→</span>'
        : 'See Results <span class="arrow" aria-hidden="true">✓</span>';

    // Build answer buttons
    const answersEl = document.getElementById('answers');
    answersEl.innerHTML = '';

    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'ans-btn';
        btn.style.opacity   = '0';
        btn.style.transform = 'translateY(8px)';
        btn.type = 'button';
        btn.setAttribute('aria-label', String.fromCharCode(65 + i) + ': ' + opt);

        btn.innerHTML =
            '<span class="opt-letter">' + String.fromCharCode(65 + i) + '</span>' +
            '<span class="opt-text">'   + opt + '</span>';

        btn.addEventListener('click', () => selectAnswer(i));
        answersEl.appendChild(btn);

        // Staggered fade-in
        setTimeout(() => {
            btn.style.transition = 'all 0.3s ease';
            btn.style.opacity    = '1';
            btn.style.transform  = 'translateY(0)';
        }, i * 80);
    });
}

// ── Handle answer selection ──────────────────
function selectAnswer(idx) {
    if (state.answered) return;
    state.answered = true;

    const qs      = quizData[state.topic];
    const correct = qs[state.current].correct;
    const btns    = document.querySelectorAll('.ans-btn');

    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct)                  btn.classList.add('correct');
        if (i === idx && i !== correct)     btn.classList.add('incorrect');
    });

    const isRight = (idx === correct);
    if (isRight) state.score++;

    state.answers.push({
        correct:  isRight,
        rightAns: qs[state.current].opts[correct]
    });

    document.getElementById('next-btn').classList.remove('hidden');
}

// ── Advance to next question or results ──────
function nextQuestion() {
    const total = quizData[state.topic].length;
    if (state.current < total - 1) {
        state.current++;
        loadQuestion();
    } else {
        showResults();
    }
}

// ── Show final results ───────────────────────
function showResults() {
    const total = quizData[state.topic].length;
    const pct   = Math.round((state.score / total) * 100);
    const cfg   = topicConfig[state.topic];

    // Emoji + message
    let emoji, msg;
    if      (pct === 100) { emoji = '🏆'; msg = 'Perfect Score! Outstanding!';        }
    else if (pct >=  80)  { emoji = '🎉'; msg = 'Excellent work! Well done!';         }
    else if (pct >=  60)  { emoji = '👍'; msg = 'Good job! Keep learning!';           }
    else                  { emoji = '💪'; msg = "Keep practising — you'll improve!";  }

    // Populate results
    document.getElementById('res-emoji').textContent  = emoji;
    document.getElementById('res-accent').className   = 'quiz-box-accent ' + cfg.accent;
    document.getElementById('res-badge').textContent  = cfg.label + ' Quiz';
    document.getElementById('res-badge').className    = 'res-topic-badge ' + cfg.badge;
    document.getElementById('score-big').textContent  = state.score + '/' + total;
    document.getElementById('res-msg').textContent    = msg;
    document.getElementById('res-detail').textContent =
        'You scored ' + pct + '% on the ' + cfg.label + ' quiz';

    // Review list
    const rl = document.getElementById('review-list');
    rl.innerHTML = '<p class="review-label">Review</p>';

    state.answers.forEach((a, i) => {
        const div = document.createElement('div');
        div.className = 'review-item ' + (a.correct ? 'correct-r' : 'incorrect-r');

        const icon = a.correct ? '✓' : '✗';
        const text = a.correct
            ? '<b>Q' + (i + 1) + ':</b> Correct!'
            : '<b>Q' + (i + 1) + ':</b> Wrong — correct answer: <em>' + a.rightAns + '</em>';

        div.innerHTML =
            '<span class="review-icon" aria-hidden="true">' + icon + '</span>' +
            '<span>' + text + '</span>';

        rl.appendChild(div);
    });

    showScreen('results-screen');
}

// ── Retry same topic ─────────────────────────
function retryQuiz() {
    startQuiz(state.topic);
}

// ── Keyboard support for topic cards ─────────
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.topic-card');
        if (card) {
            e.preventDefault();
            card.click();
        }
    }
});

// ── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Show intro, hide everything else
    SCREENS.forEach(sid => {
        const el = document.getElementById(sid);
        if (el) { el.style.display = 'none'; el.style.opacity = '0'; }
    });

    const intro = document.getElementById('intro-screen');
    intro.style.display       = 'flex';
    intro.style.flexDirection  = 'column';
    intro.style.alignItems     = 'center';
    intro.style.opacity        = '1';
});