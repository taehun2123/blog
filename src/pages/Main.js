// firebase.js에서 db를 import
import { useEffect, useState, useRef } from "react";
import { Logo } from "../components/Logo";
import { Intro } from "../components/Intro";
import { Post } from "../components/Post";
import { Sidebar } from "../components/Sidebar";
import { useSidebarActions } from "../store/useSidebarStore";

function Main() {
  const [isFixed, setIsFixed] = useState(false); //상단바 고정 상태관리
  const targetComponentRef = useRef(null); // 특정 컴포넌트 DOM 타겟
  const {setClosed} = useSidebarActions();

  //상단바 고정을 위한 스크롤 이벤트 리스너
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // 창이 720픽셀 아래로 줄어들면 사이드바 닫는 이벤트 리스너
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 720) {
        setClosed();
      }
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //스크롤 핸들러
  const handleScroll = () => {
    const targetComponentTop =
      targetComponentRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (window.scrollY >= targetComponentTop + windowHeight) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };



  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Intro/>
            <h1 data-aos="fade-down" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">새로운 게시글</h1>
            <Post/>
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar/>
    </div>
  );
}



export default Main;
