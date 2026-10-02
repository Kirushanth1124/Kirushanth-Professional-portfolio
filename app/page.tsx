import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import TestimonialSubmit from "@/components/sections/TestimonialSubmit";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      <Navbar />

      <main className="relative z-10 bg-white text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certificates />
        <Testimonials />
        <Contact />
        <TestimonialSubmit />             
        <Footer />
      </main>
    </>
  );
}