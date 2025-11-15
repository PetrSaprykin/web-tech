class MathGame {
  constructor() {
    this.levels = ["начальный", "средний", "продвинутый"];
    this.currentLevel = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentQuestion = 0;
    this.usedQuestions = new Set();
    this.isGameActive = false;

    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.startScreen = document.getElementById("start-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.resultScreen = document.getElementById("result-screen");

    this.levelElement = document.getElementById("level");
    this.correctElement = document.getElementById("correct");
    this.incorrectElement = document.getElementById("incorrect");
    this.questionNumberElement = document.getElementById("question-number");

    this.questionElement = document.getElementById("question");
    this.answersElement = document.getElementById("answers");
    this.feedbackElement = document.getElementById("feedback");

    this.resultTitle = document.getElementById("result-title");
    this.resultMessage = document.getElementById("result-message");
  }

  attachEventListeners() {
    document
      .getElementById("start-btn")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("restart-btn")
      .addEventListener("click", () => this.restartGame());
    document
      .getElementById("exit-btn")
      .addEventListener("click", () => this.exitGame());
  }

  startGame() {
    this.resetGame();
    this.showScreen(this.gameScreen);
    this.generateQuestion();
  }

  restartGame() {
    this.resetGame();
    this.showScreen(this.gameScreen);
    this.generateQuestion();
  }

  exitGame() {
    this.resetGame();
    this.showScreen(this.startScreen);
  }

  resetGame() {
    this.currentLevel = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentQuestion = 0;
    this.usedQuestions.clear();
    this.isGameActive = true;

    this.updateStats();
    this.levelElement.textContent = this.levels[this.currentLevel];
  }

  showScreen(screen) {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));
    screen.classList.add("active");
  }

  updateStats() {
    this.correctElement.textContent = this.correctAnswers;
    this.incorrectElement.textContent = this.incorrectAnswers;
    this.questionNumberElement.textContent = this.currentQuestion + 1;
    this.levelElement.textContent = this.levels[this.currentLevel];
  }

  generateQuestion() {
    if (this.currentQuestion >= 10) {
      this.finishLevel();
      return;
    }

    let question, correctAnswer, answers;

    do {
      switch (this.currentLevel) {
        case 0: // начальный
          ({ question, correctAnswer, answers } = this.generateBasicQuestion());
          break;
        case 1: // средний
          ({ question, correctAnswer, answers } =
            this.generateIntermediateQuestion());
          break;
        case 2: // продвинутый
          ({ question, correctAnswer, answers } =
            this.generateAdvancedQuestion());
          break;
      }
    } while (this.usedQuestions.has(question));

    this.usedQuestions.add(question);
    this.displayQuestion(question, correctAnswer, answers);
  }

  generateBasicQuestion() {
    const operators = ["+", "-", "*"];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a, b, result;

    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        result = a + b;
        break;
      case "-":
        a = Math.floor(Math.random() * 50) + 25;
        b = Math.floor(Math.random() * 25) + 1;
        result = a - b;
        break;
      case "*":
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        result = a * b;
        break;
    }

    const question = `${a} ${op} ${b} = ?`;
    const answers = this.generateAnswers(result);

    return { question, correctAnswer: result, answers };
  }

  generateIntermediateQuestion() {
    const types = ["arithmetic", "comparison"];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === "arithmetic") {
      return this.generateBasicQuestion();
    } else {
      const operators = [">", "<", "==="];
      const op = operators[Math.floor(Math.random() * operators.length)];
      const a = Math.floor(Math.random() * 100) + 1;
      const b = Math.floor(Math.random() * 100) + 1;

      let result;
      switch (op) {
        case ">":
          result = a > b;
          break;
        case "<":
          result = a < b;
          break;
        case "===":
          result = a === b;
          break;
      }

      const question = `${a} ${op} ${b}`;
      const answers = [true, false];

      return { question, correctAnswer: result, answers };
    }
  }

  generateAdvancedQuestion() {
    const types = ["logic", "binary"];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === "logic") {
      const operators = ["&&", "||"];
      const op = operators[Math.floor(Math.random() * operators.length)];
      const a = Math.random() > 0.5;
      const b = Math.random() > 0.5;

      let result;
      switch (op) {
        case "&&":
          result = a && b;
          break;
        case "||":
          result = a || b;
          break;
      }

      const question = `${a} ${op} ${b}`;
      const answers = [true, false];

      return { question, correctAnswer: result, answers };
    } else {
      const a = Math.floor(Math.random() * 16);
      const b = Math.floor(Math.random() * 16);
      const operators = ["&", "|", "^"];
      const op = operators[Math.floor(Math.random() * operators.length)];

      let result;
      switch (op) {
        case "&":
          result = a & b;
          break;
        case "|":
          result = a | b;
          break;
        case "^":
          result = a ^ b;
          break;
      }

      const question = `${a.toString(2)} ${op} ${b.toString(2)} (в десятичной)`;
      const answers = this.generateAnswers(result);

      return { question, correctAnswer: result, answers };
    }
  }

  generateAnswers(correctAnswer) {
    const answers = new Set([correctAnswer]);

    while (answers.size < 4) {
      let variation;
      if (typeof correctAnswer === "boolean") {
        variation = !correctAnswer;
      } else {
        const offset = Math.floor(Math.random() * 10) + 1;
        variation = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
        variation = Math.max(0, variation);
      }
      answers.add(variation);
    }

    return this.shuffleArray([...answers]);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  displayQuestion(question, correctAnswer, answers) {
    this.questionElement.textContent = question;
    this.answersElement.innerHTML = "";
    this.feedbackElement.textContent = "";
    this.feedbackElement.className = "feedback";

    answers.forEach((answer) => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.textContent = answer.toString();
      button.addEventListener("click", () =>
        this.checkAnswer(answer, correctAnswer)
      );
      this.answersElement.appendChild(button);
    });

    this.updateStats();
  }

  checkAnswer(selectedAnswer, correctAnswer) {
    if (!this.isGameActive) return;

    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      this.correctAnswers++;
      this.feedbackElement.textContent = "Правильно! ✓";
      this.feedbackElement.className = "feedback correct";
    } else {
      this.incorrectAnswers++;
      this.feedbackElement.textContent = `Неправильно! Правильный ответ: ${correctAnswer}`;
      this.feedbackElement.className = "feedback incorrect";
    }

    this.updateStats();
    this.currentQuestion++;

    setTimeout(() => {
      if (this.currentQuestion < 10) {
        this.generateQuestion();
      } else {
        this.finishLevel();
      }
    }, 1500);
  }

  finishLevel() {
    const successRate = (this.correctAnswers / 10) * 100;

    if (successRate >= 80 && this.currentLevel < 2) {
      this.currentLevel++;
      this.currentQuestion = 0;
      this.usedQuestions.clear();

      if (this.currentLevel < 3) {
        this.resultTitle.textContent = "Поздравляем!";
        this.resultMessage.textContent = `Вы успешно прошли ${
          this.levels[this.currentLevel - 1]
        } уровень! Переходим на ${this.levels[this.currentLevel]} уровень.`;
        this.showScreen(this.resultScreen);

        setTimeout(() => {
          this.generateQuestion();
          this.showScreen(this.gameScreen);
        }, 3000);
      } else {
        this.showVictoryScreen();
      }
    } else {
      this.showGameOverScreen(successRate);
    }
  }

  showVictoryScreen() {
    this.resultTitle.textContent = "Поздравляем!";
    this.resultMessage.textContent =
      "Вы успешно прошли все три уровня игры! Вы настоящий математический гений!";
    this.showScreen(this.resultScreen);
    this.isGameActive = false;
  }

  showGameOverScreen(successRate) {
    this.resultTitle.textContent = "Игра завершена";
    this.resultMessage.textContent = `Вы набрали ${this.correctAnswers} из 10 правильных ответов (${successRate}%). Для перехода на следующий уровень требуется 80% правильных ответов.`;
    this.showScreen(this.resultScreen);
    this.isGameActive = false;
  }
}

// Инициализация игры при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  new MathGame();
});
