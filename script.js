// script.js

console.log("Script.js file is loaded and running!"); // *** BASIC TEST LOG - confirms script is loaded ***

// --- 1. Variable Declarations (Global Scope - some initialized in DOMContentLoaded) ---
let timerInterval; // Interval for countdown
let timeLeft;     // Time left in current interval (exercise or rest)
let currentExerciseIndex = 0;
let exercises = [];
let restDuration; // Will be initialized inside DOMContentLoaded from DOM
let timerRunning = false; // Flag to track if timer is running
let pausedTime = 0;      // Variable to store paused time (no longer used in latest version, but kept for now)

let countdownDisplay; // Will be initialized in DOMContentLoaded from DOM
let currentExerciseDisplay; // Will be initialized in DOMContentLoaded from DOM
let startBtn; // Will be initialized in DOMContentLoaded from DOM
let pauseBtn; // Will be initialized in DOMContentLoaded from DOM
let resetBtn; // Will be initialized in DOMContentLoaded from DOM
let exerciseListUl; // Will be initialized in DOMContentLoaded from DOM
let exerciseNameInput; // Will be initialized in DOMContentLoaded from DOM
let exerciseDurationInput; // Will be initialized in DOMContentLoaded from DOM
let addExerciseBtn; // Will be initialized in DOMContentLoaded from DOM
let restDurationInput; // Will be initialized in DOMContentLoaded from DOM
let beepSound; // Will be initialized in DOMContentLoaded from DOM
let greenwichPips; // Will be initialized in DOMContentLoaded from DOM
let predefinedExerciseButtonsDiv; // Will be initialized in DOMContentLoaded from DOM
let predefinedWorkoutButtonsDiv; // Will be initialized in DOMContentLoaded from DOM
let predefinedExercisesContainer; // Will be initialized in DOMContentLoaded from DOM
let togglePredefinedExercisesBtn; // Will be initialized in DOMContentLoaded from DOM


// --- 2. Predefined Data (Global Scope) ---
const predefinedExercises = [
  { name: 'Jumping Jacks', duration: 30 },
  { name: 'Squats', duration: 25 },
  { name: 'Push-ups', duration: 20 },
  { name: 'Lunges', duration: 30 },
  { name: 'Plank', duration: 45 }
];

const predefinedWorkouts = [
  {
    name: 'Quick Burn',
    exercises: [
      { name: 'Jumping Jacks', duration: 30 },
      { name: 'Squats', duration: 25 },
      { name: 'Push-ups', duration: 20 },
      { name: 'Lunges', duration: 30 },
      { name: 'Plank', duration: 45 }
    ]
  },
  {
    name: 'Leg Day',
    exercises: [
      { name: 'Squats', duration: 40 },
      { name: 'Lunges', duration: 40 },
      { name: 'Calf Raises', duration: 30 }
    ]
  }
];


// --- 3. Function Definitions (Global Scope - IMPORTANT: OUTSIDE DOMContentLoaded) ---
function startTimer() {
  console.log("startTimer() called - FUNCTION START");
  console.log("timerRunning:", timerRunning, "timeLeft:", timeLeft);

  timerInterval = undefined; // *** EXPLICITLY RESET timerInterval at start of startTimer() ***
  console.log("startTimer() - BEFORE setting interval - timerInterval reset to:", timerInterval);

  if (!timerRunning) {
    timerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    // --- RESUME LOGIC IS NOW SIMPLIFIED and CHECKING timeLeft DIRECTLY ---
    if (timeLeft > 0) { // **CHECK if timeLeft is ALREADY > 0 - if yes, it's a RESUME**
      console.log("Resuming interval - timeLeft is:", timeLeft); // RESUME SCENARIO
      // **timeLeft is already set to the paused value, so NO need to reset it here.**
    } else {
      console.log("Starting new exercise interval - timeLeft was:", timeLeft); // NEW INTERVAL SCENARIO
      if (exercises.length === 0) {
        currentExerciseDisplay.textContent = "No exercises added!";
        stopTimer();
        return;
      }
      if (currentExerciseIndex < exercises.length) {
        timeLeft = exercises[currentExerciseIndex].duration;
        currentExerciseDisplay.textContent = exercises[currentExerciseIndex].name;
      } else {
        currentExerciseDisplay.textContent = "Workout Complete!";
        stopTimer();
        return;
      }
    }


    console.log("startTimer() - Before setInterval, timerInterval:", timerInterval);
    timerInterval = setInterval(function () {
      if (timerRunning) { // **Check timerRunning INSIDE setInterval callback**
        updateCountdownDisplay();

        if (timeLeft === 5) { // **Play Greenwich Pips when timeLeft is exactly 5 seconds (BEFORE exercise ends)**
          console.log("Starting Greenwich Pips countdown at timeLeft:", timeLeft);
          playGreenwichPips();
        }

        if (timeLeft <= 0) {
          console.log("Exercise interval finished, timeLeft at end:", timeLeft);
          clearInterval(timerInterval);
          // timerRunning = false; // Delayed setting
          // playGreenwichPips(); // DO NOT play pips again HERE
          currentExerciseIndex++;
          if (currentExerciseIndex < exercises.length) {
            startRestTimer();
          } else {
            currentExerciseDisplay.textContent = "Workout Complete!";
            countdownDisplay.textContent = "Well done!";
            startBtn.disabled = true;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
          }
          timerRunning = false; // *** NEW POSITION: Set timerRunning=false LAST ***
        }
        timeLeft--;
      } else {
        console.log("Timer is paused - inside setInterval, timeLeft NOT decremented");
      }
    }, 1000);
    console.log("startTimer() - After setInterval, timerInterval:", timerInterval);
  }
  console.log("startTimer() finished - FUNCTION END");
}

function pauseTimer() {
  console.log("pauseTimer() called - FUNCTION START");
  console.log("pauseTimer() - timerRunning:", timerRunning, "timeLeft:", timeLeft, "timerInterval:", timerInterval);

  if (timerRunning) {
    timerRunning = false; // **Just set timerRunning to false** - to stop decrementing in setInterval
    clearInterval(timerInterval); // Still clear the interval for safety and to prevent potential memory leaks
    console.log("Timer paused - timerRunning set to FALSE, timerInterval cleared:", timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
  } else {
    console.log("pauseTimer() - timerRunning is FALSE, pause action skipped");
  }
  console.log("pauseTimer() finished - FUNCTION END");
}

function resetTimer() {
  console.log("resetTimer() called - FUNCTION START");
  console.log("resetTimer() - timerInterval BEFORE clearInterval:", timerInterval); // Log BEFORE clearInterval in resetTimer
  clearInterval(timerInterval);
  timerInterval = undefined; // Explicitly set to undefined
  console.log("resetTimer() - timerInterval AFTER clearInterval:", timerInterval); // Log AFTER clearInterval in resetTimer
  timerRunning = false;
  pausedTime = 0;
  currentExerciseIndex = 0;
  exercises = []; // Clear exercises when reset
  exerciseListUl.innerHTML = ''; // Clear displayed exercise list
  countdownDisplay.textContent = "00:00";
  currentExerciseDisplay.textContent = "Ready to Start!";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  console.log("resetTimer() finished - FUNCTION END");
}

function updateCountdownDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  countdownDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function playBeep() {
  beepSound.play();
}

// function startRestTimer() {
//   currentExerciseDisplay.textContent = "Rest";
//   timeLeft = restDuration;
//   console.log("Starting Rest Interval - duration:", restDuration, "seconds");

//   timerInterval = undefined; // *** EXPLICITLY RESET timerInterval at start of startRestTimer() ***
//   console.log("startRestTimer() - BEFORE setting interval - timerInterval reset to:", timerInterval); // Log reset value


//   console.log("startRestTimer() - Before setInterval, timerInterval:", timerInterval);
//   timerInterval = setInterval(function () {
//     updateCountdownDisplay();
//     if (timeLeft <= 0) {
//       console.log("Rest interval finished, timeLeft at end:", timeLeft);
//       clearInterval(timerInterval);
//       timerRunning = false;
//       playBeep();
//       currentExerciseIndex++;
//       startTimer();
//     }
//     timeLeft--;
//   }, 1000);
//   console.log("startRestTimer() - After setInterval, timerInterval:", timerInterval);
// }

function startRestTimer() {
  currentExerciseDisplay.textContent = "Rest";
  console.log("Starting Rest Interval - duration:", restDuration, "seconds");

  timerInterval = undefined; // *** EXPLICITLY RESET timerInterval at start of startRestTimer() ***
  console.log("startRestTimer() - BEFORE setting interval - timerInterval reset to:", timerInterval); // Log reset value


  if (!timerRunning) {
    timerRunning = true; // Set timerRunning to true at start of rest interval
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;


    // --- RESUME LOGIC for REST INTERVAL ---
    if (timeLeft > 0) { // **CHECK if timeLeft is ALREADY > 0 - if yes, it's a RESUME for REST**
      console.log("Resuming REST interval - timeLeft is:", timeLeft); // RESUME SCENARIO for REST
      // **timeLeft is already set to the paused value, NO need to reset.**
    } else {
      console.log("Starting NEW REST interval - timeLeft was:", timeLeft, "now set to restDuration:", restDuration); // NEW REST INTERVAL SCENARIO
      timeLeft = restDuration; // **SET timeLeft to restDuration for NEW REST interval (only if not resuming)**
    }
    console.log("startRestTimer() - timeLeft at START of rest interval:", timeLeft); // Log timeLeft at start of rest interval


    console.log("startRestTimer() - Before setInterval, timerInterval:", timerInterval);
    timerInterval = setInterval(function () {
      updateCountdownDisplay();
      if (timeLeft <= 0) {
        console.log("Rest interval finished, timeLeft at end:", timeLeft);
        clearInterval(timerInterval);
        timerRunning = false;
        playBeep();
        currentExerciseIndex++;
        startTimer();
      }
      timeLeft--;
    }, 1000);
    console.log("startRestTimer() - After setInterval, timerInterval:", timerInterval);
  }
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = false;
}

function playGreenwichPips() {
  console.log("playGreenwichPips() called - playing pips now");
  greenwichPips.play();
}


function updateExerciseDisplay() {
  exerciseListUl.innerHTML = ''; // Clear existing list
  exercises.forEach((exercise, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${exercise.name} (${exercise.duration} seconds) `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-exercise-btn'); // Add class for styling if needed
    deleteButton.addEventListener('click', () => {
      exercises.splice(index, 1); // Remove exercise from array
      updateExerciseDisplay(); // Re-render the list
    });
    listItem.appendChild(deleteButton);
    exerciseListUl.appendChild(listItem);
  });
}


function addExercise() {
  const name = exerciseNameInput.value.trim();
  const duration = parseInt(exerciseDurationInput.value);
  if (name && !isNaN(duration) && duration > 0) {
    exercises.push({ name: name, duration: duration }); // Add the exercise
    exercises.push({ name: 'Rest', duration: parseInt(restDurationInput.value) }); // **Always** Dynamically ADD a "Rest" interval AFTER manual exercise

    // *** REMOVED ALL exercises.pop() LOGIC - it was incorrect and causing problems for manual add ***

    exerciseNameInput.value = '';
    exerciseDurationInput.value = '20'; // Reset to default value
    updateExerciseDisplay();
  }
}

function createPredefinedExerciseButtons() {
  predefinedExercises.forEach(exercise => {
    const button = document.createElement('button');
    button.textContent = exercise.name;
    button.addEventListener('click', () => {
      exerciseNameInput.value = exercise.name;
      exerciseDurationInput.value = String(exercise.duration);
    });
    predefinedExerciseButtonsDiv.appendChild(button);
  });
}

function createPredefinedWorkoutButtons() {
  predefinedWorkouts.forEach(workout => {
    const button = document.createElement('button');
    button.textContent = workout.name;
    button.addEventListener('click', () => {
      exercises = []; // Clear any existing exercises first
      workout.exercises.forEach(exercise => { // Loop through exercises in the predefined workout
        exercises.push(exercise); // Add the exercise itself to the workout list
        exercises.push({ name: 'Rest', duration: parseInt(restDurationInput.value) }); // **Dynamically ADD a "Rest" interval AFTER EACH EXERCISE**
        // The duration of the "Rest" is taken from the current value of the "Rest Duration" input field.
      });
      exercises.pop(); // **IMPORTANT:** Remove the *last* "Rest" interval added, because we don't want a rest period after the final exercise of the workout.
      updateExerciseDisplay(); // Update the displayed exercise list to show the loaded workout (including dynamically added rests).
    });
    predefinedWorkoutButtonsDiv.appendChild(button);
  });
}


// --- 4. DOMContentLoaded Event Listener (for DOM element access and event listeners) ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded - Script is running and DOM is ready!"); // Keep this log

  // --- Get references to HTML elements (inside DOMContentLoaded) ---
  countdownDisplay = document.getElementById('countdown');
  currentExerciseDisplay = document.getElementById('current-exercise');
  startBtn = document.getElementById('start-btn');
  pauseBtn = document.getElementById('pause-btn');
  resetBtn = document.getElementById('reset-btn');
  exerciseListUl = document.getElementById('exercise-list');
  exerciseNameInput = document.getElementById('exercise-name');
  exerciseDurationInput = document.getElementById('exercise-duration');
  addExerciseBtn = document.getElementById('add-exercise-btn');
  restDurationInput = document.getElementById('rest-duration');
  beepSound = document.getElementById('beep-sound');
  greenwichPips = document.getElementById('greenwich-pips');
  predefinedExerciseButtonsDiv = document.getElementById('predefined-exercise-buttons');
  predefinedWorkoutButtonsDiv = document.getElementById('predefined-workout-buttons');
  predefinedExercisesContainer = document.getElementById('predefined-exercises-container');
  togglePredefinedExercisesBtn = document.getElementById('toggle-predefined-exercises-btn');
  togglePredefinedExercisesBtn.addEventListener('click', () => {
    predefinedExercisesContainer.classList.toggle('hidden');
  });


  // --- Initialize restDuration (from DOM element - inside DOMContentLoaded) ---
  restDuration = parseInt(restDurationInput.value);


  // --- Attach Event Listeners (inside DOMContentLoaded - calling globally defined functions) ---
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  addExerciseBtn.addEventListener('click', addExercise);


  // --- Create Predefined Buttons (inside DOMContentLoaded - needs DOM elements) ---
  createPredefinedExerciseButtons();
  createPredefinedWorkoutButtons();
  updateExerciseDisplay(); // Initial exercise list display

}); // End of DOMContentLoaded event listener