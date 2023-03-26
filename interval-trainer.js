const instructions = document.getElementById('instructions');
const scoreElement = document.getElementById('score');
const feedback = document.getElementById('feedback');
const startButton = document.getElementById('start');
const intervalButtons = document.getElementById('interval-buttons');
const nextIntervalButton = document.getElementById('next-interval-button');
const replayButton = document.getElementById('replay');
const noteDuration = 1; // Duration of each note in seconds
let currentBaseFrequency = 440; // Initialize with A4 frequency

const intervals = [
  { name: 'Unison', semitones: 0, ascendingExample: 'Twinkle, Twinkle, Little Star', descendingExample: 'Twinkle, Twinkle, Little Star' },
  { name: 'Minor 2nd', semitones: 1, ascendingExample: 'Jaws Theme', descendingExample: 'Für Elise' },
  { name: 'Major 2nd', semitones: 2, ascendingExample: 'Happy Birthday', descendingExample: 'Mary Had a Little Lamb' },
  { name: 'Minor 3rd', semitones: 3, ascendingExample: 'Greensleeves', descendingExample: 'Hey Jude' },
  { name: 'Major 3rd', semitones: 4, ascendingExample: 'When the Saints Go Marching In', descendingExample: 'Swing Low, Sweet Chariot' },
  { name: 'Perfect 4th', semitones: 5, ascendingExample: 'Here Comes the Bride', descendingExample: 'I\'ve Been Working on the Railroad' },
  { name: 'Tritone', semitones: 6, ascendingExample: 'The Simpsons', descendingExample: 'YYZ by Rush' },
  { name: 'Perfect 5th', semitones: 7, ascendingExample: '\'Make-way\' from Aladin Prince Ali', descendingExample: 'Flint-stones' },
  { name: 'Minor 6th', semitones: 8, ascendingExample: 'The Entertainer', descendingExample: 'Love Story Theme' },
  { name: 'Major 6th', semitones: 9, ascendingExample: 'My Bonnie Lies Over the Ocean', descendingExample: 'Nobody Knows the Trouble I\'ve Seen' },
  { name: 'Minor 7th', semitones: 10, ascendingExample: '\'Somewhere\' from West Side Story', descendingExample: 'Christ-mas-es from \'White Christmas\'' },
  { name: 'Major 7th', semitones: 11, ascendingExample: '\'Take On Me\' by A-ha', descendingExample: '\'I Love You\' by Cole Porter' },
  { name: 'Octave', semitones: 12, ascendingExample: 'Somewhere Over the Rainbow', descendingExample: 'Willow Weep for Me' },
];


let score = 0;
let incorrectAttempts = 0;
let correctInterval;

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
      const direction = correctInterval.semitones > 0 ? 'ascending' : 'descending';
      const exampleSong = correctInterval.semitones > 0 ? correctInterval.ascendingExample : correctInterval.descendingExample;
      feedback.textContent = `Incorrect! The correct answer is ${correctInterval.name} (${direction}) as in ${exampleSong}.`;
      feedback.classList.remove('correct');
      feedback.classList.add('incorrect');
      incorrectAttempts++;
    }
    updateScoreDisplay();

    // Disable all interval choice buttons
    const intervalButtonsRow = document.querySelector('.interval-buttons-row');
    for (let button of intervalButtonsRow.children) {
      button.disabled = true;
    }

    drawStaff(currentBaseFrequency, correctInterval);
  }

  function start() {
    intervalButtons.hidden = false;
    startButton.style.display = 'none'; // Hide the start button after it's clicked
    feedback.textContent = ''; // Clear the correct or incorrect message
    correctInterval = generateRandomInterval();

    // Generate a random base pitch from A4 to C5
    const minPitch = 69; // A4 MIDI note number
    const maxPitch = 72; // C5 MIDI note number
    const basePitch = Math.floor(Math.random() * (maxPitch - minPitch + 1)) + minPitch;

    // Calculate the frequency of the base pitch
    const baseFrequency = 440 * Math.pow(2, (basePitch - 69) / 12);

    currentBaseFrequency = baseFrequency; // Store the base frequency

    // Re-enable all interval choice buttons
    const intervalButtonsRow = document.querySelector('.interval-buttons-row');
    for (let button of intervalButtonsRow.children) {
      button.disabled = false;
    }

    // Hide staff container
    const staffContainer = document.getElementById('staff-container');
    staffContainer.hidden = true;

    playNotes(baseFrequency, correctInterval);
  }

function replay() {
    if (correctInterval) {
      playNotes(currentBaseFrequency, correctInterval);
    }
  }

  function getNoteForFrequency(frequency) {
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const referenceFrequency = 440; // A4
    const referenceNote = 9; // A
    const referenceOctave = 4;
  
    const semitonesFromReference = Math.round(12 * Math.log2(frequency / referenceFrequency));
    let noteNumber = (referenceNote + semitonesFromReference) % 12;
    if (noteNumber < 0) {
      noteNumber = 12 + noteNumber;
    }
    const octave = referenceOctave + Math.floor((referenceNote + semitonesFromReference) / 12);
  
    return `${noteStrings[noteNumber]}/${octave}`;
  }
  
  function drawStaff(baseFrequency, interval) {
    const staffContainer = document.getElementById('staff-container');
    staffContainer.innerHTML = ''; // Clear previous staff
    staffContainer.hidden = false;
  
    const renderer = new Vex.Flow.Renderer(staffContainer, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();
    const stave = new Vex.Flow.Stave(10, 30, 400);
  
    stave.addClef('treble').setContext(context).draw();
  
    const note1 = getNoteForFrequency(baseFrequency);
    const note2 = getNoteForFrequency(baseFrequency * Math.pow(2, interval.semitones / 12));

    const staveNote1 = new Vex.Flow.StaveNote({ keys: [note1], duration: 'q' });
    const staveNote2 = new Vex.Flow.StaveNote({ keys: [note2], duration: 'q' });
  
    if (note1.includes('#')) {
      staveNote1.addAccidental(0, new Vex.Flow.Accidental('#'));
    }
  
    if (note2.includes('#')) {
      staveNote2.addAccidental(0, new Vex.Flow.Accidental('#'));
    }
  
    const notes = [staveNote1, staveNote2];
  
    const voice = new Vex.Flow.Voice({ num_beats: 2, beat_value: 4 });
    voice.addTickables(notes);
  
    const formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 300);
    voice.draw(context, stave);
  }  

startButton.addEventListener('click', start);
replayButton.addEventListener('click', replay);
nextIntervalButton.addEventListener('click', start);
setupIntervalButtons();

