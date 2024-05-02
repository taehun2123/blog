import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { Posts } from "../components/Posts";
import logoVideo from "../components/Items/logo_background.mp4";
import { TypeWriter } from "../components/TypeWriter";

export function Board({ isFixed, targetComponentRef }) {
  let {type, name} = useParams();

  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'할 수 있다,'} writer={[`${name} !!`, 'Developer !!']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Posts category={`category.current`} value={name} />
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar />
    </div>
  );
}
