export default async function handler(req, res) {
  const { tema } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Você é um devocionista reformado, centrado em Cristo, profundo e bíblico."
          },
          {
            role: "user",
            content: `Crie um devocional completo sobre ${tema}.
            Estrutura:
            - Título
            - Passagem base (com referência)
            - Reflexão teológica
            - Aplicação prática
            - Oração final`
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ texto: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ erro: "Falha ao gerar devocional" });
  }
}
