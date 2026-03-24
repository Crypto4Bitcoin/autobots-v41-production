export interface ImageGenerationInput {
  prompt: string
  size?: "1024x1024" | "1024x1792" | "1792x1024"
}

export interface ImageGenerationOutput {
  imageUrl: string
  provider: string
  generatedAt: string
}

export class ImageGeneratorAdapter {
  async generate(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY")

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: input.prompt,
        size: input.size ?? "1024x1792",
      }),
    })

    if (!res.ok) {
      throw new Error(`Image generation failed with status ${res.status}`)
    }

    const data = await res.json()
    const b64 = data.data?.[0]?.b64_json
    if (!b64) throw new Error("No image returned")

    return {
      imageUrl: `data:image/png;base64,${b64}`,
      provider: "openai",
      generatedAt: new Date().toISOString(),
    }
  }
}