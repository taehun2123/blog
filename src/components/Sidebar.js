import styled from "styled-components";
import { useSidebar } from "../store/useSidebarStore";
import profile from "./Items/profile.jpeg";
import { useState } from "react";
export function Sidebar() {
  const isOpened = useSidebar();

  const Side = styled.aside`
    display: ${isOpened ? "flex" : "none"};
    top: 0;
    right: 0;
    width: 250px;
    height: 100vh;
    position: ${isOpened ? "sticky" : ""};
    background-color: white;
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
    z-index: 999;
    overflow-y: scroll;
    flex-direction: column;
    justify-content: flex-start;
    aliens-item: center;
  `;

  const skills = [
    {
      icon: <i class="fab fa-html5"></i>,
      title: "HTML",
    },
    {
      icon: <i class="fab fa-css3-alt"/>,
      title: "CSS",
    },
    {
      icon: <i class="fab fa-js-square"></i>,
      title: "Java-Script",
    },
    {
      icon: <i class="fab fa-js-square"></i>,
      title: "React",
    },
    {
      icon: <i class="fab fa-js-square"></i>,
      title: "NodeJs",
    },
    {
      icon: <i class="fab fa-js-square"></i>,
      title: "Java",
    },
    {
      icon: <i class="fab fa-js-square"></i>,
      title: "Java-Spring",
    },
  ];


  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState(null);

  const handleCategoryClick = (index) => {
    setExpandedCategoryIndex(index === expandedCategoryIndex ? null : index);
  };

  const renderCategory = (category, index) => {
    const isExpanded = index === expandedCategoryIndex;

    return (
      <div key={category.title}>
        <MenuItem onClick={() => handleCategoryClick(index)}>
          <div style={{display:'flex', alignItems:'center', gap:'1em'}}>{category.icon}{category.title}</div>
          <span><i class="far fa-angle-right"></i></span>
        </MenuItem>
        {isExpanded && (
          <SubCategoryList>
            {category.subCategories.map((subCategory) => (
              <SubCategoryItem key={subCategory.title}>
                <div style={{display:'flex', alignItems:'center', gap:'1em'}}>{category.subIcon}{subCategory.title}</div>
              </SubCategoryItem>
            ))}
          </SubCategoryList>
        )}
      </div>
    );
  };

  const categories = [
    {
      icon: <i class="fab fa-css3-alt"/>,
      subIcon: <i class="fad fa-code"/>,
      title: "Front-End",
      subCategories: [
        {title: "Sub Category 1" },
        {title: "Sub Category 2" },
        {title: "Sub Category 3" },
      ],
    },
    {
      icon: <i className="fab fa-java"/>,
      subIcon: <i class="fad fa-code"/>,
      title: "Back-End",
      subCategories: [
        { title: "Sub Category 4" },
        { title: "Sub Category 5" },
        { title: "Sub Category 6" },
      ],
    },
    {
      icon: <i className="fab fa-node-js"></i>,
      subIcon: <i class="fad fa-code"/>,
      title: "Full-Stack",
      subCategories: [
        { title: "Sub Category 7" },
        { title: "Sub Category 8" },
        { title: "Sub Category 9" },
      ],
    },
  ];


  return (
    <Side>
      <Profile>
        <Image />
        <h4>Dev_hun</h4>
      </Profile>
      <Menu>
        <h3>Project-Menu</h3>
        <MenuList>
          {categories.map(renderCategory)}
        </MenuList>
        <h3>Available Skill</h3>
        <MenuList>
          {skills.map(item => {
            return (
              <MenuItem>
                <div style={{display:'flex', alignItems:'center', gap:'1em'}}>{item.icon}{item.title}</div>
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
    </Side>
  );
}

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
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
`;

const MenuList = styled.ul`
  margin: 1.5em 0;
  padding: 0;
  border-bottom: 2px dotted lightblue;
`;

const MenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  margin-top: 0.2em;
  cursor: pointer;
`;

const SubCategoryList = styled.ul`
  list-style: none;
  transition: all 0.5s ease;
  padding: 0 1rem;
`;

const SubCategoryItem = styled.li`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  position: relative; /* Enable relative positioning */
`;
