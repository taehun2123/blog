import { Topbar } from "./Topbar";
export function Logo({ isFixed, background, writer, isPost }) {
  return (
    <header className="header" role="banner">
      <div className="wrapper">
        <Topbar isFixed={isFixed}/>
        <div className="title">
          <video autoPlay loop muted playsInline>
            <source src={background} type="video/mp4" />
          </video>
        </div>
        {writer}
      </div>
    </header>
  );
}
