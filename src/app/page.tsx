import Snake from "@/components/Snake";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl font-bold text-center">Snake Game</h1>
      <Snake />

      <footer className="flex w-full items-center justify-center space-x-4">
        <p className="text-sm text-center">
          Made with ❤️ by{" "}
          <a href="" className="text-blue-500">
            Farid Vatani
          </a>
        </p>
      </footer>
    </main>
  );
}
