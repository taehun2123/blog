import { useNavigate } from "react-router";
import styled from "styled-components";
import { useSidebar, useSidebarActions } from "../store/useSidebarStore";

export function Topbar({ isFixed }) {
  const isOpened = useSidebar();
  const {setIsOpened} = useSidebarActions();
  const navigate = useNavigate();
  function handleSidebar(){
    if(window.innerWidth >= 720)
      setIsOpened();
  }
  return (
    <Wrapper>
      <nav className={`nav ${isFixed ? "fixed" :''} ${isOpened ? "opened" : ''}`}>
        <h2
          className="nav-logo"
          onClick={() => {
            navigate("/");
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <div class="animate__animated animate__swing animate__infinite">/&gt;</div>
          <span>EVH WORLD</span>
        </h2>
        <Box>
          <Item>
            <svg
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              onClick={() =>
                window.open("http://www.github.com/taehun2123", "_blank")
              }
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
            </svg>
          </Item>
          <Item>
            <svg
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={() =>
                window.open("https://hundev.tistory.com/", "_blank")
              }
            >
              <path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"></path>
            </svg>
          </Item>
          <Item>
            <svg
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              onClick={() =>
                window.open("http://www.instagram.com/1aehun2_", "_blank")
              }
            >
              <path d="M224 202.7A53.3 53.3 0 1 0 277.4 256 53.4 53.4 0 0 0 224 202.7zm124.7-41a54 54 0 0 0 -30.4-30.4c-21-8.3-71-6.4-94.3-6.4s-73.3-1.9-94.3 6.4a54 54 0 0 0 -30.4 30.4c-8.3 21-6.4 71.1-6.4 94.3S91 329.3 99.3 350.3a54 54 0 0 0 30.4 30.4c21 8.3 71 6.4 94.3 6.4s73.2 1.9 94.3-6.4a54 54 0 0 0 30.4-30.4c8.4-21 6.4-71.1 6.4-94.3S357.1 182.7 348.8 161.7zM224 338a82 82 0 1 1 82-82A81.9 81.9 0 0 1 224 338zm85.4-148.3a19.1 19.1 0 1 1 19.1-19.1A19.1 19.1 0 0 1 309.4 189.7zM400 32H48A48 48 0 0 0 0 80V432a48 48 0 0 0 48 48H400a48 48 0 0 0 48-48V80A48 48 0 0 0 400 32zM382.9 322c-1.3 25.6-7.1 48.3-25.9 67s-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.9-67c-1.5-26.4-1.5-105.6 0-132 1.3-25.6 7.1-48.3 25.9-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0 25.6 1.3 48.3 7.2 67 25.9s24.6 41.4 25.9 67.1C384.4 216.4 384.4 295.6 382.9 322z"></path>
            </svg>
          </Item>
          <Item onClick={handleSidebar}>
            <svg               
            width="30"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512">
              <path d="M149.3 216v80c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24v-80c0-13.3 10.7-24 24-24h101.3c13.3 0 24 10.7 24 24zM0 376v80c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24zM125.3 32H24C10.7 32 0 42.7 0 56v80c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24zm80 448H488c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24zm-24-424v80c0 13.3 10.7 24 24 24H488c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24zm24 264H488c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24z" />
            </svg>
          </Item>
        </Box>
      </nav>
    </Wrapper>
  );
}

// Styled Components Source

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const Box = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  gap: 2em;
`;

const Item = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  align-items: center;
`;
