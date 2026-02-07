import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const { data: assignments, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Attach public URLs
  const withUrls = assignments.map((a) => {
    const { data } = supabase.storage
      .from("assignments")
      .getPublicUrl(a.file_path);
    return { ...a, url: data.publicUrl };
  });

  return NextResponse.json({ assignments: withUrls });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { id, filePath } = await request.json();

  if (!id || !filePath) {
    return NextResponse.json({ error: "id and filePath are required" }, { status: 400 });
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("assignments")
    .remove([filePath]);

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  // Delete from DB
  const { error: dbError } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
