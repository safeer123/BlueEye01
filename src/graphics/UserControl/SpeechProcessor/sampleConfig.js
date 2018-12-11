const keys = ["blue", "eye"];

const LockBlueEye = [
  {
    keys,
    match: ["lock", "blue", "eye"],
    action: () => {
      console.log("Speech processing aborted...");
    }
  },
  {
    keys,
    match: ["unlock", "blue", "eye"],
    action: () => {
      console.log("Speech processing started...");
    }
  },
  {
    keys: ["light", "turn"],
    match: ["turn", "on", "the", "light"],
    action: () => {
      console.log("light turn on...");
    }
  },
  {
    keys: ["light", "turn"],
    match: ["turn", "off", "the", "light"],
    action: () => {
      console.log("light turn off...");
    }
  },
  {
    keys: ["list", "objects"],
    match: ["list", "all", "objects"],
    action: () => {
      console.log("listing objects...");
    }
  }
];

export { LockBlueEye };
