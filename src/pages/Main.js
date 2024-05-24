import { Logo } from "../components/Logo";
import Intro from "../components/Intro";
import { Sidebar } from "../components/Sidebar";
import MainPost from "../components/Main/MainPost";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";
import Skill from "../components/Skill";
import { useScroll, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Projects from "../components/Projects";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; //툴팁

function Main({ isFixed, targetComponentRef }) {
  const targetRefs = useRef([]);
  const [targetPositions, setTargetPositions] = useState([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const updateTargetPositions = () => {
      const positions = targetRefs.current.map((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          return rect.top + window.scrollY;
        }
        return 0;
      });
      setTargetPositions(positions);
    };

    updateTargetPositions();
    window.addEventListener("resize", updateTargetPositions);
    return () => window.removeEventListener("resize", updateTargetPositions);
  }, []);

  const handleScrollToRef = (index) => {
    if (targetRefs.current[index]) {
      targetRefs.current[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container">
      <motion.div style={{ scaleX: scrollYProgress }} className="bar" />
      {targetPositions.map((position, index) => {
        const progressValue =
          position / (document.body.scrollHeight - window.innerHeight);
        return (
          <div
            data-tooltip-id="position"
            data-tooltip-content={
              index === 0
                ? "Who am I"
                : index === 1
                ? "Skills"
                : index === 2
                ? "Projects"
                : "Posts"
            }
            key={index}
            onClick={() => handleScrollToRef(index)}
            style={{
              position: "fixed",
              bottom: "0",
              left: `calc(${progressValue * 100}% - 10px)`,
              right: '0',
              width: '0',
              height: '0',
              borderLeft: `14px solid ${targetRefs.current === index ? "lightgray" : 'transparent'}`,
              borderRight: `14px solid ${targetRefs.current === index ? "lightgray" : 'transparent'}`,
              borderTop: "14px solid lightgray",
              cursor: "pointer",
              zIndex: "999",
            }}
          />
        );
      })}
      <Tooltip
        style={{zIndex: '999'}}
        id="position"
        place="top"
        arrowColor="transparent"
        backgroundColor="gray"
      />
      <div className="body">
        <Logo
          isFixed={isFixed}
          background={logoVideo}
          writer={
            <TypeWriter
              prev={"Hello,"}
              writer={["DEVH WORLD", "Developer Hun"]}
            />
          }
        />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Intro ref={(el) => (targetRefs.current[0] = el)} />
            <Skill ref={(el) => (targetRefs.current[1] = el)} />
            <Projects ref={(el) => (targetRefs.current[2] = el)} />
            <MainPost ref={(el) => (targetRefs.current[3] = el)} />
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar />
    </div>
  );
}

export default Main;
