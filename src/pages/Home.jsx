import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import videoBackground from "../assets/videos/background.mp4";
import { Overlay } from "../components/Content/Overlay.jsx";
import { Description } from "../components/Content/Description.jsx";
import { AboutUs } from "../components/Content/AboutUs.jsx";
import { Recomendados } from "../components/Content/Recomendados.jsx";

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId) return;

    const frame = window.requestAnimationFrame(() => {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      navigate(".", { replace: true, state: null });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.state, navigate]);

  return (
    <>
      <video
        autoPlay
        muted
        playsInline
        loop
        id="videoBackground"
        aria-hidden="true"
        role="presentation"
      >
        <source src={videoBackground} type="video/mp4" />
      </video>
      <main className="main-content">
        <Overlay />
        <section className="scroll-content">
          <Description />
          <Recomendados />
          <AboutUs />
        </section>
      </main>
    </>
  );
}
