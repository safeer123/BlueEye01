import { LockBlueEye } from "./sampleConfig";

class Node {
  commands = null; // commands
  children = {};
}

class ProcessSpeech {
  constructor() {
    this.rootNode = new Node();

    // Test commandSets
    LockBlueEye.forEach(c => this.insertCommandSet(c, [...c.keys]));

    // tree formed
    console.log(this.rootNode);
  }

  insertCommandSet = (commandObj, keys, node) => {
    const currentNode = node || this.rootNode;
    if (keys.length > 0) {
      const key = keys.shift();
      currentNode.children[key] = currentNode.children[key] || new Node();
      this.insertCommandSet(commandObj, keys, currentNode.children[key]);
    } else {
      node.commands = node.commands || [];
      node.commands.push(commandObj);
    }
  };

  search(input) {
    let result = null;
    if (input && input.length > 0) {
      const wordList = input
        .trim()
        .split(" ")
        .map(w => w.toLowerCase());
      const hotKeys = wordList.filter(w => this.rootNode.children[w]);
      if (hotKeys.length > 0) {
        const wordLookup = {};
        wordList.forEach((w, index) => {
          wordLookup[w] = { index };
        });
        hotKeys.some(k => {
          result = this.findMatch(wordLookup, this.rootNode.children[k]);
          return result;
        });
      }
    }
    return result;
  }

  findMatch = (wordLookup, node) => {
    let result = null;
    if (node && wordLookup) {
      // Check if we found the match
      const matchResult = this.matchValue(wordLookup, node);
      if (matchResult) return matchResult;
      const hotKeys = Object.keys(node.children).filter(k => wordLookup[k]);
      if (hotKeys.length > 0) {
        hotKeys.some(k => {
          result = this.findMatch(wordLookup, node.children[k]);
          return result;
        });
      }
    }
    return result;
  };

  matchValue = (wordLookup, node) => {
    let result = null;
    const { commands } = node;
    if (commands && commands.length > 0) {
      commands.some(c => {
        const { match } = c;
        if (match && match.length > 0) {
          const matchFound = match.every((w, i) => {
            const word = w.toLowerCase();
            return wordLookup[word] && wordLookup[word].index === i;
          });
          if (matchFound) {
            result = c;
            return true;
          }
        }
        return false;
      });
    }
    return result;
  };
}

export default new ProcessSpeech();
