import styled from "styled-components";
import htmlImg from "./Items/html.png";
import cssImg from "./Items/css.png";
import javasciptImg from "./Items/javascript.png";
import reactImg from "./Items/logo.svg";
import nodeImg from "./Items/node.png";
import bearImg from "./Items/bear.jpg";
import mysqlImg from "./Items/mysql.png";
import tanstackImg from "./Items/tanstack.svg";
import tsImg from "./Items/ts.webp";

export function Skill() {
  const imgObjd = [
    {img: htmlImg, name: "HTML"},
    {img: cssImg, name: "CSS"},
    {img: javasciptImg, name: "JavaScript"},
    {img: reactImg, name: "React"},
    {img: tanstackImg, name: "React-Query"},
    {img: bearImg, name: "Zustand"},
    {img: mysqlImg, name: "MySql"},
    {img: nodeImg, name: "Express"},
    {img: tsImg, name: "TypeScript"}
  ];
  return (
    <div
      style={{marginBottom: '4em'}}
      data-aos="fade-up"
      aos-offset="600"
      aos-easing="ease-in-sine"
      aos-duration="1200"
    >
      <h1 className="effectFont"><i class="fas fa-code"></i> Skills</h1>
      <SkillContainer>
        {imgObjd.map((item, index) => (
          <SkillCard>
            <SkillImageBox key={index}>
              <SkillImage src={item.img} alt="Skill Image" />
            </SkillImageBox>
            <SkillDesciptionBox>
              <h3>{item.name}</h3>
            </SkillDesciptionBox>
          </SkillCard>
        ))}
      </SkillContainer>
    </div>
  );
}

const SkillContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
`;

const SkillCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 350px;
  min-height: 200px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 1em;
  gap: 1em;
`;

const SkillImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  min-width: 150px
  min-height: 150px;
  border-radius: 50%;
  object-fit:cover;
  border: 2px dotted lightgray;
  overflow: hidden;
`;

const SkillImage = styled.img`
  object-fit: cover;
  width: 120px;
  height:120px;
`;

const SkillDesciptionBox = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 3px dotted lightgray;
`;
