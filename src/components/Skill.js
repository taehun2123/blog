import styled from "styled-components"
import htmlImg from "./Items/html.png"

export function Skill(){
  return(
    <div data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
      <h1 className="effectFont">Skills</h1>
      <SkillContainer>
        <SkillCard>
          <SkillImageBox>
            <SkillImage src={htmlImg} alt="HTML" />
          </SkillImageBox>
          <SkillDesciptionBox>

          </SkillDesciptionBox>
        </SkillCard>
      </SkillContainer>
    </div>
  )
}

const SkillContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  min-height: 50vh;
  flex-wrap: warp;
`

const SkillCard = styled.div`
  display: flex;
  flex-direction : row;
  justify-content: center;
  align-items: center;
  width: 400px;
  min-height: 200px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1em;
`

const SkillImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  width: 150px
  height: 150px;
  border-radius: 50%;
  object-fit:cover;
  border: 2px dotted lightgray;
`

const SkillImage = styled.img`
object-fit:cover;
width: 150px;
`

const SkillDesciptionBox = styled.div`
flex: 1;
border-left: 3px dotted lightgray;
`