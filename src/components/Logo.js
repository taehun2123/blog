import { Topbar } from "./Topbar";
export function Logo({ isFixed, background, writer }) {
  return (
    <header class="header" role="banner">
      <div class="wrapper">
        <Topbar isFixed={isFixed}/>
        <div class="title">
          <video autoPlay loop muted playsInline>
            <source src={background} type="video/mp4" />
          </video>
        </div>
        {writer}
      </div>
    </header>
  );
}
