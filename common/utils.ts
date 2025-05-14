import { getParamValue } from "@chatmcp/sdk/utils/index.js";

/**
 * API服务器URL地址
 */
const apiUrl = getParamValue("api_url") || "";

/**
 * API访问密钥
 */
const apiKey = getParamValue("api_key") || "";

/**
 * 应用运行模式，默认为"stdio"
 */
const mode = getParamValue("mode") || "stdio";

/**
 * 服务端口号，默认为9593
 */
const port = getParamValue("port") || 9593;

/**
 * API端点路径，默认为"/rest"
 */
const endpoint = getParamValue("endpoint") || "/rest";

/**
 * HTTP请求接口
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
}

/**
 * HTTP响应接口
 * @template T 响应数据类型
 */
interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * HTTP请求错误
 * 在HTTP请求失败时抛出
 */
class HttpError extends Error {
  status: number;
  statusText: string;
  data: any;

  /**
   * 创建HTTP错误实例
   * @param message 错误消息
   * @param status HTTP状态码
   * @param statusText HTTP状态文本
   * @param data 响应数据
   */
  constructor(message: string, status: number, statusText: string, data: any) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.name = "HttpError";
  }
}

/**
 * 封装的HTTP请求实例
 * 提供了常用的HTTP方法（GET、POST、PUT、DELETE、PATCH）
 */
const http = {
  /**
   * 发送HTTP请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const { params, data, headers: customHeaders, ...restOptions } = options;

    // 处理URL参数
    let finalUrl = `${apiUrl}${url}`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      finalUrl += `?${queryParams.toString()}`;
    }

    // 默认请求头
    const headers = new Headers(customHeaders);
    if (apiKey) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    }

    // 处理请求体
    if (data && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const fetchOptions: RequestInit = {
      ...restOptions,
      headers,
    };

    // 添加请求体
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    // 发送请求
    const response = await fetch(finalUrl, fetchOptions);

    // 解析响应
    let responseData: T;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = (await response.text()) as unknown as T;
    }

    // 处理错误响应
    if (!response.ok) {
      throw new HttpError(
        `请求失败: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        responseData
      );
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  },

  /**
   * 发送GET请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  get<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return http.request<T>(url, { ...options, method: "GET" });
  },

  /**
   * 发送POST请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  post<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return http.request<T>(url, { ...options, method: "POST", data });
  },

  /**
   * 发送PUT请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  put<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return http.request<T>(url, { ...options, method: "PUT", data });
  },

  /**
   * 发送DELETE请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  delete<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return http.request<T>(url, { ...options, method: "DELETE" });
  },

  /**
   * 发送PATCH请求
   * @template T 响应数据类型
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @returns 包含响应数据的Promise
   */
  patch<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return http.request<T>(url, { ...options, method: "PATCH", data });
  },
};

export { apiUrl, apiKey, mode, port, endpoint, http, HttpError };
