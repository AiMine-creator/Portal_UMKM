// File: netlify/functions/generate-video-image.js
export async function handler(event, context) {
  try {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Gunakan RunwayML untuk mengubah gambar menjadi video realistis.",
        url: "https://runwayml.com/",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan: " + error.message }),
    };
  }
}
