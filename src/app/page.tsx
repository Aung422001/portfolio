import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { Skills } from "@/components/Skills/Skills";
import { Projects } from "@/components/Projects/Projects";
import { Experience } from "@/components/Experience/Experience";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-1/2 focus:top-3 focus:z-[60] focus:-translate-x-1/2 focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2.5 focus:text-[0.85rem] focus:text-[var(--shell)]"
      >
        Skip to content
      </a>

      <div className="shell">
        <Navbar />
        <main id="main">
          <Hero />
          <Projects />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
