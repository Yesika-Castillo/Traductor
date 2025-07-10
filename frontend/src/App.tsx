import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Language {
  code: string;
  name: string;
}

interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  error?: string;
  originalText: string;
  from: string;
  to: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Reconocimiento de voz (Web Speech API)
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Utilidad debounce para evitar demasiadas peticiones
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function useSpeechToText(onResult: (text: string, isFinal: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript, true);
        setListening(false);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [onResult]);

  const startListening = () => {
    setError(null);
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { listening, error, startListening, stopListening };
}

// Utilidad para reproducir texto con voz
function speakText(text: string, lang: string) {
  if (!window.speechSynthesis) return;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // Seleccionar una voz adecuada si existe
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (match) utterance.voice = match;
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('es');
  const [toLanguage, setToLanguage] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Cargar idiomas disponibles al montar el componente
  useEffect(() => {
    fetchLanguages();
  }, []);

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  // Traducción en tiempo real con debounce
  const debouncedTranslate = React.useRef(
    debounce((text: string, from: string, to: string) => {
      if (!text.trim()) return;
      handleTranslateRealtime(text, from, to);
    }, 500)
  ).current;

  // Hook para reconocimiento de voz en español
  const {
    listening: isListening,
    error: speechError,
    startListening,
    stopListening
  } = useSpeechToText((recognizedText) => {
    setInputText(recognizedText);
    debouncedTranslate(recognizedText, fromLanguage, toLanguage);
  });

  // Traducción en tiempo real (no muestra loading ni error)
  const handleTranslateRealtime = async (text: string, from: string, to: string) => {
    try {
      const response = await axios.post<TranslationResponse>(`${API_BASE_URL}/api/translate`, {
        text,
        from,
        to
      });
      if (response.data.success) {
        setTranslatedText(response.data.translatedText || '');
      }
    } catch {
      // Silenciar errores en tiempo real
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/languages`);
      setLanguages(response.data.languages);
    } catch (error) {
      console.error('Error cargando idiomas:', error);
      setError('Error al cargar los idiomas disponibles');
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Por favor ingresa un texto para traducir');
      return;
    }

    if (inputText.length > 5000) {
      setError('El texto no puede exceder 5000 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const response = await axios.post<TranslationResponse>(`${API_BASE_URL}/api/translate`, {
        text: inputText,
        from: fromLanguage,
        to: toLanguage
      });

      if (response.data.success) {
        setTranslatedText(response.data.translatedText || '');
      } else {
        setError(response.data.error || 'Error en la traducción');
      }
    } catch (error: any) {
      console.error('Error en traducción:', error);
      setError(error.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(translatedText);
    setTranslatedText('');
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías mostrar una notificación de éxito
  };

  // Función para reproducir el texto traducido
  const handleSpeak = () => {
    if (!translatedText) return;
    // Buscar el código de idioma de destino (por ejemplo, 'en' -> 'en-US')
    let langCode = toLanguage;
    // Opcional: puedes mapear a variantes más comunes si lo deseas
    if (langCode === 'en') langCode = 'en-US';
    if (langCode === 'es') langCode = 'es-ES';
    if (langCode === 'fr') langCode = 'fr-FR';
    if (langCode === 'de') langCode = 'de-DE';
    if (langCode === 'it') langCode = 'it-IT';
    if (langCode === 'pt') langCode = 'pt-PT';
    if (langCode === 'ru') langCode = 'ru-RU';
    if (langCode === 'ja') langCode = 'ja-JP';
    if (langCode === 'ko') langCode = 'ko-KR';
    if (langCode === 'zh') langCode = 'zh-CN';
    if (langCode === 'ar') langCode = 'ar-SA';
    if (langCode === 'hi') langCode = 'hi-IN';
    speakText(translatedText, langCode);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Traductor Universal</h1>
        <p>Traduce texto entre múltiples idiomas de forma rápida y precisa</p>
      </header>

      <main className="app-main">
        <div className="translation-container">
          {/* Panel izquierdo - Texto original */}
          <div className="translation-panel">
            <div className="panel-header">
              <select 
                value={fromLanguage} 
                onChange={(e) => setFromLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <span className="char-count">{charCount}/5000</span>
              <button
                type="button"
                className={`btn btn-secondary mic-btn${isListening ? ' listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Detener reconocimiento de voz' : 'Hablar (español)'}
                style={{ marginLeft: '1rem' }}
              >
                {isListening ? '🎤 Escuchando...' : '🎤 Hablar'}
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe o pega el texto que quieres traducir..."
              className="text-input"
              rows={8}
              maxLength={5000}
            />
            
            <div className="panel-actions">
              <button 
                onClick={handleClear}
                className="btn btn-secondary"
                disabled={!inputText}
              >
                🗑️ Limpiar
              </button>
              <button 
                onClick={() => handleCopy(inputText)}
                className="btn btn-secondary"
                disabled={!inputText}
              >
                📋 Copiar
              </button>
            </div>
            {speechError && (
              <div className="error-message" style={{ marginTop: '0.5rem' }}>
                ❌ Error de micrófono: {speechError}
              </div>
            )}
          </div>

          {/* Botón de intercambio */}
          <div className="swap-container">
            <button 
              onClick={handleSwapLanguages}
              className="swap-btn"
              disabled={!inputText || !translatedText}
              title="Intercambiar idiomas"
            >
              🔄
            </button>
          </div>

          {/* Panel derecho - Texto traducido */}
          <div className="translation-panel">
            <div className="panel-header">
              <select 
                value={toLanguage} 
                onChange={(e) => setToLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <textarea
              value={translatedText}
              readOnly
              placeholder="La traducción aparecerá aquí..."
              className="text-input translated"
              rows={8}
            />
            
            <div className="panel-actions">
              <button 
                onClick={() => handleCopy(translatedText)}
                className="btn btn-secondary"
                disabled={!translatedText}
              >
                📋 Copiar
              </button>
              <button
                onClick={handleSpeak}
                className="btn btn-secondary"
                disabled={!translatedText}
                style={{ marginLeft: '0.5rem' }}
                title="Escuchar traducción"
              >
                🔊 Escuchar
              </button>
            </div>
          </div>
        </div>

        {/* Botón de traducción */}
        <div className="translate-actions">
          <button 
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
            className="btn btn-primary translate-btn"
          >
            {isLoading ? '🔄 Traduciendo...' : '🚀 Traducir'}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Información adicional */}
        <div className="info-section">
          <h3>💡 Consejos de uso:</h3>
          <ul>
            <li>Puedes traducir hasta 5000 caracteres por vez</li>
            <li>Usa el botón de intercambio para cambiar rápidamente entre idiomas</li>
            <li>Los botones de copiar te permiten usar el texto en otras aplicaciones</li>
            <li>El traductor funciona con texto plano y mantiene el formato básico</li>
          </ul>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Traductor Universal - Desarrollado con React, TypeScript y Node.js</p>
      </footer>
    </div>
  );
}

export default App;
