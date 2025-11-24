import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { tema } = req.body;

  if (!tema || tema.trim() === "") {
    return res.status(400).json({ error: "Tema é obrigatório" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: `Crie um devocional cristão profundo, bíblico e motivacional sobre o tema: ${tema}`
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      texto: data.choices?.[0]?.message?.content || "Não foi possível gerar o devocional."
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor", detalhes: err.message });
  }
};
