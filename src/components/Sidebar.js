import styled from "styled-components";
import { useSidebar } from "../store/useSidebarStore";
import profile from "./Items/profile.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function Sidebar() {
  const isOpened = useSidebar();
  const navigate = useNavigate();
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
      icon: <i class="fab fa-react"></i>,
      title: "React",
    },
    {
      icon: <i class="fab fa-node"></i>,
      title: "ExpressJS",
    },
    {
      icon: <i class="fab fa-java"></i>,
      title: "Java",
    },
    {
      icon: <i class="fab fa-node-js"></i>,
      title: "Java-Spring",
    },
  ];
  const categories = [
    {
      icon: <i class="fab fa-css3-alt"/>,
      subIcon: <i class="fas fa-code"></i>,
      title: "Front-End",
      subCategories: [
        {title: "Sub Category 1" },
        {title: "Sub Category 2" },
        {title: "Sub Category 3" },
      ],
    },
    {
      icon: <i className="fab fa-java"/>,
      subIcon:<i class="fas fa-code"></i>,
      title: "Back-End",
      subCategories: [
        { title: "Sub Category 4" },
        { title: "Sub Category 5" },
        { title: "Sub Category 6" },
      ],
    },
    {
      icon: <i className="fab fa-node-js"></i>,
      subIcon: <i class="fas fa-code"></i>,
      title: "Full-Stack",
      subCategories: [
        { title: "Sub Category 7" },
        { title: "Sub Category 8" },
        { title: "Sub Category 9" },
      ],
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
        <MenuItem style={{background: isExpanded ? 'rgb(240, 240, 255)' : 'none', color: isExpanded ? 'var(--font-main-color)' : 'none'}} onClick={() => handleCategoryClick(index)}>
          <div style={{display:'flex', alignItems:'center', gap:'1em'}}><Icon>{category.icon}</Icon>{category.title}</div>
          <span><i class={`far fa-angle-${index === expandedCategoryIndex ? 'down' : 'right'}`}></i></span>
        </MenuItem>
        {isExpanded && (
          <SubCategoryList>
            {category.subCategories.map((subCategory) => (
              <SubCategoryItem key={subCategory.title}>
                <div style={{display:'flex', alignItems:'center', gap:'1em'}}><SubIcon>{category.subIcon}</SubIcon>{subCategory.title}</div>
              </SubCategoryItem>
            ))}
          </SubCategoryList>
        )}
      </div>
    );
  };

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
              <MenuItem onClick={()=> navigate(`/board/${item.title}`)}>
                <div style={{display:'flex', alignItems:'center', gap:'1em'}}><Icon>{item.icon}</Icon>{item.title}</div>
                <span><i class="far fa-angle-right"></i></span>
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
    </Side>
  );
}

// Styled Components Source

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
  border-radius: 0.5em;
  &:hover{
    color: cornflowerblue;
  }

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
  position: relative;
  &:hover{
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
`

const SubIcon = styled.span`
${SubCategoryItem}:hover & {
  background: linear-gradient(-45deg, cornflowerblue, #23a6d5, #23d5ab);
  background-clip: text;
  animation: swing 0.5s ease-out;
  -webkit-text-fill-color: transparent;
}
`
