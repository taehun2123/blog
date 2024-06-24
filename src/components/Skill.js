import styled from "styled-components";
import htmlImg from "./Items/html.png";
import cssImg from "./Items/css.png";
import javasciptImg from "./Items/javascript.png";
import reactImg from "./Items/logo.svg";
import nodeImg from "./Items/node.png";
import bearImg from "./Items/bear.jpg";
import mysqlImg from "./Items/mysql.png";
import tanstackImg from "./Items/image.jpeg";
import tsImg from "./Items/ts.webp";
import fireImg from "./Items/fire.webp";
import javaImg from "./Items/java.png";
import mongImg from "./Items/mong.png";
import githubImg from "./Items/git-hub.png";
import gitImg from "./Items/git.png";
import adspImg from "./Items/adsp.png";
import istqbImg from "./Items/istqb.png";
import comImg from "./Items/com.png";
import linuxImg from "./Items/linux.png";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";

const Skill = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const frontArr = [
    { img: htmlImg, name: "HTML" },
    { img: cssImg, name: "CSS" },
    { img: javasciptImg, name: "JavaScript" },
    { img: reactImg, name: "React" },
    { img: tanstackImg, name: "React-Query" },
    { img: bearImg, name: "Zustand" },
    { img: tsImg, name: "TypeScript" },
  ];
  const backArr = [
    { img: mysqlImg, name: "MySql" },
    { img: nodeImg, name: "Express" },
    { img: fireImg, name: "Firebase" },
    { img: javaImg, name: "Java" },
    { img: mongImg, name: "MongoDB" },
  ];
  const version = [
    { img: githubImg, name: "Github" },
    { img: gitImg, name: "Git" },
  ];
  const certificate = [
    { img: adspImg, name: "ADsP" },
    { img: istqbImg, name: "ISTQB" },
    { img: comImg, name: "컴활 2급" },
    { img: linuxImg, name: "Linux Master 2급" },
  ];

  return (
    <div
      ref={ref}
      style={{
        paddingBottom: "5em",
        borderTop: "1px solid lightgray",
        borderBottom: "1px solid lightgray",
        paddingTop: "5em",
      }}
      data-aos="fade-up"
      aos-offset="600"
      aos-easing="ease-in-sine"
      aos-duration="1200"
    >
      <h1 className="effectFont">
        <i class="fas fa-code"></i> Skills
      </h1>
      <SkillContainer>
        <SkillCard
          data-aos="fade-up"
          aos-offset="600"
          aos-easing="ease-in-sine"
          aos-duration="1200"
          onClick={() => navigate(`/board/list/FrontEnd`)}
        >
          <CardTitle>
            <h3 className="effectFont">FrontEnd</h3>
          </CardTitle>
          <SkillImageBox>
            {frontArr.map((item, index) => (
              <SKillBall key={index} className={`b${index + 1}`}>
                <SkillImage src={item.img} alt="Skill Image" />
              </SKillBall>
            ))}
          </SkillImageBox>
        </SkillCard>
        <SkillCard
          data-aos="fade-up"
          aos-offset="600"
          aos-easing="ease-in-sine"
          aos-duration="1000"
          onClick={() => navigate(`/board/list/BackEnd`)}
        >
          <CardTitle>
            <h3 className="effectFont">BackEnd</h3>
          </CardTitle>
          <SkillImageBox>
            {backArr.map((item, index) => (
              <SKillBall key={index} className={`b${index + 1}`}>
                <SkillImage src={item.img} alt="Skill Image" />
              </SKillBall>
            ))}
          </SkillImageBox>
        </SkillCard>
        <SkillCardBox>
          <SkillCardHalf
            data-aos="fade-up"
            aos-offset="600"
            aos-easing="ease-in-sine"
            aos-duration="800"
            onClick={() => navigate(`/board/list/ETC`)}
          >
            <CardTitle>
              <h3 className="effectFont">Version Control</h3>
            </CardTitle>
            <SkillImageBoxHalf>
              {version.map((item, index) => (
                <SKillBall key={index} className={`b${index + 1}`}>
                  <SkillImage src={item.img} alt="Skill Image" />
                </SKillBall>
              ))}
            </SkillImageBoxHalf>
          </SkillCardHalf>
          <SkillCardHalf
            data-aos="fade-up"
            aos-offset="600"
            aos-easing="ease-in-sine"
            aos-duration="600"
            style={{ cursor: "default" }}
          >
            <CardTitle>
              <h3 className="effectFont">Certificate</h3>
            </CardTitle>
            <SkillImageBoxHalf>
              {certificate.map((item, index) => (
                <SKillBall key={index} className={`b${index + 1}`}>
                  <SkillImage src={item.img} alt="Skill Image" />
                </SKillBall>
              ))}
            </SkillImageBoxHalf>
          </SkillCardHalf>
        </SkillCardBox>
      </SkillContainer>
    </div>
  );
});
export default Skill;

const SkillContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  min-height: 50vh;
  gap: 0.5em;
  margin-bottom: 1em;
  flex-wrap: wrap;
`;

const SkillCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  min-height: 50vh;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  transition: transform 0.5s;
  overflow: hidden;
  &:hover {
    box-shadow: 3px 5px 6px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-10px);
    cursor: pointer;
  }
`;

const SkillCardBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  min-height: 50vh;
  box-sizing: border-box;
  gap: 0.5em;
`;

const SkillCardHalf = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  min-height: 25vh;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  transition: transform 0.5s;
  overflow: hidden;
  &:hover {
    box-shadow: 3px 5px 6px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    cursor: pointer;
    z-index: 990;
  }
`;

const CardTitle = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1em;
  border-bottom: 1px solid lightgray;
`;

const SkillImageBox = styled.div`
  width: 100%;
  height: 50vh;
  overflow: hidden;
  position: relative;
`;

const SkillImageBoxHalf = styled.div`
  width: 100%;
  height: 25vh;
  overflow: hidden;
  position: relative;
`;

const SKillBall = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.4),
    inset 1em 1em 1em rgba(255, 255, 255, 0.6), 0 1em 2em rgba(0, 0, 0, 0.25);
`;
const SkillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
