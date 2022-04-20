import LFSR from "lfsr";

const rng = new LFSR(28, new Date().getTime());

export function getNextGameId() {
  rng.shift();
  while (rng.register <= parseInt("ffffff", 16)) {
    rng.shift();
  }
  return rng.register.toString(16);
}