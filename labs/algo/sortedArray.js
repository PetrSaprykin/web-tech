function getSortedArray(array, key) {
  const result = [...array]; // копия через спред оператор

  // пузырьковая сортирвока
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      // Сравниваем значения по указанному ключу
      if (result[j][key] > result[j + 1][key]) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
      }
    }
  }

  return result;
}
