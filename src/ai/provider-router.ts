import { ProviderResult } from "@/lib/types/agent-types";

export interface ProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  strategy?: 'performance' | 'cost' | 'cheap_first' | 'balanced' | 'quality_first';
  taskClass?: 'classification' | 'synthesis' | 'content' | 'compliance';
}

export interface AIProvider {
  name: string;
  chat(prompt: string, options?: ProviderOptions): Promise<ProviderResult>;
}

import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";
import { OllamaProvider } from "./providers/ollama";

export class ProviderRouter {
  private providers: AIProvider[] = [];

  constructor(providers: AIProvider[]) {
    this.providers = providers;
  }

  static createFromEnv(): ProviderRouter {
    const providers: AIProvider[] = [];

    // Order for 'performance' by default
    if (process.env.GEMINI_API_KEY) {
      providers.push(new GeminiProvider(process.env.GEMINI_API_KEY));
    }

    if (process.env.OPENAI_API_KEY) {
      providers.push(new OpenAIProvider(process.env.OPENAI_API_KEY));
    }

    // Fixed Ollama instantiation to match 1-arg constructor
    providers.push(new OllamaProvider(process.env.OLLAMA_URL));

    return new ProviderRouter(providers);
  }

  async chat(prompt: string, options?: ProviderOptions): Promise<ProviderResult> {
    let lastError: string | null = null;
    const fallbackChain = [...this.providers];

    // 1. Task-Class Intelligence reorders providers
    if (options?.taskClass === 'classification') {
      // For classification, prioritize local (fast/free)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      fallbackChain.sort((a, b) => (a.name === 'Ollama' ? -1 : 1));
    } else if (options?.taskClass === 'compliance') {
      // For compliance, prioritize highest quality
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      fallbackChain.sort((a, b) => (a.name === 'OpenAI' ? -1 : 1));
    } else if (options?.strategy === 'cost' || options?.strategy === 'cheap_first') {
      // Global cost strategy
      fallbackChain.sort((a, b) => {
        if (a.name === 'Ollama') return -1;
        if (b.name === 'Ollama') return 1;
        if (a.name === 'Gemini') return -1;
        if (b.name === 'Gemini') return 1;
        return 0;
      });
    } else if (options?.strategy === 'quality_first') {
      // Quality first: prioritize OpenAI
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      fallbackChain.sort((a, b) => (a.name === 'OpenAI' ? -1 : 1));
    }

    for (const provider of fallbackChain) {
      try {
        console.log(`[Router] Strategy: ${options?.strategy || 'performance'} | Task: ${options?.taskClass || 'general'} | Attempting with: ${provider.name}`);
        const result = await provider.chat(prompt, options);
        if (result.success) {
          return result;
        }
        lastError = result.error || null;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`[Router] ${provider.name} failed:`, lastError);
      }
    }

    return {
      success: false,
      text: "",
      tokens_used: 0,
      provider: "Router",
      model: "N/A",
      latency_ms: 0,
      raw_metadata: {},
      error: `All providers failed. Last error: ${lastError}`,
    };
  }
}

export const AIProvider = {} as any;

export const ProviderOptions = {} as any;
