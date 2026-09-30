import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { Skills } from "@/components/Skills/Skills";
import { Services } from "@/components/Services/Services";
import { Projects } from "@/components/Projects/Projects";
import { Experience } from "@/components/Experience/Experience";
import { Process } from "@/components/Process/Process";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className="p-2 sm:p-3 lg:p-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-1/2 focus:top-3 focus:z-[60] focus:-translate-x-1/2 focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2.5 focus:text-[0.85rem] focus:text-[var(--shell)]"
      >
        Skip to content
      </a>

      {/* The whole site sits on the turquoise page as one rounded card */}
      <div className="shell">
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Experience />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
