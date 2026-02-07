import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const courseId = formData.get("courseId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!courseId) {
    return NextResponse.json({ error: "No courseId provided" }, { status: 400 });
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  // Create a unique file path
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${courseId}/${timestamp}_${sanitizedName}`;

  // Upload the actual file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("assignments")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Save metadata to the assignments table
  const { data: assignment, error: dbError } = await supabase
    .from("assignments")
    .insert({
      course_id: courseId,
      file_name: file.name,
      file_path: uploadData.path,
      file_size: file.size,
      file_type: file.type,
      status: "uploaded",
    })
    .select()
    .single();

  if (dbError) {
    // Clean up uploaded file if DB insert fails
    await supabase.storage.from("assignments").remove([filePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Get public URL for the file
  const { data: urlData } = supabase.storage
    .from("assignments")
    .getPublicUrl(uploadData.path);

  return NextResponse.json({
    assignment: {
      ...assignment,
      url: urlData.publicUrl,
    },
  });
}
