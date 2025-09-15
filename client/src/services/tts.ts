interface TTSOptions {
  voice?: 'male' | 'female';
  rate?: number;
  pitch?: number;
  volume?: number;
}

export async function generateSpeech(text: string, options: TTSOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => {
      if (options.voice === 'male') {
        return voice.name.toLowerCase().includes('male') || 
               voice.name.toLowerCase().includes('david') ||
               voice.name.toLowerCase().includes('alex');
      } else {
        return voice.name.toLowerCase().includes('female') || 
               voice.name.toLowerCase().includes('samantha') ||
               voice.name.toLowerCase().includes('karen') ||
               voice.lang === 'en-US';
      }
    });

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Configure speech parameters
    utterance.rate = options.rate || 0.9; // Slightly slower for meditation
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Process meditation-specific markers
    const processedText = text
      .replace(/\[PAUSE (\d+)\]/g, (match, seconds) => {
        return `... ${'...'.repeat(parseInt(seconds))} `;
      })
      .replace(/\[BREATHE\]/g, '... breathe in... and breathe out... ')
      .replace(/\[LONG_PAUSE\]/g, '.......... ');

    utterance.text = processedText;

    // Create audio blob for storage
    const chunks: BlobPart[] = [];
    
    // Note: This is a simplified implementation
    // For production, you might want to use a more sophisticated TTS service
    // or record the audio for better quality and consistency
    
    utterance.onend = () => {
      // For now, we'll return a data URL that can be used with the audio element
      // In a real implementation, you'd want to capture the actual audio data
      resolve('data:audio/wav;base64,' + btoa(processedText)); // Placeholder
    };

    utterance.onerror = (error) => {
      reject(new Error(`TTS Error: ${error.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return speechSynthesis.getVoices();
}

// Utility to wait for voices to load
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    }
  });
}
