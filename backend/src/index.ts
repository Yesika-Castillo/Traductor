import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import translate from 'translate';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
// Permitir cualquier origen en desarrollo para evitar problemas de CORS
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Tipos para TypeScript
interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  error?: string;
  originalText: string;
  from: string;
  to: string;
}

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de traducción funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal de traducción
app.post('/api/translate', async (req, res) => {
  try {
    const { text, from, to }: TranslationRequest = req.body;

    // Validaciones
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'El texto a traducir es requerido y debe ser una cadena de texto'
      } as TranslationResponse);
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Los códigos de idioma origen y destino son requeridos'
      } as TranslationResponse);
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'El texto no puede exceder 5000 caracteres'
      } as TranslationResponse);
    }

    console.log(`Traduciendo: "${text}" de ${from} a ${to}`);

    // Realizar la traducción
    const translatedText = await translate(text, { from, to });

    const response: TranslationResponse = {
      success: true,
      translatedText,
      originalText: text,
      from,
      to
    };

    console.log(`Traducción exitosa: "${translatedText}"`);
    res.json(response);

  } catch (error) {
    console.error('Error en traducción:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la traducción';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      originalText: req.body.text || '',
      from: req.body.from || '',
      to: req.body.to || ''
    } as TranslationResponse);
  }
});

// Endpoint para obtener idiomas soportados
app.get('/api/languages', (req, res) => {
  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  res.json({ languages });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    availableEndpoints: [
      'GET /health',
      'POST /api/translate',
      'GET /api/languages'
    ]
  });
});

// Middleware para manejo global de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de traducción ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Endpoint de traducción: POST http://localhost:${PORT}/api/translate`);
  console.log(`🌍 Idiomas disponibles: GET http://localhost:${PORT}/api/languages`);
  console.log(`❤️  Estado del servidor: GET http://localhost:${PORT}/health`);
}); 