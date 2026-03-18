const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I, O to avoid confusion

function generateCode(existingCodes = new Set()) {
  let code;
  do {
    code = Array.from({ length: 4 }, () =>
      LETTERS[Math.floor(Math.random() * LETTERS.length)]
    ).join('');
  } while (existingCodes.has(code));
  return code;
}

module.exports = { generateCode };
