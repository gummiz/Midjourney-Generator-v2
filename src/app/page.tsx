import { StructuredPromptGenerator } from "@/components/structured-prompt-generator";
import  PromptGenerator  from "@/components/promptgenerator"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-10">
      {/* <StructuredPromptGenerator /> */}
      <PromptGenerator />
    </main>
  );
}
