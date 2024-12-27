const speakButton = document.getElementById('speakButton');
const exitButton = document.getElementById('exitButton');
const languageSelect = document.getElementById('languageSelect');
const originalText = document.getElementById('original');
const translatedText = document.getElementById('translated');

let isRunning = true;

// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Function to translate text
async function translateText(text, targetLang) {
  const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
  const data = await response.json();
  return data.responseData.translatedText;
}

// Text-to-speech synthesis
function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// Handle speech recognition
function startRecognition() {
  speakButton.classList.add('loading');
  recognition.start();

  recognition.onresult = async (event) => {
    const speech = event.results[0][0].transcript;
    originalText.textContent = speech;

    // Translate the text
    const targetLang = languageSelect.value; // Get target language
    const translated = await translateText(speech, targetLang);
    translatedText.textContent = translated;

    // Speak the translated text
    speakText(translated, targetLang);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    speakButton.classList.remove('loading');
    if (isRunning) startRecognition();
  };
}

// Start translation loop
speakButton.addEventListener('click', () => {
  isRunning = true;
  startRecognition();
});

// Exit loop
exitButton.addEventListener('click', () => {
  isRunning = false;
  recognition.abort();
  translatedText.textContent = 'Translation stopped.';
  originalText.textContent = 'Translation stopped.';
});
