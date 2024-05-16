import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";
import { useEffect } from "react";
import styled from "styled-components";
import { useAdmin } from "../store/useAdmin";

export function Board({ isFixed, targetComponentRef }) {
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [])

  const isAdmin = useAdmin();
  const navigate = useNavigate();
  let {type, name} = useParams();

  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'할 수 있다,'} writer={[`${name} !!`, 'Developer !!']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <BoardTitle>
              <h1 className="effectFont">{name} 관련 게시글</h1>
              {
                isAdmin && <Button onClick={()=>navigate("/edit")}>글쓰기</Button>
              }
            </BoardTitle>
            {type === "list"
            ?
              <Card category={`category.prev`} value={name} />
            : 
              <Card category={`category.current`} value={name} />
            }
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar />
    </div>
  );
}

const BoardTitle = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`

const Button = styled.button`
  padding: 1em 2em;
  background: var(--button-main-color);
  border-radius: 1em;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: var(--button-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;