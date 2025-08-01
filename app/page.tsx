import PlayfulButton from "@/components/playful-button";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-center h-full">
      <PlayfulButton size="xl" variant="primary">
        Sign Up
      </PlayfulButton>
      <PlayfulButton size="lg" variant="secondary">
        Sign In
      </PlayfulButton>
      <PlayfulButton size="md" variant="default">
        Continue as guest
      </PlayfulButton>
    </main>
  );
}
