// DIALER FUNCTIONS
let phoneNumber = '';

function addNum(num) {
    if (phoneNumber.length < 15) {
        phoneNumber += num;
        updateDisplay();
    }
}

function clearNum() {
    phoneNumber = phoneNumber.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('numberDisplay').innerText = phoneNumber;
}

function scheduleCall() {
    if (!phoneNumber) {
        phoneNumber = 'Unknown';
    }
    const delay = parseInt(document.getElementById('delay').value) * 1000 || 3000;
    
    setTimeout(() => {
        document.getElementById('dialer').style.display = 'none';
        document.getElementById('incoming').style.display = 'flex';
        document.getElementById('callerNumber').innerText = phoneNumber;
        
        // Vibrate and ring
        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500, 200, 500]);
        }
        playRingtone();
    }, delay);
}

// RINGTONE
function playRingtone() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        function beep() {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 600;
            gain.gain.value = 0.3;
            osc.start();
            
            setTimeout(() => {
                osc.frequency.value = 800;
            }, 500);
            
            setTimeout(() => {
                osc.stop();
            }, 1000);
        }
        
        beep();
        window.ringInterval = setInterval(beep, 2000);
    } catch(e) {
        console.log('Audio not supported');
    }
}

// SLIDER LOGIC
let isDragging = false;
let currentSlider = null;
let startX = 0;
let currentBtn = null;

function startSlide(e, type) {
    isDragging = true;
    currentSlider = type;
    currentBtn = type === 'accept' ? 
        document.getElementById('acceptSlider') : 
        document.getElementById('declineSlider');
    
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    
    document.addEventListener('mousemove', moveSlide);
    document.addEventListener('mouseup', endSlide);
    document.addEventListener('touchmove', moveSlide);
    document.addEventListener('touchend', endSlide);
}

function moveSlide(e) {
    if (!isDragging || !currentBtn) return;
    
    e.preventDefault();
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diff = x - startX;
    const trackWidth = currentBtn.parentElement.offsetWidth - 60;
    
    // Constrain movement
    let newPos = Math.max(5, Math.min(diff + 5, trackWidth));
    currentBtn.style.left = newPos + 'px';
    
    // Check if slid far enough
    if (newPos > trackWidth * 0.7) {
        completeSlide();
    }
}

function endSlide() {
    if (!isDragging) return;
    
    // Reset if not completed
    if (currentBtn) {
        currentBtn.style.transition = 'left 0.3s';
        currentBtn.style.left = '5px';
        setTimeout(() => {
            if (currentBtn) currentBtn.style.transition = '';
        }, 300);
    }
    
    isDragging = false;
    currentSlider = null;
    currentBtn = null;
    
    document.removeEventListener('mousemove', moveSlide);
    document.removeEventListener('mouseup', endSlide);
    document.removeEventListener('touchmove', moveSlide);
    document.removeEventListener('touchend', endSlide);
}

function completeSlide() {
    isDragging = false;
    clearInterval(window.ringInterval);
    
    if (currentSlider === 'accept') {
        // Show active call
        document.getElementById('incoming').style.display = 'none';
        document.getElementById('activeCall').style.display = 'flex';
        document.getElementById('activeNumber').innerText = phoneNumber;
        startTimer();
    } else {
        // Declined - back to dialer
        resetAll();
    }
    
    document.removeEventListener('mousemove', moveSlide);
    document.removeEventListener('mouseup', endSlide);
    document.removeEventListener('touchmove', moveSlide);
    document.removeEventListener('touchend', endSlide);
}

// TIMER
let seconds = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`;
    }, 1000);
}

function endCall() {
    clearInterval(timerInterval);
    seconds = 0;
    resetAll();
}

function resetAll() {
    document.getElementById('activeCall').style.display = 'none';
    document.getElementById('incoming').style.display = 'none';
    document.getElementById('dialer').style.display = 'flex';
    document.getElementById('timer').innerText = '00:00';
    phoneNumber = '';
    updateDisplay();
    
    // Reset sliders
    document.getElementById('acceptSlider').style.left = '5px';
    document.getElementById('declineSlider').style.left = '5px';
}