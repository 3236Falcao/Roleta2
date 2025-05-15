const roleta = document.querySelector('#roleta');
const resultado = document.querySelector('#resultado');
const sortearBtn = document.getElementById('sortearBtn');

if (!roleta || !resultado || !sortearBtn) {
    console.error('Elementos necessários não encontrados.');
} else {
    // Initialize AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    try {
        audioCtx = new AudioContext();
    } catch (e) {
        console.warn('AudioContext não suportado:', e);
    }

    // Function to play a "plin" sound (short chime)
    function playPlinSound() {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    // Function to play spinning sound (rapid ticks)
    function playSpinSound() {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1);
    }

    // Function to play stop sound (soft ding)
    function playStopSound() {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    sortearBtn.addEventListener('click', () => {
        // Resume AudioContext on user interaction (required by browsers)
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        playPlinSound();
        sortearBtn.disabled = true;
        roleta.classList.add('spinning');
        resultado.textContent = 'Girando';
        playSpinSound();

        setTimeout(() => {
            const numeroSorteado = Math.floor(Math.random() * 100) + 1;
            resultado.textContent = numeroSorteado;
            roleta.classList.remove('spinning');
            playStopSound();
            sortearBtn.disabled = false;
        }, 2000); // 2-second spin
    });
}