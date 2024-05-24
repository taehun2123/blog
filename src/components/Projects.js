import { forwardRef } from "react";
import styled from "styled-components";
import ImageGallery from 'react-image-gallery';
import MDEditor from "@uiw/react-md-editor";

const Projects = forwardRef((props, ref) =>{
  const projectData = [
    {
      title: "B2B 물산 쇼핑몰",
      date: "2023.08 ~ (외주 팀 프로젝트(2명))",
      image: [{
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%91%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%8C%E1%85%B5%20-%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%B3%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%AA%E1%86%AB%E1%84%85%E1%85%AD.png?alt=media&token=a2b2049e-936e-4d36-b05b-524e8fb4edf2',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%91%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%8C%E1%85%B5%20-%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%B3%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%AA%E1%86%AB%E1%84%85%E1%85%AD.png?alt=media&token=a2b2049e-936e-4d36-b05b-524e8fb4edf2'
      },
      {
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%87%E1%85%A1%E1%84%80%E1%85%AE%E1%84%82%E1%85%B5%20-%20%E1%84%8B%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%90%E1%85%A6%E1%86%B7O.png?alt=media&token=3497d08b-0289-48da-b638-985d602c2bc8',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%87%E1%85%A1%E1%84%80%E1%85%AE%E1%84%82%E1%85%B5%20-%20%E1%84%8B%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%90%E1%85%A6%E1%86%B7O.png?alt=media&token=3497d08b-0289-48da-b638-985d602c2bc8'
      },
      {
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%8C%E1%85%AE%E1%84%86%E1%85%AE%E1%86%AB%3A%E1%84%87%E1%85%A2%E1%84%89%E1%85%A9%E1%86%BC%20-%20%E1%84%8B%E1%85%B1.png?alt=media&token=e5880453-8416-4c2d-9fc8-726caf7aa4eb',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%8C%E1%85%AE%E1%84%86%E1%85%AE%E1%86%AB%3A%E1%84%87%E1%85%A2%E1%84%89%E1%85%A9%E1%86%BC%20-%20%E1%84%8B%E1%85%B1.png?alt=media&token=e5880453-8416-4c2d-9fc8-726caf7aa4eb'
      },
      {
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%80%E1%85%A5%E1%86%B7%E1%84%89%E1%85%A2%E1%86%A8%20%E1%84%80%E1%85%A7%E1%86%AF%E1%84%80%E1%85%AA%20-%20%E1%84%91%E1%85%B5%E1%86%AF%E1%84%90%E1%85%A5.png?alt=media&token=33e53301-1882-416c-a2a4-18aa23fd8677',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%80%E1%85%A5%E1%86%B7%E1%84%89%E1%85%A2%E1%86%A8%20%E1%84%80%E1%85%A7%E1%86%AF%E1%84%80%E1%85%AA%20-%20%E1%84%91%E1%85%B5%E1%86%AF%E1%84%90%E1%85%A5.png?alt=media&token=33e53301-1882-416c-a2a4-18aa23fd8677'
      },
      {
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%80%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%A8%20%E1%84%80%E1%85%AA%E1%86%AB%E1%84%85%E1%85%B5.png?alt=media&token=06606216-3e4d-4133-94ff-9e9c3ebab40e',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2F%E1%84%80%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%A8%20%E1%84%80%E1%85%AA%E1%86%AB%E1%84%85%E1%85%B5.png?alt=media&token=06606216-3e4d-4133-94ff-9e9c3ebab40e'
      }
      ],
      contents: `> React와 Express 기반의 **B2B 대상으로 하는 쇼핑몰**입니다. <br/><br/>
      React를 배워가면서 제작한 첫 프로젝트이자 가장 크게 저에게 영향을 줬던 프로젝트입니다.<br/>
      React 전반적인 지식을 적극적으로 공부해 보고 활용해볼 수 있었을 뿐만 아니라 <br/>
      수 많은 리팩토링을 진행하면서 상태관리 라이브러리인 <span style='color: red;'>**React-Query**</span>랑 <span style='color: blue;'>**Zustand**</span>를 접해볼 수 있어서 <br/>
      더 정확하게 라이브러리 훅들의 사용 장점이나 필요성을 익힐 수 있었습니다.`
    },
    {
      title: "학교/기업 통근(셔틀)버스 트래커",
      date: "2024.03 ~ (캡스톤 팀 프로젝트(4명))",
      image: [
      {
        original: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2Funnamed.jpg?alt=media&token=8523f6c6-c39d-4f4c-9944-e6176666fe70',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/myblog-a5efe.appspot.com/o/images%2Funnamed.jpg?alt=media&token=8523f6c6-c39d-4f4c-9944-e6176666fe70'
      }
      ],
      contents: `> React와 JavaSpring 기반의 **앱 기반 셔틀버스 트래커**입니다. <br/><br/>
      2024 교내에서 진행하는 **캡스톤 디자인** 과목에서 진행한 프로젝트입니다.<br/>
      **풀스택** 개발 역할을 맡아 JavaSpring 기초 지식을 공부하고 활용해볼 수 있었을 뿐만 아니라<br/>
      웹 브라우저에서 내에서 한정적으로 생각하는 것이 아닌 **센서와 같은 외측 장비들과** 연동하여 사용하면서<br/>
      **실시간**으로 데이터를 받고 보내고 꾸며내는 경험을 한 것이 좋았습니다.<br/>
      `
    }
  ] 
  function dolist() {
    return (
      <ProjectContainer>
        {projectData.map(item =>
        <ProjectBox
        data-aos="fade-up"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1200"
        >
          <ProjectTitleBox>
            <h3>{item.title}</h3>
            <ProjectDate>{item.date}</ProjectDate>
          </ProjectTitleBox>
          <ProjectImage>
            <ProjectImagePosition>
              <ImageGallery items={item.image}/>
            </ProjectImagePosition>
          </ProjectImage>
          <ProjectContents data-color-mode="light">
          <MDEditor.Markdown
            style={{ padding: 10 }}
            source={item.contents}
          />
          </ProjectContents>
          <ProjectDetail>

          </ProjectDetail>
          <ProjectReadMe>
            READ.ME
          </ProjectReadMe>
          <ProjectReadMe>
            GITHUB
          </ProjectReadMe>
        </ProjectBox>
        )}
      </ProjectContainer>
    );
  }
  return(
    <div
      ref={ref}
      style={{
        paddingBottom: "5em",
        borderBottom: "1px solid lightgray",
        paddingTop: "5em",
      }}
      data-aos="fade-up"
      aos-offset="600"
      aos-easing="ease-in-sine"
      aos-duration="1200"
    >
      <h1 className="effectFont">
        <i class="fas fa-code"></i> Projects
      </h1>
      {dolist()}
    </div>
  )
})

export default Projects;

const ProjectContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  flex-wrap: wrap;
`;

const ProjectBox = styled.li`
  width: 100%;
  box-sizing: border-box;
  border-radius: 2em;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  padding: 2em 3em;
`;

const ProjectTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  padding-bottom: 1em;
`

const ProjectDate = styled.span`
  color: gray;
`

const ProjectImage = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 100%;
box-sizing: border-box;
`

const ProjectImagePosition = styled.div`
  width: 90%;
`


const ProjectContents = styled.div`
  padding: 0.5em 0;
  border-bottom: 1px solid lightgray;
  margin-bottom: 1em;
`

const ProjectDetail = styled.div`
`


const ProjectReadMe = styled.button`
padding: 0.8em 1.5em;
background: var(--button-main-color);
border-radius: 1em;
cursor: pointer;
border: none;
color: white;
font-weight: 750;
transition: background 0.5s;
&:hover {
  background: var(--button-hover-color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
`