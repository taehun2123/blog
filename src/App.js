import { useEffect, useRef, useState } from 'react';
import './App.css';
import Router from "./Router";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Include AOS CSS styles
import { useSidebarActions } from './store/useSidebarStore';

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

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
    <>
      <Router isFixed={isFixed} targetComponentRef={targetComponentRef}/>
    </>
  );
}

export default App