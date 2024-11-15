import { StructuredPromptGenerator } from "@/components/structured-prompt-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-10">
      <StructuredPromptGenerator />
    </main>
  );
}
