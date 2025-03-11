// script.js

console.log("Script.js file is loaded and running!"); // *** BASIC TEST LOG - confirms script is loaded ***

// --- 1. Variable Declarations (Global Scope - some will be initialized in DOMContentLoaded) ---
let timerInterval; // Interval for countdown
let timeLeft;     // Time left in current interval (exercise or rest)
let currentExerciseIndex = 0;
let exercises = [];
let restDuration; // Will be initialized inside DOMContentLoaded from DOM
let timerRunning = false; // Flag to track if timer is running
let pausedTime = 0;      // Variable to store paused time

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
        name: 'Test WebApp',
        exercises: [
            { name: 'A', duration: 10 },
            { name: 'Rest', duration: 7 },
            { name: 'B', duration: 10 },
            { name: 'Rest', duration: 6 },
            { name: 'C', duration: 10 },
        ]
    },
    {
        name: 'Quick Burn',
        exercises: [
            { name: 'Jumping Jacks', duration: 30 },
            { name: 'Rest', duration: 10 },
            { name: 'Squats', duration: 25 },
            { name: 'Rest', duration: 10 },
            { name: 'Push-ups', duration: 20 },
            { name: 'Rest', duration: 10 },
            { name: 'Lunges', duration: 30 },
            { name: 'Rest', duration: 10 },
            { name: 'Plank', duration: 45 }
        ]
    },
    {
        name: 'Leg Day',
        exercises: [
            { name: 'Squats', duration: 40 },
            { name: 'Rest', duration: 20 },
            { name: 'Lunges', duration: 40 },
            { name: 'Rest', duration: 20 },
            { name: 'Calf Raises', duration: 30 }
        ]
    }
];


// --- 3. Function Definitions (Global Scope - IMPORTANT: OUTSIDE DOMContentLoaded) ---

function startTimer() {
    console.log("startTimer() called - FUNCTION START"); // Debug log at function start
    console.log("timerRunning:", timerRunning, "pausedTime:", pausedTime); // Debug log
    timerInterval = undefined; // *** EXPLICITLY RESET timerInterval at start of startTimer() ***
    console.log("startTimer() - BEFORE setting interval - timerInterval reset to:", timerInterval);


    if (!timerRunning) {
        timerRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;

      if (timeLeft === 5) { // **Play Greenwich Pips when timeLeft is exactly 5 seconds (BEFORE exercise ends)**
        console.log("Starting Greenwich Pips countdown at timeLeft:", timeLeft); // Debug log
        playGreenwichPips(); // Play pips 5 seconds before exercise ends
      }


      if (timeLeft <= 0 || isNaN(timeLeft)) { // Check if timeLeft is 0, negative, or NaN (start fresh)
        console.log("Exercise interval finished, timeLeft at end:", timeLeft);
        clearInterval(timerInterval);
  
        console.log("Starting new interval - timeLeft was:", timeLeft);
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
        } else {
          console.log("Resuming interval - timeLeft is:", timeLeft); // Resuming from existing timeLeft
        }

      timerInterval = setInterval(function () {
        if (timerRunning) { // **Check timerRunning INSIDE setInterval callback**
          updateCountdownDisplay();
          if (timeLeft <= 0) {
            console.log("Interval finished, timeLeft at end:", timeLeft);
            clearInterval(timerInterval);
            timerRunning = false;
            playGreenwichPips();
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
          }
          timeLeft--;
        } else {
          console.log("Timer is paused - inside setInterval, timeLeft NOT decremented"); // Log when paused
          // timeLeft is NOT decremented when timerRunning is false (when paused)
        }
      }, 1000);
    }
    console.log("startTimer() finished - FUNCTION END");
}




// --- Revised pauseTimer() function (Simplified) ---
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

function updateCountdownDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startRestTimer() {
    currentExerciseDisplay.textContent = "Rest";
    timeLeft = restDuration;
    console.log("Starting Rest Interval - duration:", restDuration, "seconds");
    timerInterval = undefined; // *** EXPLICITLY RESET timerInterval at start of startRestTimer() ***

    console.log("startRestTimer() - Before setInterval, timerInterval:", timerInterval); // Log BEFORE setInterval in startRestTimer

    timerInterval = setInterval(function() {
        updateCountdownDisplay();

        if (timeLeft <= 0) {
            console.log("Rest interval finished, timeLeft at end:", timeLeft);

            clearInterval(timerInterval);
            timerRunning = false;
            playBeep(); // **Play BEEPS at the END of REST** (SOUND REVERSED - NOW BEEPS FOR REST END)
            currentExerciseIndex++;
            startTimer(); // Start next exercise after rest
        }
        timeLeft--;
    }, 1000);
    console.log("startRestTimer() - After setInterval, timerInterval:", timerInterval); // Log AFTER setInterval in startRestTimer
}


function resetTimer() {
  console.log("resetTimer() called - FUNCTION START"); // Debug log at function start
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
  clearInterval(timerInterval); // Clear any existing interval
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  console.log("resetTimer() finished - FUNCTION END"); // Debug log at function end
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
}


function playBeep() {
  beepSound.play();
}

function playGreenwichPips() {
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
        exercises.push({ name: name, duration: duration });
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
            exercises = [...workout.exercises]; // Load workout exercises
            updateExerciseDisplay();
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