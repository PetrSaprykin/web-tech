function fibb(n) {
  if (n < 0 || n > 1000 || !Number.isInteger(n)) {
    throw new Error("n должно быть целым неотрицательным числом от 0 до 1000");
  }

  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}
