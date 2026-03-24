import { AIProvider, ProviderOptions } from "../provider-router";
import { ProviderResult } from "@/lib/types/agent-types";
import axios from "axios";

export class OllamaProvider implements AIProvider {
  name = "Ollama";
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  async chat(prompt: string, options?: ProviderOptions): Promise<ProviderResult> {
    const start = Date.now();
    try {
      const modelName = options?.model || "llama3";
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          num_predict: options?.maxTokens,
          temperature: options?.temperature,
        }
      });

      return {
        success: true,
        text: response.data.response,
        tokens_used: 0, // Ollama usage info varies
        provider: this.name,
        model: modelName,
        latency_ms: Date.now() - start,
        raw_metadata: response.data,
        error: undefined,
      };
    } catch (err) {
      return {
        success: false,
        text: "",
        tokens_used: 0,
        provider: this.name,
        model: options?.model || "llama3",
        latency_ms: Date.now() - start,
        raw_metadata: {},
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
