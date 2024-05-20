import Typewriter from "typewriter-effect";
function Loading() {
    return (
        <div className="loading">
        <Typewriter
            options={{
            strings: ["Loading...", "or Not Page 404..."],
            autoStart: true,
            loop: true,
            }}
        />
        </div>
    );
    }

export default Loading;
