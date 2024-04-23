import { ZodSchema } from "zod";

export const validateMyData = <T>(zodSchema: ZodSchema<T>, data: any) => {
  const validatedData = zodSchema.safeParse(data);
  if (!validatedData.success) {
    console.log(
      "DATA VALIDATION ERROR: " + validatedData.error.message,
      "DATA: " + JSON.stringify(data)
    );
    throw new Error("data not valid");
  }
  return validatedData.data;
};
