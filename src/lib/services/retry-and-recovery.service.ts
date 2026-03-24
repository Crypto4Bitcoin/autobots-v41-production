export class RetryAndRecoveryService {
  /**
   * Executes an operation with exponential backoff for transient failures.
   */
  static async runWithRetry<T>(
    operation: () => Promise<T>, 
    retries: number = 3, 
    delay: number = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (e: unknown) {
      if (retries <= 0) throw e;
      
      const isTransient = e.status >= 500 || e.code === 'ECONNRESET';
      if (!isTransient) throw e;

      console.warn(`[RetryService] transient failure, retrying in ${delay}ms... (${retries} left)`);
      await new Promise(res => setTimeout(res, delay));
      return this.runWithRetry(operation, retries - 1, delay * 2);
    }
  }
}
