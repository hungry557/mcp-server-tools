import { z } from "zod";

export const AddSchema = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});
