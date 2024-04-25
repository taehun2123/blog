import Typewriter from "typewriter-effect";
function Loading() {
    return (
        <div className="loading">
        <Typewriter
            options={{
            strings: ["Loading"],
            autoStart: true,
            loop: true,
            }}
        />
        </div>
    );
    }

export default Loading;
