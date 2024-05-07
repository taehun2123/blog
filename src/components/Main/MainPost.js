import { db } from "../../firebase";
import { useEffect, useState } from "react";
// firestore의 메서드 import
import { collection, getDocs, query } from "firebase/firestore";
import styled from "styled-components";
import image from "../../banner.png";
import { useNavigate } from "react-router-dom";

export function MainPost() {
  const [includeData, setIncludeData] = useState([]);
  const navigate = useNavigate();
  // async - await로 데이터 fetch 대기
  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "blogging"));
      const result = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
        id: doc.id,
      }));
      const newData = await Promise.all(
        result.splice(0, 3)?.map(async (item) => {
          const q = query(collection(db, "blogging", item.id, "Comments"));
          const querySnapshot = await getDocs(q);
          const comments = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            commentId: doc.id,
          }));
          return {
            ...item,
            commentSu: comments.length,
          };
        })
      );
      setIncludeData(newData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
  // 최초 마운트 시에 getTest import
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1
        className="effectFont"
        data-aos="fade-down"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1200"
      >
        <i class="fas fa-pencil-alt"></i> Posts
      </h1>
      <section
        class="section"
        data-aos="fade-up"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1200"
      >
        <article class="post">
          <ul class="post-list">
            {includeData &&
              includeData.map((item) => (
                <PostCard onClick={() => navigate(`/post/${item.id}`)}>
                  <PostImage />
                  <PostContent>
                    <PostCategory>
                      <PostComment>{item.category.current}</PostComment>
                      <PostComment>
                        <i class="fas fa-comments-alt"></i> {item.commentSu}{" "}
                      </PostComment>
                    </PostCategory>
                    <h4>{item.title}</h4>
                    <PostMeta>
                      <span>DEVH</span>|
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </PostMeta>
                  </PostContent>
                </PostCard>
              ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

const PostCard = styled.li`
  min-width: 300px;
  min-height: 400px;
  border-radius: 2em;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  transition: background 0.5s, color 0.5s, box-shadow 0.5s, transform 0.5s;
  cursor: pointer;
  &:hover {
    background: cornflowerblue;
    color: white;
    box-shadow: 3px 5px 6px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-10px);
  }
`;

const PostImage = styled.div`
  display: flex;
  justify-content: center;
  alien-items: center;
  width: 100%;
  height: 270px;
  overflow: hidden;
  border-radius: 2em 2em 0 0;
  background: url(${image}) no-repeat 50%;
  background-size: cover;
  background-color: black;
  object-fit: contain;
`;

const PostContent = styled.div`
  flex: 1;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5em;
  align-items: flex-start;
`;

const PostMeta = styled.div`
  font-size: 11px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1em;
`;

const PostCategory = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  alien-items: center;
`;

const PostComment = styled.div`
  font-size: 12px;
  padding: 0.5em 1em;
  background-color: rgb(219 234 254);
  border-radius: 2em;
  color: var(--font-main-color);
`;
