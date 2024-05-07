// firebase.js에서 db를 import
import { Logo } from "../components/Logo";
import { Intro } from "../components/Intro";
import { Sidebar } from "../components/Sidebar";
import { MainPost } from "../components/Main/MainPost";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";
import { Skill } from "../components/Skill";


function Main({isFixed, targetComponentRef}) {
  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'Hello,'} writer={['DEVH WORLD', 'Developer Hun']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Intro/>
            <Skill/>
            <h1 className="effectFont" data-aos="fade-down" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">Posts</h1>
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
