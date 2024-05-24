import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import ImageGallery from "react-image-gallery";
import MDEditor from "@uiw/react-md-editor";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

const Projects = forwardRef((props, ref) => {
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "projects"));
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
  console.log(data);

  function dolist() {
    return (
      <ProjectContainer>
        {data && data.map((item, key) => (
          <ProjectBox
            key={key}
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
                <ImageGallery items={item.image} />
              </ProjectImagePosition>
            </ProjectImage>
            <ProjectContents data-color-mode="light">
              <MDEditor.Markdown
                style={{ padding: 10 }}
                source={item.contents}
              />
            </ProjectContents>
            <ProjectDetail></ProjectDetail>
            <ProjectReadMe>READ.ME</ProjectReadMe>
            <ProjectReadMe>GITHUB</ProjectReadMe>
          </ProjectBox>
        ))}
      </ProjectContainer>
    );
  }
  return (
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
  );
});

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
`;

const ProjectDate = styled.span`
  color: gray;
`;

const ProjectImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const ProjectImagePosition = styled.div`
  width: 90%;
`;

const ProjectContents = styled.div`
  padding: 0.5em 0;
  border-bottom: 1px solid lightgray;
  margin-bottom: 1em;
`;

const ProjectDetail = styled.div``;

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
`;
