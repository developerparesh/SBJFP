import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import HowMatchingSection from "@/components/sections/HowMatchingSection";
import ForJobSeekersSection from "@/components/sections/ForJobSeekersSection";
import ForEmployersSection from "@/components/sections/ForEmployersSection";
import TrustSection from "@/components/sections/TrustSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProblemsSection />
        <HowMatchingSection />
        <ForJobSeekersSection />
        <ForEmployersSection />
        <TrustSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
