import { StructuredPromptGenerator } from "@/components/structured-prompt-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <StructuredPromptGenerator />
    </main>
  );
}
