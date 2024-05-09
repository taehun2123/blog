// firebase.js에서 db를 import
import { Logo } from "../components/Logo";
import { Intro } from "../components/Intro";
import { Sidebar } from "../components/Sidebar";
import { MainPost } from "../components/Main/MainPost";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";
import { Skill } from "../components/Skill";
import styled from "styled-components";
import { useScroll, motion } from "framer-motion";


function Main({isFixed, targetComponentRef}) {
  const { scrollYProgress } = useScroll();

  return (
    <div className="container">
      <motion.div style={{ scaleX: scrollYProgress }} className="bar" />
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'Hello,'} writer={['DEVH WORLD', 'Developer Hun']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Intro/>
            <Skill/>
            <MainPost/>
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar/>
    </div>
  );
}


export default Main;

