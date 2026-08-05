import useLenis from './hooks/useLenis';
import Navbar from './layout/Navbar';
import SectionDivider from './components/SectionDivider';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import HeroSection from './sections/HeroSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import ProfileSection from './sections/ProfileSection';
import SkillsSection from './sections/SkillsSection';
import AwardsSection from './sections/AwardsSection';
import FooterSection from './sections/FooterSection';
import './App.css';

export default function App() {
  const lenisRef = useLenis();

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">跳至主要内容</a>
      <ScrollProgress />
      <Navbar lenisRef={lenisRef} />

      <main id="main-content">
        <HeroSection />
        <SectionDivider />
        <ExperienceSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ProfileSection />
        <SectionDivider />
        <AwardsSection />
      </main>

      <SectionDivider />
      <FooterSection />
      <BackToTop lenisRef={lenisRef} />
    </div>
  );
}
