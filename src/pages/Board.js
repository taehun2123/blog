import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";

export function Board({isFixed, targetComponentRef}){
  return(
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">

          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar/>
    </div>
  )
}