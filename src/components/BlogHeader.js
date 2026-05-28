import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Topbar } from "./Topbar";
import { TypeWriter } from "./TypeWriter";

export function BlogHeader({ isFixed = false, eyebrow = "DEVTH SPACE :: DEV-TaeHun SPACE", prev = "", writer = [], children }) {
  const headerRef = useRef(null);
  const scrollLockRef = useRef(false);

  useEffect(() => {
    return () => {
      scrollLockRef.current = false;
    };
  }, []);

  const handleWheel = (event) => {
    if (event.deltaY <= 0 || scrollLockRef.current) return;

    const nextContent = headerRef.current?.nextElementSibling;
    if (!nextContent) return;

    event.preventDefault();
    scrollLockRef.current = true;
    nextContent.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 900);
  };

  return (
    <Header ref={headerRef} onWheel={handleWheel}>
      <Topbar isFixed={isFixed} />
      <HeaderInner>
        <Eyebrow>{eyebrow}</Eyebrow>
        <HeaderWriter key={writer.join("|")} prev={prev} writer={writer} />
        {children && <HeaderContent>{children}</HeaderContent>}
      </HeaderInner>
    </Header>
  );
}

const Header = styled.header`
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  overflow: hidden;

  .nav:not(.fixed) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`;

const HeaderInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(1100px, calc(100% - 2em));
  margin: 0 auto;
  padding: 7em 0 4em;
  box-sizing: border-box;
  text-align: center;
`;

const Eyebrow = styled.div`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #a7f3d0;
  margin-bottom: 1em;
`;

const HeaderWriter = styled(TypeWriter)`
  position: relative;
  width: min(100%, 920px);
  height: auto;
  margin: 0 auto;
  font-size: clamp(42px, 8vw, 88px);
  line-height: 1.05;
  font-weight: 900;
  color: white;
  text-align: center;
  transform: none;

  span {
    color: #bfdbfe !important;
  }
`;

const HeaderContent = styled.div`
  margin-top: 1.5em;
  color: white;
`;
