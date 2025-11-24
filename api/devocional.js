// api/devocional.js - handler serverless Vercel (Node)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { tema } = req.body || {};
  if (!tema) {
    res.status(400).json({ error: "Tema é obrigatório" });
    return;
  }

  // Validação básica
  if (tema.length > 500) {
    res.status(400).json({ error: "Tema muito longo" });
    return;
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    res.status(500).json({ error: "Missing GROQ_API_KEY on server" });
    return;
  }

  try {
    // Chamada compatível com a API da Groq (OpenAI-compatible endpoint)
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // ou outro modelo disponível na sua conta Groq
        messages: [
          { role: "system", content: "Você é um devocionista reformado, centrado em Cristo. Escreva devocionais bíblicos que sejam exegéticos, pastorais e aplicáveis." },
          { role: "user", content: `Crie um devocional sobre: ${tema}
Estrutura:
- Título
- Passagem base (referência)
- Reflexão teológica
- Aplicação prática
- Oração final` }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const text = await resp.text(); // pegar texto bruto se resposta não for JSON
    let data;
    try { data = JSON.parse(text); } catch (e) { data = null; }

    if (!resp.ok) {
      return res.status(resp.status).json({ error: "Erro na Groq API", details: data || text });
    }

    const content = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    res.status(200).json({ texto: content });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Falha no servidor", details: String(err) });
  }
}
