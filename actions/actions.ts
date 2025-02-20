"use server";

import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";
import { z } from "zod";

const adminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name is too long"),
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size > 0, { message: "File cannot be empty" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 1MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only JPEG, JPG, PNG, and WEBP images are allowed",
      }
    ),
});

export async function addAdmin(prevState: unknown, formData: FormData) {
  const res = adminSchema.safeParse(Object.fromEntries(formData));
  // Validate data with Zod
  if (!res.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: res.error.flatten().fieldErrors,
    };
  }
  const { file, name } = res.data;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public/x");
  const filePath = path.join(uploadDir, file.name);

  try {
    await writeFile(filePath, buffer);
    const imageUrl = `/x/${file.name}`;

    console.log("🔄 Adding to database...");
    await prisma.admin.create({
      data: {
        name,
        image: imageUrl,
      },
    });

    console.log("✅ Added to database:");
    revalidatePath("/admins");
    return { success: true, message: "done", errors: undefined };
  } catch (e) {
    return { success: false, message: "faild", errors: e };
  }
}
