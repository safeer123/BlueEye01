import EventEmitter from "../../lib/EventEmitter";
import { EventName } from "../../../constants/Events";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

class SpeechProcessor {
  constructor() {
    // Enable flag
    this.enabled = false;

    if (SpeechRecognition && SpeechGrammarList) {
      this.recognition = new SpeechRecognition();

      const speechRecognitionList = new SpeechGrammarList();
      // speechRecognitionList.addFromString(grammar, 1);
      this.recognition.grammars = speechRecognitionList;

      this.recognition.continuous = true;
      this.recognition.lang = "en-US";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      EventEmitter.on(EventName.ToggleSpeechDetection, this.startDetection);

      this.recognition.onresult = this.onResult;
      this.recognition.onspeechend = this.onSpeechEnd;
      this.recognition.onnomatch = this.onNoMatch;
      this.recognition.onerror = this.onError;
      this.recognition.onspeechstart = this.onSpeechStart;
      this.recognition.onspeechend = this.onSpeechEnd;
      this.recognition.onend = this.onEnd;
    }
  }

  onSpeechStart = () => {
    EventEmitter.emit(EventName.SoundStart);
  };

  onSpeechEnd = () => {
    EventEmitter.emit(EventName.SoundEnd);
  };

  startDetection = flag => {
    if (flag) {
      this.recognition.start();
      this.enabled = true;
    } else {
      this.recognition.abort();
      this.enabled = false;
    }
  };

  onEnd = () => {
    if (this.enabled) {
      // this.displayOut(["Restarting..."]);
      this.startDetection(true);
    } else {
      this.displayOut(["Speech detection turned off"]);
    }
  };

  displayOut = displayOutList => {
    EventEmitter.emit(EventName.DisplayOutRequest, {
      displayOutList,
      duration: 2
    });
  };

  onResult = event => {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The [last] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object

    const last = event.results.length - 1;
    const output = event.results[last][0].transcript;
    const confidence = Number.parseInt(
      event.results[0][0].confidence * 100,
      10
    );
    this.displayOut([`** ${output} ** (${confidence}%)`]);
  };

  onNoMatch = event => {
    // this.displayOut(["No match for the voice..."]);
  };

  onError = event => {
    const error = `Error occurred in recognition: ${event.error}`;
    this.displayOut([error]);
  };
}

export default new SpeechProcessor();
