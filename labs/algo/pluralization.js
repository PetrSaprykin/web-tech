function pluralizeRecords(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("n должно быть целым неотрицательным числом");
  }

  let recordsForm;
  if (n % 10 === 1 && n % 100 !== 11) {
    recordsForm = "запись";
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    recordsForm = "записи";
  } else {
    recordsForm = "записей";
  }

  let foundForm;
  if (n % 10 === 1 && n % 100 !== 11) {
    foundForm = "была найдена";
  } else {
    foundForm = "было найдено";
  }

  return `В результате выполнения запроса ${foundForm} ${n} ${recordsForm}`;
}

// 1, 21, 31... (кроме 11, 111)                  "запись", "была найдена"

// 2-4, 22-24, 32-34... (кроме 12-14)            "записи", "было найдено"

// 0, 5-20, 25-30...                             "записей", "было найдено"
