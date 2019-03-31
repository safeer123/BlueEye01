const VoiceViewCmds = switchView => [
  {
    keys: ["view", "switch"],
    match: ["switch", "view"],
    action: () => {
      switchView();
    }
  }
];

export { VoiceViewCmds };
