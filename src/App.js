import { useEffect, useRef, useState } from 'react';
import './App.css';
import Router from "./Router";
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS CSS styles
import 'animate.css/animate.min.css'; // animate.css를 import
import { useSidebarActions } from './store/useSidebarStore';
import { authService } from './firebase'
import { useLoginActions, useUserData } from './store/useIsLoggin';

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  const [isFixed, setIsFixed] = useState(false); //상단바 고정 상태관리
  const targetComponentRef = useRef(null); // 특정 컴포넌트 DOM 타겟
  const {setClosed} = useSidebarActions();
  const {setIsLoggedIn, setUserData, setUserImg} = useLoginActions();
  
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setUserImg(user.photoURL)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
  }, [])

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
      targetComponentRef.current?.getBoundingClientRect().top;
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