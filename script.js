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

    // Initialize SpeechSynthesis
    const synth = window.speechSynthesis;
    let voices = [];
    let femaleVoice = null;

    // Load voices and select a female one
    function loadVoices() {
        voices = synth.getVoices();
        // Prefer Portuguese (Brazil) female voice, fallback to any female, then any voice
        femaleVoice = voices.find(voice => 
            voice.lang === 'pt-BR' && voice.name.toLowerCase().includes('female')) ||
            voices.find(voice => voice.lang === 'pt-BR') ||
            voices.find(voice => voice.name.toLowerCase().includes('female')) ||
            voices[0];
    }

    // Load voices immediately and on change (some browsers load voices async)
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    // Function to speak the number
    function speakNumber(number) {
        if (!synth || !femaleVoice) {
            console.warn('SpeechSynthesis ou voz não disponível.');
            return;
        }
        const utterance = new SpeechSynthesisUtterance(`O número é ${number}`);
        utterance.lang = 'pt-BR';
        utterance.voice = femaleVoice;
        utterance.rate = 1;
        utterance.pitch = 1.2; // Slightly higher pitch for a more feminine tone
        synth.speak(utterance);
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
        // Resume AudioContext on user interaction
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        playPlinSound();
        sortearBtn.disabled = true;
        roleta.classList.add('spinning');
        resultado.textContent = 'Sorteando...';
        playSpinSound();

        setTimeout(() => {
            const numeroSorteado = Math.floor(Math.random() * 100) + 1;
            resultado.textContent = numeroSorteado;
            roleta.classList.remove('spinning');
            playStopSound();
            speakNumber(numeroSorteado);
            sortearBtn.disabled = false;
        }, 2000); // 2-second spin
    });
}