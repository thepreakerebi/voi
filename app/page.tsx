import Header from "./_components/header";
import TextMode from "./(text-chat)/text-mode";

export default function Home() {
  return (
    <section>
      <Header />
      <section className="w-full h-fit px-3 md:px-64 py-16 bg-secondary dark:bg-secondary/20">
        <TextMode />
      </section>
    </section>
  );
}
