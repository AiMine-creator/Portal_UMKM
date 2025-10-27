// File: netlify/functions/generate-image.js
export async function handler(event, context) {
  // Ambil token Hugging Face dari environment variable Netlify
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  // Ambil prompt dari body request
  const { prompt } = JSON.parse(event.body);

  // Model yang digunakan (Stable Diffusion)
  const modelUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

  try {
    // Kirim permintaan ke API Hugging Face
    const response = await fetch(modelUrl, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    });

    // Jika gagal, kirim pesan error
    if (!response.ok) {
      const err = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Gagal memanggil API: " + err }),
      };
    }

    // Ambil hasil gambar sebagai blob
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Kembalikan hasil gambar ke browser
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    // Tangani error tak terduga
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan: " + error.message }),
    };
  }
}
