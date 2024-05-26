import styled from "styled-components";
import { useSidebar, useSidebarActions } from "../store/useSidebarStore";
import profile from "./Items/profile.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../customFn/useFetch";

export function Sidebar() {
  const isOpened = useSidebar();
  const {setClosed} = useSidebarActions();
  const navigate = useNavigate();

  const { data: frontData } = useFetch("category.prev", "FrontEnd");
  const { data: backData } = useFetch("category.prev", "BackEnd");
  const { data: projData } = useFetch("category.prev", "Project");
  const { data: verData } = useFetch("category.prev", "Version");
  const categories = [
    {
      icon: <i className="fab fa-css3-alt" />,
      subIcon: <i className="fas fa-code"></i>,
      title: "Front-End",
      subCategories: frontData,
    },
    {
      icon: <i className="fab fa-java" />,
      subIcon: <i className="fas fa-code"></i>,
      title: "Back-End",
      subCategories: backData,
    },
    {
      icon: <i className="fas fa-code-branch"></i>,
      subIcon: <i className="fas fa-code"></i>,
      title: "Projects",
      subCategories: projData,
    },
    {
      icon: <i className="fab fa-git"></i>,
      subIcon: <i className="fas fa-code"></i>,
      title: "Version-Control",
      subCategories: verData,
    },
  ];

  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState(null);

  const handleCategoryClick = (index) => {
    setExpandedCategoryIndex(index === expandedCategoryIndex ? null : index);
  };

  const renderCategory = (category, index) => {
    const isExpanded = index === expandedCategoryIndex;

    return (
      <div key={index}>
        <MenuItem
          style={{
            background: isExpanded && "rgb(240, 240, 255)",
            color: isExpanded && "var(--font-main-color)",
          }}
          onClick={() => handleCategoryClick(index)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <Icon>{category.icon}</Icon>
            {category.title}
          </div>
          <span>
            <i
              className={`far fa-angle-${
                index === expandedCategoryIndex ? "down" : "right"
              }`}
            ></i>
          </span>
        </MenuItem>

        <SubCategoryList
          isExpanded={isExpanded}
          su={category.subCategories.length}
        >
          {category.subCategories.length > 0 ? (
            category.subCategories.map((subCategory, index) => (
              <SubCategoryItem
                key={index}
                onClick={() => {
                  navigate(
                    `/board/${subCategory.category.prev}/${subCategory.category.current}`
                  )
                  setClosed();
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1em",
                  }}
                >
                  <SubIcon>{category.subIcon}</SubIcon>
                  {subCategory.category.current}
                </div>
              </SubCategoryItem>
            ))
          ) : (
            <SubCategoryItem key={index}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1em" }}
              >
                <ErrIcon>
                  <i className="fas fa-exclamation-triangle"></i>
                </ErrIcon>
                비어있음!
              </div>
            </SubCategoryItem>
          )}
        </SubCategoryList>
      </div>
    );
  };

  return (
    <Side isOpened={isOpened}>
      <CloseWindow>
        <CloseButton onClick={()=>setClosed()} className="fas fa-times"/>
      </CloseWindow>
      <Profile>
        <Image />
        <h4>Dev_hun</h4>
      </Profile>
      <Menu>
        <h4 className="effectFont">About Me</h4>
        <MenuList>
          <MenuItem>
            <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
              <Icon>
                <i class="fas fa-file-user"></i>
              </Icon>
              View Resume
            </div>
            <span>
              <i className="far fa-angle-right"></i>
            </span>
          </MenuItem>
          <MenuItem>
            <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
              <Icon>
                <i class="fas fa-file-chart-line"></i>
              </Icon>
              View Project
            </div>
            <span>
              <i className="far fa-angle-right"></i>
            </span>
          </MenuItem>
        </MenuList>
        <h4 className="effectFont">Stack-Blog</h4>
        <MenuList>{categories.map(renderCategory)}</MenuList>
      </Menu>
    </Side>
  );
}

// Styled Components Source
const Side = styled.aside`
  display: ${(props) => (props.isOpened ? "flex" : "none")};
  top: 0;
  right: 0;
  min-width: 250px;
  height: 100vh;
  position: ${(props) => (props.isOpened && "sticky")};
  background-color: white;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: scroll;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  @media (max-width: 720px) {
    min-width: 100vw;
    min-height: 100vh;
    position: fixed;
  }
`;

const CloseWindow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 0.5em 1em;
`

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  padding: 2em 0;
  border-bottom: 2px dotted lightblue;
  gap: 0.5em;
`;

const Image = styled.div`
  border-radius: 1em;
  border: 3px solid lightblue;
  width: 100px;
  height: 100px;
  background: url(${profile});
  background-size: contain;
`;

const Menu = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const MenuList = styled.ul`
  padding-bottom: 1em;
  border-bottom: 2px dotted lightblue;
`;

const MenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  margin-top: 0.2em;
  cursor: pointer;
  border-radius: 0.5em;
  &:hover {
    color: cornflowerblue;
  }
`;

const SubCategoryList = styled.ul`
  list-style: none;
  transition: all 0.3s;
  padding: 0 1rem;
  overflow: hidden;
  ${(props) =>
    props.isExpanded
      ? `
  height: ${props.su ? props.su * 50 : 50}px ;
  opacity: 1;
  padding: 0.2rem 1rem;
  `
      : `
  height : 0;
  opacity: 0;
  `}
`;

const SubCategoryItem = styled.li`
  cursor: pointer;
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  &:hover {
    background: linear-gradient(-45deg, cornflowerblue, #23a6d5, #23d5ab);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Icon = styled.span`
  ${MenuItem}:hover & {
    background: linear-gradient(-45deg, cornflowerblue, #23a6d5, #23d5ab);
    background-clip: text;
    animation: swing 0.5s ease-out;
    -webkit-text-fill-color: transparent;
  }
`;

const SubIcon = styled.span`
  ${SubCategoryItem}:hover & {
    background: linear-gradient(-45deg, cornflowerblue, #23a6d5, #23d5ab);
    background-clip: text;
    animation: swing 0.5s ease-out;
    -webkit-text-fill-color: transparent;
  }
`;

const ErrIcon = styled.span`
  ${SubCategoryItem}:hover & {
    background: linear-gradient(-45deg, #ee7752, #e73c7e);
    background-clip: text;
    animation: swing 0.5s ease-out;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.i`
  cursor: pointer;
  font-size: 1.5em;
  &:hover{
    color: red;
  }
`
