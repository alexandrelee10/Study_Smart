import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import { CourseType, Difficulty, EducationLevel} from "@prisma/client"
import { revalidatePath } from "next/cache";

// Create Courses
export async function createCourse(formData: FormData) {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const description = String(formData.get("description") ?? "" ).trim();
    const image = String(formData.get("image") ?? "").trim();
    const type = formData.get("type") as CourseType ?? "OTHER";
    const edLevel = formData.get("edLevel") as EducationLevel ?? "OTHER";
    const difficulty = formData.get("difficulty") as Difficulty ?? "MEDIUM";

    // Ensure course has either a course code, name, and education level
    if (!name || !code || !edLevel) throw new Error("Name, code, and education level required.");

    // create course
    await prisma.course.create({
        data: { name, code, description, image, type, edLevel, difficulty },
    });

    revalidatePath("/admin/courses");
}
// Update Courses 
export async function updateCourse(id: string, formData: FormData) {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const description = String(formData.get("description") ?? "" ).trim();
    const image = String(formData.get("image") ?? "").trim();
    const type = formData.get("type") as CourseType ?? "OTHER";
    const edLevel = formData.get("edLevel") as EducationLevel ?? "OTHER";
    const difficulty = formData.get("difficulty") as Difficulty ?? "MEDIUM";

    if (!name || !code || !edLevel) throw new Error("Name, course code, and education level are required.");

    await prisma.course.update({
        where: { id },
        data: {name, code, description, image, type, edLevel, difficulty},
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}/edit`);
}

// Delete Courses
export async function deleteCourse(id: string) {
    await requireAdmin();

    await prisma.course.delete({
        where: {id },
    });
    
    revalidatePath("/admin/courses");
}