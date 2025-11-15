function minDigit(x) {
  if (x < 0 || !Number.isInteger(x)) {
    throw new Error("x должно быть целым неотрицательным числом");
  }

  if (x === 0) return 0;

  let min = 9;

  while (x > 0) {
    const digit = x % 10;
    if (digit < min) {
      min = digit;
    }
    x = Math.floor(x / 10);
  }

  return min;
}
