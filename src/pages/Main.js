import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BlogHeader } from "../components/BlogHeader";
import MainPost from "../components/Main/MainPost";
import { Sidebar } from "../components/Sidebar";
import { useAdmin } from "../store/useAdmin";

function Main({ isFixed, targetComponentRef }) {
  const isAdmin = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="body">
        <BlogHeader
          isFixed={isFixed}
          writer={["꿈을 이루고 싶은", "한 개발자의 이야기"]}
        />
        <main className="main blog-main" ref={targetComponentRef}>
          <div className="wrapper">
            <MainPost
              headerAction={
                isAdmin && (
                  <WriteButton onClick={() => navigate("/edit")}>
                    <i className="fas fa-pen"></i>
                    글쓰기
                  </WriteButton>
                )
              }
            />
          </div>
        </main>
      </div>
      <Sidebar />
    </div>
  );
}

export default Main;

const WriteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.85em 1.25em;
  background: var(--button-main-color);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(75, 115, 240, 0.24);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    background: var(--button-hover-color);
    box-shadow: 0 14px 28px rgba(75, 115, 240, 0.3);
    transform: translateY(-2px);
  }
`;
