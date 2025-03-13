import Tts from 'react-native-tts';

class TextToSpeechService {
  static speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Tts.speak(text, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact', // Example voice
        rate: 0.5, // Speaking rate
        pitch: 1.0, // Speaking pitch
        onDone: () => resolve(),
        onStart: () => console.log('TTS started'),
        onError: (error) => {
          console.error('TTS error:', error);
          reject(error);
        },
      });
    });
  }

  static stop(): Promise<void> {
    return Tts.stop();
  }
}

export default TextToSpeechService;