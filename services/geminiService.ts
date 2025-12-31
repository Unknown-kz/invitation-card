
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const submitRSVPFunction: FunctionDeclaration = {
  name: 'submit_rsvp',
  parameters: {
    type: Type.OBJECT,
    description: 'Register a guest for the wedding. / Қонақты тойға тіркеу.',
    properties: {
      name: { type: Type.STRING, description: 'Full name of the guest.' },
      attending: { 
        type: Type.STRING, 
        enum: ['yes', 'with-plus-one', 'no'],
        description: 'Attendance status.' 
      },
      tableId: { 
        type: Type.INTEGER, 
        description: 'Selected table number (1-6).' 
      },
      partnerName: { type: Type.STRING, description: 'Partner name if applicable.' },
    },
    required: ['name', 'attending', 'tableId']
  }
};

export const getGuestAssistance = async (query: string) => {
  const now = new Date();
  const todayStr = now.toLocaleDateString('kk-KZ');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ functionDeclarations: [submitRSVPFunction] }],
        systemInstruction: `Сіз Ержан мен Гүлсараның 50 жылдық Алтын тойының (25.01.2026) ресми цифрлық көмекшісісіз.
        
        RULES:
        1. BILINGUAL: Respond in Kazakh or Russian based on user input.
        2. TONE: Elegant, respectful, professional.
        3. DATE: Today is ${todayStr}. Wedding is 2026-01-25. Use this for countdowns.
        4. TABLES: 
           1: Құрметті қонақтар (VIP), 
           2: Достар (Friends), 
           3: Туыстар А (Relatives A), 
           4: Туыстар Ә (Relatives B), 
           5: Жастар (Youth), 
           6: Отбасылық (Family).
        
        RSVP FLOW:
        - If guest wants to register, MUST ask for: 1. Full Name, 2. Table Choice (1-6).
        - Call 'submit_rsvp' ONLY when both name and tableId are provided.
        - Location: "Aktilek" Restaurant, Astana. 2GIS: https://2gis.kz/astana/search/%D0%B8%D1%81%D0%B0%D1%82%D0%B0%D0%B9%2058/firm/70000001097227888`,
      }
    });

    return response;
  } catch (error) {
    console.error("AI Assistant error:", error);
    return null;
  }
};
