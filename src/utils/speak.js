export function speakJapanese(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
  
    // Try to find a female Japanese voice if available
    const voices = window.speechSynthesis.getVoices()
    const jpVoices = voices.filter(v => v.lang === 'ja-JP')
    const femaleVoice = jpVoices.find(v => v.name.includes('Female') || v.name.includes('女')) || jpVoices[0]
  
    if (femaleVoice) {
      utterance.voice = femaleVoice
    }
  
    window.speechSynthesis.speak(utterance)
  }
  