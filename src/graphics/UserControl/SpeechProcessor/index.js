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
    this.recognition = new SpeechRecognition();

    const speechRecognitionList = new SpeechGrammarList();
    // speechRecognitionList.addFromString(grammar, 1);
    this.recognition.grammars = speechRecognitionList;

    // recognition.continuous = false;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    EventEmitter.on(EventName.UserTalking, this.userTalking);

    this.recognition.onresult = this.onResult;
    this.recognition.onspeechend = this.onSpeechEnd;
    this.recognition.onnomatch = this.onNoMatch;
    this.recognition.onerror = this.onError;
  }

  userTalking = () => {
    this.recognition.start();
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

  onSpeechEnd = () => {
    EventEmitter.emit(EventName.SpeakingEnded);
    this.recognition.stop();
  };

  onNoMatch = event => {
    EventEmitter.emit(EventName.SpeakingEnded);
    console.log("No match for the voice...");
  };

  onError = event => {
    EventEmitter.emit(EventName.SpeakingEnded);
    const error = `Error occurred in recognition: ${event.error}`;
    this.displayOut([error]);
  };
}

export default new SpeechProcessor();
