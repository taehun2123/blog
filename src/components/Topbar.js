import { useNavigate } from "react-router";
import styled from "styled-components";
import { useSidebar, useSidebarActions } from "../store/useSidebarStore";
import { useLogin, useLoginActions, useUserImg, useUserName } from "../store/useIsLogin";
import { GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { authService } from "../firebase";


export function Topbar({ isFixed }) {
  const isOpened = useSidebar();
  const { setIsOpened } = useSidebarActions();
  const navigate = useNavigate();
  const isLoggedin = useLogin();
  const userImg = useUserImg();
  const {setUserData} = useLoginActions();
  function handleSidebar() {
    if (window.innerWidth >= 720) setIsOpened();
  }
  
  async function handleGoogleSignIn(){
    try {
      const provider = new GoogleAuthProvider();
      signInWithPopup(authService, provider)
      .then((data)=> {
        navigate("/");
        alert("성공적으로 로그인 되었습니다.");
        window.location.reload();
      })
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignOut(){
    signOut(authService)
    .then(() => {
      alert("성공적으로 로그아웃 되었습니다!");
      setUserData(null);
      navigate("/");
      window.location.reload();
    })
  }
  return (
    <Wrapper>
      <nav
        className={`nav ${isFixed ? "fixed" : ""} ${isOpened ? "opened" : ""}`}
      >
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
          <div class="animate__animated animate__swing animate__infinite">
            /&gt;
          </div>
          <span>EVH WORLD</span>
        </h2>
        <Box>
        <Item onClick={handleSidebar}>
            <svg
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M149.3 216v80c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24v-80c0-13.3 10.7-24 24-24h101.3c13.3 0 24 10.7 24 24zM0 376v80c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24zM125.3 32H24C10.7 32 0 42.7 0 56v80c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24zm80 448H488c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24zm-24-424v80c0 13.3 10.7 24 24 24H488c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24zm24 264H488c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24z" />
            </svg>
          </Item>
          {isLoggedin &&
          <Item>
            <Icon width="30" src={userImg} alt="유저 이미지"></Icon>
          </Item>
          }
          <Item onClick={()=>navigate(`${isLoggedin ? handleSignOut() : handleGoogleSignIn()}`)}>
            {isLoggedin ?
            <svg width="30"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"/></svg>
            :
            <svg
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" />
            </svg>
            }
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
  gap: 1.3rem;
`;

const Item = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  align-items: center;
`;

const Icon = styled.img`
  border-radius: 50%;
  border: 2px solid lightgray;
`
