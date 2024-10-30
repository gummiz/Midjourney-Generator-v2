import Image from "next/image";
import { PromptGenerator } from "@/components/prompt-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <PromptGenerator />
    </main>
  );
}
