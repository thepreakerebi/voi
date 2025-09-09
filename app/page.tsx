import Header from "./_components/header";
import TextMode from "./(text-chat)/text-mode";

export default function Home() {
  return (
    <section className="h-full">
      <Header />
      <section className="w-full px-3 md:px-64 py-16 bg-secondary">
        <TextMode />
      </section>
    </section>
  );
}
