const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChars(len: number = 6) {
  return new Array(len)
    .fill("")
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

export default randomChars;
