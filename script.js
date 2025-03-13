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
    exercises: [ // Exercises only, NO "Rest" intervals defined here anymore
      { name: 'Jumping Jacks', duration: 30 },
      { name: 'Squats', duration: 25 },
      { name: 'Push-ups', duration: 20 },
      { name: 'Lunges', duration: 30 },
      { name: 'Plank', duration: 45 }
    ]
  },
  {
    name: 'Leg Day',
    exercises: [ // Exercises only
      { name: 'Squats', duration: 40 },
      { name: 'Lunges', duration: 40 },
      { name: 'Calf Raises', duration: 30 }
    ]
  }
];


// --- 3. Function Definitions (Global Scope - IMPORTANT: OUTSIDE DOMContentLoaded) ---


function startTimer() {
  console.log("Starting timer");
  clearInterval(timerInterval);
  timerInterval = undefined;

  if (!timerRunning) {
    timerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    if (timeLeft > 0) {
      // Resuming current interval
      console.log("Resuming from paused timeLeft:", timeLeft);
    } else if (exercises.length > 0 && currentExerciseIndex < exercises.length) {
      // Fresh start of exercise
      let exercise = exercises[currentExerciseIndex];
      timeLeft = exercise.duration;
      currentExerciseDisplay.textContent = exercise.name;
    } else {
      // No exercises remaining or added
      currentExerciseDisplay.textContent = "No exercises added!";
      return;
    }

    timerInterval = setInterval(function () {
      updateCountdownDisplay();

      // Check to play Greenwich Pips at 5 seconds remaining
      if (timeLeft === 5) {
        playGreenwichPips(); // Play sound when there are 5 seconds left
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
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
      } else {
        timeLeft--; // Decrement the time left
      }
    }, 1000); // Check every second
  }
}

function pauseTimer() {
  console.log("Pausing timer");
  if (timerRunning) {
    timerRunning = false; // Set timerRunning to false
    clearInterval(timerInterval); // Stop the interval
    console.log("Timer paused - timerRunning set to FALSE, timerInterval cleared:", timerInterval);
    startBtn.disabled = false; // Enable start button
    pauseBtn.disabled = true; // Disable pause button
    resetBtn.disabled = false; // Enable reset button
  }
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

function startRestTimer() {
  console.log("Starting Rest Interval - duration:", restDuration, "seconds");

  // Clear any existing intervals
  clearInterval(timerInterval);
  timerInterval = undefined; // Explicitly reset timerInterval

  // Initialize the time left for the rest period
  timeLeft = restDuration;
  currentExerciseDisplay.textContent = "Rest";

  timerRunning = true; // Start the timer
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;

  // Set the interval for the rest countdown
  timerInterval = setInterval(function () {
    if (!timerRunning) return; // If paused, do nothing

    updateCountdownDisplay(); // Update the countdown display with the remaining time

    // // Check to play Greenwich Pips (not in rest intervals)
    // if (timeLeft > 0 && timeLeft === 5) {
    //   playBeep(); // Play sound when there are 5 seconds left
    // }

    if (timeLeft <= 0) {
      console.log("Finished Rest Interval, transitioning to next exercise");
      clearInterval(timerInterval); // Clear the rest interval
      playBeep(); // Play beep sound to indicate end of rest
      timerRunning = false; // Stop the timer

      // Move to the next exercise if available
      currentExerciseIndex++;
      if (currentExerciseIndex < exercises.length) {
        startTimer(); // Start the next exercise
      } else {
        currentExerciseDisplay.textContent = "Workout Complete!";
        countdownDisplay.textContent = "Well done!";
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        resetBtn.disabled = false; // Enable reset button
      }
    } else {
      timeLeft--; // Decrement the time left
    }
  }, 1000); // Check every second
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