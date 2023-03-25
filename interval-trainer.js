const instructions = document.getElementById('instructions');
const scoreElement = document.getElementById('score');
const feedback = document.getElementById('feedback');
const startButton = document.getElementById('start');
const intervalButtons = document.getElementById('interval-buttons');
const replayButton = document.getElementById('replay');
const noteDuration = 1; // Duration of each note in seconds

const intervals = [
  { name: 'Unison', semitones: 0 },
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 },
];

let score = 0;
let incorrectAttempts = 0;
let correctInterval;

// function playFrequency(freq) {
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const oscillator = audioContext.createOscillator();
//   oscillator.type = 'sine';
//   oscillator.frequency.value = freq;
//   oscillator.connect(audioContext.destination);
//   oscillator.start();
//   setTimeout(() => {
//     oscillator.stop();
//   }, 1000);
// }

// function playNotes(baseFreq, interval) {
//   playFrequency(baseFreq);
//   setTimeout(() => {
//     playFrequency(baseFreq * Math.pow(2, interval.semitones / 12));
//   }, 1000);
// }

function playNotes(baseFrequency, interval) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const currentTime = audioContext.currentTime;
    const frequencyRatio = Math.pow(2, interval.semitones / 12); // Calculate frequency ratio using semitones
  
    // Base note
    const baseOscillator = audioContext.createOscillator();
    const baseGain = audioContext.createGain();
    baseOscillator.frequency.value = baseFrequency;
    baseOscillator.connect(baseGain);
    baseGain.connect(audioContext.destination);
    baseOscillator.start(currentTime);
    baseGain.gain.setValueAtTime(1, currentTime);
    baseGain.gain.linearRampToValueAtTime(0, currentTime + noteDuration - 0.01);
    baseOscillator.stop(currentTime + noteDuration);
  
    // Interval note
    const intervalOscillator = audioContext.createOscillator();
    const intervalGain = audioContext.createGain();
    intervalOscillator.frequency.value = baseFrequency * frequencyRatio;
    intervalOscillator.connect(intervalGain);
    intervalGain.connect(audioContext.destination);
    intervalOscillator.start(currentTime + noteDuration);
    intervalGain.gain.setValueAtTime(1, currentTime + noteDuration);
    intervalGain.gain.linearRampToValueAtTime(0, currentTime + 2 * noteDuration - 0.01);
    intervalOscillator.stop(currentTime + 2 * noteDuration);
  }
  

function generateRandomInterval() {
  const randomIndex = Math.floor(Math.random() * intervals.length);
  const direction = Math.random() < 0.5 ? 1 : -1;
  return { ...intervals[randomIndex], semitones: intervals[randomIndex].semitones * direction };
}

function setupIntervalButtons() {
    intervals.forEach((interval, index) => {
      const button = document.createElement('button');
      button.innerText = interval.name;
      button.classList.add('interval'); // Add the 'interval' class to interval buttons
      button.addEventListener('click', () => checkAnswer(index));
      intervalButtons.querySelector('.interval-buttons-row').appendChild(button);
    });
  }

function updateScoreDisplay() {
    const totalAttempts = score + incorrectAttempts;
    const percentCorrect = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
    scoreElement.textContent = `Correct: ${score} | Incorrect: ${incorrectAttempts} | ${percentCorrect}% correct`;
  }

  function checkAnswer(selectedIndex) {
    if (intervals[selectedIndex].name === correctInterval.name) {
      feedback.textContent = 'Great job! That\'s correct!';
      feedback.classList.remove('incorrect');
      feedback.classList.add('correct');
      score++;
    } else {
      feedback.textContent = `Incorrect! The correct answer is ${correctInterval.name}.`;
      feedback.classList.remove('correct');
      feedback.classList.add('incorrect');
      incorrectAttempts++;
    }
    updateScoreDisplay();
    setTimeout(start, 2000);
  }

  function start() {
    intervalButtons.hidden = false;
    startButton.style.display = 'none'; // Hide the start button after it's clicked
    feedback.textContent = ''; // Clear the correct or incorrect message
    correctInterval = generateRandomInterval();
    playNotes(440, correctInterval);
  }

function replay() {
    if (correctInterval) {
      playNotes(440, correctInterval);
    }
  }

startButton.addEventListener('click', start);
replayButton.addEventListener('click', replay);
setupIntervalButtons();

