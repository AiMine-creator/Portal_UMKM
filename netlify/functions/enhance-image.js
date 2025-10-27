// File: netlify/functions/enhance-image.js
export async function handler(event, context) {
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
  const modelUrl = "https://api-inference.huggingface.co/models/microsoft/bringing-old-photos-back-to-life";

  try {
    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Gunakan FormData untuk upload gambar." }),
      };
    }

    const formData = await event.body;
    const response = await fetch(modelUrl, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: "POST",
      body: Buffer.from(formData, "base64"),
    });

    if (!response.ok) {
      const err = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Gagal meningkatkan gambar: " + err }),
      };
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan: " + error.message }),
    };
  }
}
