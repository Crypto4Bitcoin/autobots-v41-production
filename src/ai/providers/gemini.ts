import { AIProvider, ProviderOptions } from "../provider-router";
import { ProviderResult } from "@/lib/types/agent-types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  name = "Gemini";
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(prompt: string, options?: ProviderOptions): Promise<ProviderResult> {
    const start = Date.now();
    try {
      const modelName = options?.model || "gemini-1.5-pro";
      const model = this.genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: options?.maxTokens,
          temperature: options?.temperature,
        },
      });

      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
        tokens_used: response.usageMetadata?.totalTokenCount || 0,
        provider: this.name,
        model: modelName,
        latency_ms: Date.now() - start,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        raw_metadata: response as any,
        error: undefined,
      };
    } catch (err) {
      return {
        success: false,
        text: "",
        tokens_used: 0,
        provider: this.name,
        model: options?.model || "gemini-1.5-pro",
        latency_ms: Date.now() - start,
        raw_metadata: {},
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
