import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TeamSection from "@/components/sections/TeamSection";
import NewsSection from "@/components/sections/NewsSection";
import CTASection from "@/components/sections/CTASection";

const IndexPage = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <TeamSection />
      <CTASection />
    </div>
  );
};

export default IndexPage;
