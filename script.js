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

  let exercises = [];
  let currentExerciseIndex = 0;
  let timerInterval;
  let timeLeft;
  let isRunning = false;
  let workoutState = 'idle';

  // **Function to create and add predefined exercise buttons:**
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

  // **Function to create and add predefined workout buttons:**
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

  function updateExerciseListDisplay() {
    exerciseListUl.innerHTML = '';
    exercises.forEach((exercise, index) => {
      const li = document.createElement('li');
      li.textContent = `${exercise.name} - ${exercise.duration} seconds`;
      exerciseListUl.appendChild(li);
    });
  }

  startBtn.addEventListener('click', () => {
    if (exercises.length === 0 || isRunning) return;

    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    currentExerciseIndex = 0;
    startExercise();
  });

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

  pauseBtn.addEventListener('click', () => {
    if (isRunning) {
      isRunning = false;
      clearInterval(timerInterval);
      pauseBtn.disabled = true;
      startBtn.disabled = false;
    }
  });

  resetBtn.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
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

  function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
  }

});