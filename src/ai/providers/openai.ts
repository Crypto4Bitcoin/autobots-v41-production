import { AIProvider, ProviderOptions } from "../provider-router";
import { ProviderResult } from "@/lib/types/agent-types";
import OpenAI from "openai";

export class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async chat(prompt: string, options?: ProviderOptions): Promise<ProviderResult> {
    const start = Date.now();
    try {
      const modelName = options?.model || "gpt-4o";
      const response = await this.openai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        max_tokens: options?.maxTokens,
        temperature: options?.temperature,
      });

      const text = response.choices[0]?.message?.content || "";

      return {
        success: true,
        text,
        tokens_used: response.usage?.total_tokens || 0,
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
        model: options?.model || "gpt-4o",
        latency_ms: Date.now() - start,
        raw_metadata: {},
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
