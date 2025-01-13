import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Faq />
    </div>
  );
}
