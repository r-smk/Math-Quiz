const OPERATORS = ["+", "-", "*", "/", "%"];

const MIN_VALUE = 0;
const MAX_VALUE = 10;

const DIFFICULTY_EASY = 1;
const DIFFICULTY_MEDIUM = 2;
const DIFFICULTY_HARD = 3;

const questionDiv = document.querySelector(".question");
const optionsDivs = document.querySelectorAll(".option");

const timerDiv = document.querySelector(".timer");
const scoreDiv = document.querySelector(".score");

let correctDivId = 0;
let questionsSolved = 0;
let remainingSecs = 30;
let currentDifficulty = DIFFICULTY_EASY;

// generates number from [min, max]
const getRandomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomOperator = () => {
  const choice = getRandomNumber(0, OPERATORS.length - 1);
  return OPERATORS[choice];
};

const getQuestion = (difficulty = DIFFICULTY_EASY) => {
  if (questionsSolved >= 15) {
    difficulty = DIFFICULTY_HARD;
  } else if (questionsSolved >= 7) {
    difficulty = DIFFICULTY_MEDIUM;
  }

  const operator = getRandomOperator();
  const operand1 = getRandomNumber(MIN_VALUE, MAX_VALUE ** difficulty);
  const operand2 = getRandomNumber(
    MIN_VALUE,
    MAX_VALUE ** Math.min(2, difficulty)
  );

  return [operator, operand1, operand2];
};

const getSolution = (operator, operand1, operand2) => {
  if (operator === "+") {
    return operand1 + operand2;
  } else if (operator === "-") {
    return operand1 - operand2;
  } else if (operator === "*") {
    return operand1 * operand2;
  } else if (operator === "/") {
    const result = operand1 / operand2;
    return Number(result.toFixed(2));
  } else {
    return operand1 % operand2;
  }
};

const getOptions = (operator, answer) => {
  if (answer === Infinity || answer === NaN) {
    return ["0", "1", "None of the Above"];
  }

  // 51.55 will be treated as 51 and numOfDigits = 2
  // Math.abs(answer) because -5 is converted to string of lenght 2 (but it should be 1)
  const numOfDigits = Math.floor(Math.abs(answer)).toString().length;

  let choice1 = answer + Math.max(1, 10 * getRandomNumber(0, numOfDigits - 1));
  let choice2 = answer - Math.max(1, 10 * getRandomNumber(0, numOfDigits - 1));
  let choice3 = answer + Math.max(2, 10 * getRandomNumber(0, numOfDigits - 1));

  // for randomly generating case, if both choice1 and choice2 generated same number.
  if (choice1 === choice3) {
    choice3 = answer - 2;
  }

  /*
    For the Case, 
    1.2 - 1 gives 0.19999999999999996
    So, truncating to 2 decimals. 
    */
  if (operator === "/") {
    choice1 = Number(choice1.toFixed(2));
    choice2 = Number(choice2.toFixed(2));
    choice3 = Number(choice3.toFixed(2));
  }

  return [choice1, choice2, choice3];
};

const shuffleArray = (array) => {
  // OfCourse the length will always be 4 (But wanted to make it more generic)
  const arrayLength = array.length;

  for (let currIndex = 0; currIndex < arrayLength; currIndex++) {
    const randomIndex = getRandomNumber(0, arrayLength - 1);

    // Swapping the values
    let temp = array[currIndex];
    array[currIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
};

const endGame = () => {
  clearInterval(timerId);
  optionsDivs.forEach((option) =>
    option.removeEventListener("click", optionHandler)
  );
  console.log("Game End");
};

const optionHandler = (event) => {
  const option = event.target;

  if (option.id == correctDivId) {
    option.style.backgroundColor = "green";

    setTimeout(() => {
      option.style.backgroundColor = "white";
      questionsSolved++;
      updateScore();
      generateQuestion();
    }, 200);
  } else {
    option.style.backgroundColor = "red";
    endGame();
  }
};

const addEventListenersToOptions = () => {
  optionsDivs.forEach((option) => {
    option.addEventListener("click", optionHandler);
  });
};

const timerId = setInterval(() => {
  remainingSecs--;
  timerDiv.textContent = remainingSecs;

  if (remainingSecs == 0) {
    console.log("Time Finished");
    endGame();
  }
}, 1000);

const updateScore = () => {
  scoreDiv.textContent = `Score : ${questionsSolved}`;
};

const generateQuestion = () => {
  const [operator, operand1, operand2] = getQuestion(currentDifficulty);
  const answer = getSolution(operator, operand1, operand2);

  let options = [answer].concat(getOptions(operator, answer));
  shuffleArray(options);

  questionDiv.textContent = `${operand1}   ${operator}   ${operand2}`;

  for (let i = 0; i < 4; i++) {
    if (options[i] == answer) {
      correctDivId = i + 1;
    }
    optionsDivs[i].textContent = options[i];
  }
};

const startGame = () => {
  generateQuestion();
  addEventListenersToOptions();
};

startGame();
