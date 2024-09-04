import Snake from "@/components/Snake";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-700 mb-6">Snake Game</h1>
      <Snake />
      <footer className="mt-8 text-center">
        <p className="text-gray-700 text-sm">
          Made by{" "}
          <Link href="https://github.com/faridvatani" className="text-blue-500">
            Farid Vatani
          </Link>
        </p>
        <p className="text-sm mt-2">
          <Link
            href="https://github.com/faridvatani/snake-nextjs"
            className="text-blue-500"
            target="_blank"
          >
            Source Code
          </Link>
        </p>
      </footer>
    </main>
  );
}
