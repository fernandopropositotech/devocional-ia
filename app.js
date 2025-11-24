// Frontend simples — chama a rota serverless /api/devocional
document.getElementById("btn").addEventListener("click", gerarDevocional);

async function gerarDevocional() {
  const tema = document.getElementById("tema").value.trim();
  const result = document.getElementById("result");
  if (!tema) { result.innerText = "Digite um tema."; return; }

  result.innerText = "Gerando devocional...";

  try {
    const resp = await fetch("/api/devocional", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema })
    });

    const data = await resp.json();

    if (!resp.ok) {
      result.innerText = "Erro: " + (data.error || JSON.stringify(data));
      console.error("API error:", data);
      return;
    }

    result.innerText = data.texto || "Sem resposta da API.";
  } catch (err) {
    result.innerText = "Erro de conexão. Veja o console.";
    console.error(err);
  }
}
