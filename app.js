async function gerarDevocional() {
  const tema = document.getElementById("tema").value;
  const resultDiv = document.getElementById("result");

  if (!tema.trim()) {
    resultDiv.innerHTML = "Por favor, digite um tema.";
    return;
  }

  resultDiv.innerHTML = "Gerando devocional, aguarde... 🙏";

  try {
    const response = await fetch("/api/devocional", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema })
    });

    const data = await response.json();
    resultDiv.innerHTML = data.texto || "Erro ao gerar devocional.";
  } catch (err) {
    resultDiv.innerHTML = "Erro de conexão com o servidor.";
  }
}
