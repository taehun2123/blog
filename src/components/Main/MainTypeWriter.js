import Typewriter from "typewriter-effect";
export function MainTypeWriter(){
  return(
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
  )
}