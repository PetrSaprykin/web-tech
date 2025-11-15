function pow(x, n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("n должно быть натуральным числом");
  }

  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
