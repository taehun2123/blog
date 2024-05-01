import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { Posts } from "../components/Posts";
import logoVideo from "../components/Items/logo_background.mp4"

export function Board({isFixed, targetComponentRef}){
  let name = useParams();

  return(
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} Writer={<span>{name.id}</span>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Posts category={"category.study"} value={name.id}/>
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar/>
    </div>
  )
}