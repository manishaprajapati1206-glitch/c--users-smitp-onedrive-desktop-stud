import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to onboarding for new users
  // In production, check auth state and redirect accordingly
  redirect("/onboarding");
}
