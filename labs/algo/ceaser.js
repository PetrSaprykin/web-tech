function cesar(str, shift, action) {
  const rusAlphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const alphabetLength = rusAlphabet.length;

  // Для дешифровки используем обратный сдвиг
  if (action === "decode") {
    shift = -shift;
  }

  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const lowerChar = char.toLowerCase();

    if (rusAlphabet.includes(lowerChar)) {
      const currentIndex = rusAlphabet.indexOf(lowerChar);
      let newIndex = (currentIndex + shift) % alphabetLength;

      // Обрабатываем отрицательные индексы
      if (newIndex < 0) {
        newIndex += alphabetLength;
      }

      // Сохраняем регистр исходного символа
      const newChar = rusAlphabet[newIndex];
      result += char === char.toUpperCase() ? newChar.toUpperCase() : newChar;
    } else {
      // Оставляем символы не из алфавита без изменений
      result += char;
    }
  }

  return result;
}

// Расшифровка сообщения "эзтыхз фзъзъз"
// Сообщение: "эзтыхз фзъзъз"
// Ключ: нужно подобрать (предположительно сдвиг 8)
const encodedMessage = "эзтыхз фзъзъз";
const decodedMessage = cesar(encodedMessage, 8, "decode");
console.log(decodedMessage); // "хакуна матата"
