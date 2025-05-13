/**
 * 用于与工具API交互的客户端。
 */
export class ToolsClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  /**
   * 创建一个新的工具客户端。
   * @param apiUrl - 工具API的URL地址。
   * @param apiKey - 工具API的密钥。
   */
  constructor({ apiUrl, apiKey }: { apiUrl: string; apiKey: string }) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * 计算两个数字的和。
   * @param a - 第一个数字。
   * @param b - 第二个数字。
   * @returns 两个数字的和。
   */
  async add({ a, b }: { a: number; b: number }) {
    try {
      if (!a || !b) {
        throw new Error("invalid params");
      }

      return a + b;
    } catch (e) {
      throw e;
    }
  }
}
