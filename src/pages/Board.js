import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";
import { useEffect } from "react";

export function Board({ isFixed, targetComponentRef }) {
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [])

  let {type, name} = useParams();

  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'할 수 있다,'} writer={[`${name} !!`, 'Developer !!']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <h1 className="effectFont">{name} 관련 게시글</h1>
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
