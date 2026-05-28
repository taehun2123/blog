import Typewriter from "typewriter-effect";
export function TypeWriter({prev, writer, className = "logo-text"}){
  return(
    <div className={className}>
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
