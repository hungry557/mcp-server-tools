/**
 * 数字运算相关工具模块
 *
 * 提供数学运算功能的Schema定义，用于验证和描述工具输入参数
 *
 * @module tools/number
 */
import { z } from "zod";

/**
 * 加法操作的Schema定义
 *
 * 描述了加法操作所需的两个数字参数及其元数据
 *
 * @type {z.ZodObject<{a: z.ZodNumber, b: z.ZodNumber}>}
 */
export const AddSchema = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});
