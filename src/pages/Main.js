// firebase.js에서 db를 import
import { Logo } from "../components/Logo";
import { Intro } from "../components/Intro";
import { Sidebar } from "../components/Sidebar";
import { MainPost } from "../components/Main/MainPost";
import logoVideo from "../components/Items/logo_background.mp4";
import { MainTypeWriter } from "../components/Main/MainTypeWriter";


function Main({isFixed, targetComponentRef}) {
  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} Writer={MainTypeWriter()}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Intro/>
            <h1 data-aos="fade-down" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">최근 올라온 게시글</h1>
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
