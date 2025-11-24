export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido." });
  }

  try {
    const { tema } = req.body;

    if (!tema || tema.trim() === "") {
      return res.status(400).json({ erro: "Tema é obrigatório." });
    }

    const resposta = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Crie um devocional curto e profundo sobre o tema: ${tema}`
            }
          ]
        })
      }
    );

    const json = await resposta.json();

    return res.status(200).json({
      texto: json.choices?.[0]?.message?.content || "Sem resposta da IA."
    });
  } catch (error) {
    console.error("ERRO NA API:", error);
    return res.status(500).json({ erro: "Erro interno na API." });
  }
}
