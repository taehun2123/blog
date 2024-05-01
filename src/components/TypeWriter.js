import Typewriter from "typewriter-effect";
export function TypeWriter({prev, writer}){
  return(
    <div className="logo-text">
    {prev}
    <span style={{ color: "lightblue" }}>
      <Typewriter
        options={{
          strings: writer,
          autoStart: true,
          loop: true,
        }}
      />
    </span>
  </div>
  )
}