import { Topbar } from "./Topbar";
import logoVideo from "./logo_background.mp4";
import Typewriter from "typewriter-effect";
export function Logo({ isFixed }) {
  return (
    <header class="header" role="banner">
      <div class="wrapper">
        <Topbar isFixed={isFixed}/>
        <div class="title">
          <video autoPlay loop muted playsInline>
            <source src={logoVideo} type="video/mp4" />
          </video>
        </div>
        <div className="logo-text">
          Hello,
          <span style={{ color: "lightblue" }}>
            <Typewriter
              options={{
                strings: ["Developer Hun", "DEVH World"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </div>
      </div>
    </header>
  );
}
