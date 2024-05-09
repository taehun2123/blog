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
import fireImg from "./Items/fire.webp"
import javaImg from "./Items/java.png"
import mongImg from "./Items/mong.png"


import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"


export function Skill() {
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

  

  return (
    <div
      style={{ paddingBottom: "5em", borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', paddingTop: '5em'}}
      data-aos="fade-up"
      aos-offset="600"
      aos-easing="ease-in-sine"
      aos-duration="1200"
    >
      <h1 className="effectFont">
        <i class="fas fa-code"></i> Skills
      </h1>
      <SkillContainer>
        <SkillCard onClick={() => navigate(`/board/list/FrontEnd`)}>
          <CardTitle>
            <h3 className="effectFont">FrontEnd</h3>
          </CardTitle>
          <SkillImageBox>
            {frontArr.map((item, index) => 
            <SKillBall className={`b${index + 1}`}>
              <SkillImage src={item.img} alt="Skill Image"/>
            </SKillBall>
            )}
          </SkillImageBox>
        </SkillCard>
        <SkillCard onClick={() => navigate(`/board/list/BackEnd`)}>
          <CardTitle>
            <h3 className="effectFont">BackEnd</h3>
          </CardTitle>
          <SkillImageBox>
            {backArr.map((item, index) => 
            <SKillBall className={`b${index + 1}`}>
              <SkillImage src={item.img} alt="Skill Image"/>
            </SKillBall>
            )}
          </SkillImageBox>
        </SkillCard>
        <SkillCard onClick={() => navigate(`/board/list/Version`)}>
          <CardTitle>
            <h3 className="effectFont">Version Control</h3>
          </CardTitle>
          <SkillImageBox>
            {backArr.map((item, index) => 
            <SKillBall className={`b${index + 1}`}>
              <SkillImage src={item.img} alt="Skill Image"/>
            </SKillBall>
            )}
          </SkillImageBox>
        </SkillCard>
      </SkillContainer>
    </div>
  );
}

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
  flex-wrap;
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

const SKillBall = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden; 
  position:absolute;
  box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.4), inset 1em 1em 1em rgba(255, 255, 255, 0.6), 0 1em 2em rgba(0, 0, 0, 0.25);
`
const SkillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
