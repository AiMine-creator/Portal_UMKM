// File: netlify/functions/generate-video-text.js
export async function handler(event, context) {
  try {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Gunakan Pika.art untuk membuat video dari teks.",
        url: "https://pika.art/",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan: " + error.message }),
    };
  }
}
