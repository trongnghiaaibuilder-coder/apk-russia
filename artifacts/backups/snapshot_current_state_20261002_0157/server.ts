/**
 * Russia AI Support - Full-Stack Express Server & Gemini API Proxy
 * Developer: Xương Rồng AI developer
 * 
 * Rules:
 * - Never expose API keys to client.
 * - Server-side Gemini API calls using @google/genai.
 * - Port 3000 development & production support.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI Hỗ trợ nước Nga (Russia AI Support), được phát triển bởi nhà phát triển "Xương Rồng AI developer", phục vụ cộng đồng người Việt Nam du học, lao động, định cư và du lịch tại Liên bang Nga.

Nhiệm vụ trọng tâm:
1. Giải đáp chính xác, thực tế về thủ tục hành chính: Đăng ký tạm trú (Регистрация / Прописка), Thẻ di trú (Миграционная карта), bảo hiểm y tế OMS/DMS, gia hạn visa, làm thẻ căn cước/RVP/VNZh.
2. Hướng dẫn giao thông & đời sống: Hệ thống tàu điện ngầm Metro Moskva/St. Petersburg, cách mua và nạp thẻ Troika (Тройка), mở tài khoản và thẻ ngân hàng MIR (МИР) tại Sberbank/VTB/T-Bank, mua SIM điện thoại (MTS, Megafon, Beeline).
3. Hướng dẫn sinh tồn & sức khỏe mùa đông: Cách mặc áo ấm nhiều lớp chống rét từ -10°C đến -30°C, đi giày chống trượt tuyết, số điện thoại cứu hộ khẩn cấp 112 và cấp cứu 103 (Скорая помощь), các loại thuốc thiết yếu không cần đơn tại hiệu thuốc (Аптека).
4. Văn hóa & giao tiếp: Phong tục ứng xử người Nga (không bắt tay qua ngưỡng cửa, bỏ mũ khi vào nhà, xưng hô kính trọng "Вы").

Nguyên tắc phản hồi:
- Trả lời bằng tiếng Việt chuẩn xác, súc tích, dễ hiểu và thân thiện.
- Luôn cung cấp thuật ngữ hoặc biển hiệu tiếng Nga bằng chữ Cyrillic kèm theo (ví dụ: "Lối ra phố (Выход в город)", "Hiệu thuốc trực (Дежурная аптека 24 часа)") để người dùng dễ nhận diện thực tế.
- Nếu không chắc chắn về một điều luật cụ thể, khuyên người dùng liên hệ Đại sứ quán Việt Nam tại LB Nga hoặc trung tâm dịch vụ công MFC (Мои Документы).`;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Russia AI Support Backend',
    version: '1.0.0',
    developer: 'Xương Rồng AI developer',
    timestamp: new Date().toISOString()
  });
});

// Assistant Chat Proxy Endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { messages, topic, userLanguage = 'vi' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Danh sách tin nhắn không được để trống.' });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== 'string' || !lastMessage.content.trim()) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Khóa API GEMINI_API_KEY chưa được cấu hình trên máy chủ.',
        isConfigured: false
      });
    }

    const ai = new GoogleGenAI({});

    // Construct Gemini contents array
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const replyText = response.text || '';
    if (!replyText.trim()) {
      return res.status(502).json({ error: 'Mô hình AI không trả về phản hồi hợp lệ.' });
    }

    return res.json({
      success: true,
      content: replyText,
      model: 'gemini-2.5-flash'
    });
  } catch (err: any) {
    console.error('[RussiaAI-Server] Error in /api/assistant/chat:', err);
    return res.status(500).json({
      error: `Lỗi xử lý yêu cầu AI: ${err.message || 'Lỗi máy chủ không xác định'}`
    });
  }
});

// Translation proxy endpoint
app.post('/api/translation/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLanguage = 'vi', targetLanguage = 'ru' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Văn bản cần dịch không được để trống.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Khóa API GEMINI_API_KEY chưa được cấu hình.' });
    }

    const ai = new GoogleGenAI({});
    const prompt = `Dịch chính xác và tự nhiên đoạn văn bản sau từ ${
      sourceLanguage === 'vi' ? 'Tiếng Việt sang Tiếng Nga' : 'Tiếng Nga sang Tiếng Việt'
    }. Chỉ trả về duy nhất văn bản đã dịch, không thêm giải thích hay lời mở đầu:\n\n"${text.trim()}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    const translatedText = response.text?.trim() || '';
    return res.json({
      success: true,
      translatedText
    });
  } catch (err: any) {
    console.error('[RussiaAI-Server] Error in /api/translation/translate:', err);
    return res.status(500).json({ error: err.message || 'Lỗi dịch thuật từ máy chủ.' });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[RussiaAI-Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start when executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    console.error('[RussiaAI-Server] Failed to start server:', err);
  });
}

export { app };
