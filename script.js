
// --- 1. Function Definitions (Global Scope - NOT inside DOMContentLoaded) ---

function startTimer() {
  console.log("startTimer() called"); // *** DEBUG LOG ***
  console.log("timerRunning:", timerRunning, "pausedTime:", pausedTime); // *** DEBUG LOG ***

  if (!timerRunning) { // Only start if not already running
    timerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    if (pausedTime > 0) { // **Check if timer was paused**
      timeLeft = pausedTime; // **Resume from paused time**
      pausedTime = 0;       // **Reset pausedTime**
    } else { // **Otherwise, start a new interval (as before)**
      if (exercises.length === 0) {
        currentExerciseDisplay.textContent = "No exercises added!";
        stopTimer(); // Stop timer immediately if no exercises
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

    timerInterval = setInterval(function () {
      updateCountdownDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false; // Timer stopped for this interval
        playBeep();
        currentExerciseIndex++;
        if (currentExerciseIndex < exercises.length) {
          startRestTimer(); // Start rest after exercise
        } else {
          currentExerciseDisplay.textContent = "Workout Complete!";
          countdownDisplay.textContent = "Well done!";
          startBtn.disabled = true; // Disable start after workout complete
          pauseBtn.disabled = true;
          resetBtn.disabled = false; // Allow reset
        }
      }
      timeLeft--;
    }, 1000);
  }
}

function pauseTimer() {
  console.log("pauseTimer() called"); // *** DEBUG LOG ***
  console.log("timerRunning:", timerRunning, "timeLeft:", timeLeft); // *** DEBUG LOG ***

  if (timerRunning) { // Only pause if timer is running
    clearInterval(timerInterval);
    timerRunning = false;
    pausedTime = timeLeft; // **Store the remaining time**
    startBtn.disabled = false;  // Enable Start to resume
    pauseBtn.disabled = true;   // Disable Pause
    resetBtn.disabled = false;
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() { // Define resetTimer and any other timer functions similarly in global scope
  console.log("resetTimer() called - FUNCTION START"); // Debug log at function start
  timerRunning = false;
  pausedTime = 0;
  currentExerciseIndex = 0;
  exercises = []; // Clear exercises (if you want reset to clear the list)
  exerciseListUl.innerHTML = ''; // Clear displayed list
  countdownDisplay.textContent = "00:00";
  currentExerciseDisplay.textContent = "Ready to Start!";
  clearInterval(timerInterval); // Clear any existing interval
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  console.log("resetTimer() finished - FUNCTION END"); // Debug log at function end
}

function createPredefinedExerciseButtons() {
  predefinedExercises.forEach(exercise => {
    const button = document.createElement('button');
    button.textContent = exercise.name;
    button.addEventListener('click', () => {
      exerciseNameInput.value = exercise.name; // Populate exercise name input
      exerciseDurationInput.value = exercise.duration; // Optionally populate duration
    });
    predefinedExerciseButtonsDiv.appendChild(button);
  });
}

function createPredefinedWorkoutButtons() {
  predefinedWorkouts.forEach(workout => {
    const button = document.createElement('button');
    button.textContent = workout.name;
    button.addEventListener('click', () => {
      exercises = []; // Clear current exercises
      exerciseListUl.innerHTML = ''; // Clear displayed list
      restDurationInput.value = workout.restDuration; // Set rest duration from workout
      workout.exercises.forEach(exercise => { // Add exercises from the workout
        exercises.push({ name: exercise.name, duration: exercise.duration });
      });
      updateExerciseListDisplay(); // Update display with loaded workout
      currentExerciseDisplay.textContent = "Workout Loaded!"; // Feedback message
      countdownDisplay.textContent = "Ready to Start"; // Reset timer display
    });
    predefinedWorkoutButtonsDiv.appendChild(button);
  });
}

function playBeep() { // And playBeep, startRestTimer, stopTimer, etc.
  beepSound.play();
}



function startExercise() {
  if (currentExerciseIndex < exercises.length) {
    workoutState = 'exercise';
    const currentExercise = exercises[currentExerciseIndex];
    currentExerciseDisplay.textContent = currentExercise.name;
    timeLeft = currentExercise.duration;
    updateCountdownDisplay();
    timerInterval = setInterval(countdown, 1000);
  } else {
    currentExerciseDisplay.textContent = "Workout Complete!";
    stopTimer();
    resetBtn.disabled = false;
    workoutState = 'idle';
  }
}

function startRest() {
  workoutState = 'rest';
  currentExerciseDisplay.textContent = "Rest";
  const restDuration = parseInt(restDurationInput.value, 10);
  timeLeft = restDuration > 0 ? restDuration : 0;
  updateCountdownDisplay();
  timerInterval = setInterval(countdown, 1000);
}



function updateExerciseListDisplay() {
  exerciseListUl.innerHTML = '';
  exercises.forEach((exercise, index) => {
    const li = document.createElement('li');
    li.textContent = `${exercise.name} - ${exercise.duration} seconds`;
    exerciseListUl.appendChild(li);
  });
}


function countdown() {
  timeLeft--;
  updateCountdownDisplay();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    beepSound.play();

    if (workoutState === 'exercise') {
      startRest();
    } else if (workoutState === 'rest') {
      currentExerciseIndex++;
      startExercise();
    }
  } else if (timeLeft === 5) {
    greenwichPips.play();
  }
}

function updateCountdownDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  countdownDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// --- 2. DOMContentLoaded Event Listener (for DOM-related setup) ---

document.addEventListener('DOMContentLoaded', () => {

  const exerciseNameInput = document.getElementById('exercise-name');
  const exerciseDurationInput = document.getElementById('exercise-duration');
  const addExerciseBtn = document.getElementById('add-exercise-btn');
  const exerciseListUl = document.getElementById('exercise-list');
  const currentExerciseDisplay = document.getElementById('current-exercise');
  const countdownDisplay = document.getElementById('countdown');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const beepSound = document.getElementById('beep-sound');
  const greenwichPips = document.getElementById('greenwich-pips');
  const restDurationInput = document.getElementById('rest-duration');
  const predefinedExerciseButtonsDiv = document.getElementById('predefined-exercise-buttons');
  const predefinedWorkoutButtonsDiv = document.getElementById('predefined-workout-buttons');
  const predefinedExercisesContainer = document.getElementById('predefined-exercises-container');
  const togglePredefinedExercisesBtn = document.getElementById('toggle-predefined-exercises-btn');



  // **Predefined Exercise List:**
  const predefinedExercises = [
    { name: "Jumping Jacks", duration: 30 },
    { name: "Wall Sit", duration: 45 },
    { name: "Push-ups", duration: 25 },
    { name: "Crunches", duration: 30 },
    { name: "Squats", duration: 35 },
    { name: "Plank", duration: 60 },
    { name: "High Knees", duration: 30 },
    { name: "Lunges", duration: 30 },
    { name: "Burpees", duration: 20 },
    { name: "Mountain Climbers", duration: 30 }
    // Add more exercises to this list as needed!
  ];

  const predefinedWorkouts = [
    {
      name: "Quick Blast",
      restDuration: 10, // Rest duration in seconds for this workout
      exercises: [
        { name: "Jumping Jacks", duration: 30 },
        { name: "Push-ups", duration: 20 },
        { name: "Squats", duration: 30 },
        { name: "Plank", duration: 45 }
      ]
    },
    {
      name: "Endurance Builder",
      restDuration: 15,
      exercises: [
        { name: "Lunges", duration: 40 },
        { name: "Wall Sit", duration: 60 },
        { name: "High Knees", duration: 40 },
        { name: "Crunches", duration: 35 },
        { name: "Burpees", duration: 25 }
      ]
    },
    // Add more predefined workouts here!
    {
      name: "NYT HIIT beginners", // https://www.nytimes.com/2025/02/08/well/move/cardio-hiit-workout.html
      restDuration: 10,
      exercises: [
        { name: "High Knees", duration: 20 }, // round 1
        { name: "Plank Punches", duration: 20 },
        { name: "Jumping Jacks", duration: 20 },
        { name: "Side Skaters", duration: 20 },
        { name: "High Knees", duration: 20 },
        { name: "Plank Punches", duration: 20 },
        { name: "Jumping Jacks", duration: 20 },

        { name: "Jump Rope", duration: 20 },  // round 2
        { name: "High/Low Boat", duration: 20 },
        { name: "Line Jumps", duration: 20 },
        { name: "Push-Ups", duration: 20 },
        { name: "Jump Rope", duration: 20 },
        { name: "High/Low Boat", duration: 20 },
        { name: "Line Jumps", duration: 20 },
        { name: "Push-Ups", duration: 20 },

        { name: "Burpees", duration: 20 },  // round 3
        { name: "Russian Twists", duration: 20 },
        { name: "Squats", duration: 20 },
        { name: "Lunges", duration: 20 },
        { name: "Burpees", duration: 20 },
        { name: "Russian Twists", duration: 20 },
        { name: "Squats", duration: 20 },
        { name: "Lunges", duration: 20 },

        { name: "Mountain limbers", duration: 20 },  // round 4
        { name: "Push-Ups", duration: 20 },
        { name: "Split Squats", duration: 20 },
        { name: "Box Jumps", duration: 20 },
        { name: "Mountain limbers", duration: 20 }, 
        { name: "Push-Ups", duration: 20 },
        { name: "Split Squats", duration: 20 },
        { name: "Box Jumps", duration: 20 },
        
      ]
    }
  ];


  // **Event listener for the "Toggle Quick Add Exercises" button:**
  togglePredefinedExercisesBtn.addEventListener('click', () => {
    if (predefinedExercisesContainer.style.display === 'none') {
      // If currently hidden, show it
      predefinedExercisesContainer.style.display = 'block'; /* Or 'flex' if you were using flexbox layout inside */
      togglePredefinedExercisesBtn.textContent = 'Hide Quick Add Exercises'; // Change button text
    } else {
      // If currently visible, hide it
      predefinedExercisesContainer.style.display = 'none';
      togglePredefinedExercisesBtn.textContent = 'Show Quick Add Exercises'; // Change button text back
    }
  });

  // let isRunning = false;
  let workoutState = 'idle';
  let exercises = [];
  let timerInterval; // Interval for countdown
  let timeLeft;     // Time left in current interval (exercise or rest)
  let currentExerciseIndex = 0;
  let restDuration = parseInt(document.getElementById('rest-duration').value);
  let timerRunning = false; // **NEW: Flag to track if timer is running**
  let pausedTime = 0;      // **NEW: Variable to store paused time**

  // **Call the function to create workout buttons when page loads:**
  createPredefinedWorkoutButtons();

  // **Call the function to create buttons when the page loads:**
  createPredefinedExerciseButtons();


  addExerciseBtn.addEventListener('click', () => {
    const name = exerciseNameInput.value.trim();
    const duration = parseInt(exerciseDurationInput.value, 10);

    if (name && !isNaN(duration) && duration > 0) {
      exercises.push({ name, duration });
      exerciseNameInput.value = '';
      exerciseDurationInput.value = '20';
      updateExerciseListDisplay();
    }
  });


  startBtn.addEventListener('click', function() {
    console.log("Start button CLICKED! (Basic Listener Test)"); // *** VERY BASIC LOG ***

    if (exercises.length === 0 || timerRunning) return;

    timerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    currentExerciseIndex = 0;
    startExercise();
  });

  pauseBtn.addEventListener('click', function() {
    console.log("Pause button CLICKED! (Basic Listener Test)"); // *** VERY BASIC LOG ***

    if (timerRunning) {
      timerRunning = false;
      clearInterval(timerInterval);
      pauseBtn.disabled = true;
      startBtn.disabled = false;
    }
  });

  resetBtn.addEventListener('click', function() {
    console.log("Reset button CLICKED! (Basic Listener Test)"); // *** VERY BASIC LOG ***

    stopTimer();
    timerRunning = false;
    exercises = [];
    updateExerciseListDisplay();
    currentExerciseIndex = 0;
    currentExerciseDisplay.textContent = "Ready to Start!";
    countdownDisplay.textContent = "00:00";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    workoutState = 'idle';
  });

});