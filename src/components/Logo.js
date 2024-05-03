import { useEffect, useRef } from "react";
import { Topbar } from "./Topbar";
export function Logo({ isFixed, background, writer }) {
  const videoRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const video = videoRef.current;
      const writer = writerRef.current;
      if (!video || !writer) return;

      const writerPosition = writer.getBoundingClientRect().top;
      if (window.scrollY >= window.innerHeight + writerPosition) {
        video.style.position = 'absolute';
        video.style.top = `${writerPosition - window.innerHeight}px`;
      } else {
        video.style.position = 'fixed';
        video.style.top = '0px';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header" role="banner">
      <div className="wrapper">
        <Topbar isFixed={isFixed}/>
        <div className="title">
          <video autoPlay loop muted playsInline ref={videoRef}>
            <source src={background} type="video/mp4" />
          </video>
        </div>
        {writer}
        <div className="writer" ref={writerRef}>
        </div>
      </div>
    </header>
  );
}
