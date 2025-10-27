// File: netlify/functions/generate-copywriting.js
export async function handler(event, context) {
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
  const { prompt } = JSON.parse(event.body);

  // Model text generator (GPT2 dari Hugging Face)
  const modelUrl = "https://api-inference.huggingface.co/models/gpt2";

  try {
    const response = await fetch(modelUrl, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: "POST",
      body: JSON.stringify({
        inputs: `Tulis copywriting singkat dan menarik untuk: ${prompt}`,
        parameters: { max_new_tokens: 80, temperature: 0.8 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Gagal memanggil AI: " + err }),
      };
    }

    const data = await response.json();
    const text = data[0]?.generated_text || "Tidak ada hasil dari AI.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan: " + error.message }),
    };
  }
}
