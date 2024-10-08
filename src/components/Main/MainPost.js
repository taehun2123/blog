import { db } from "../../firebase";
import { forwardRef, useEffect, useState } from "react";
// firestore의 메서드 import
import { collection, getDocs, query } from "firebase/firestore";
import styled from "styled-components";
import image from "../../banner.png";
import { useNavigate } from "react-router-dom";
import useFetch from "../../customFn/useFetch";

const MainPost = forwardRef((props, ref) => {
  const [includeData, setIncludeData] = useState([]);
  const [listData, setListData] = useState([]);
  const navigate = useNavigate();
  const { data, loading } = useFetch();
  // async - await로 데이터 fetch 대기
  async function fetchData() {
    if (!loading && data.length > 0) {
      try {
        const newData = await Promise.all(
          data?.splice(0, 4)?.map(async (item) => {
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
        const allData = await Promise.all(
          data?.splice(0)?.map(async (item) => {
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
        setListData(allData);
        setIncludeData(newData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  }
  // 최초 마운트 시에 getTest import
  useEffect(() => {
    fetchData();
  }, [loading, data]);

  return (
    <div
      ref={ref}
      style={{
        paddingTop: "5em",
        paddingBottom: "5em",
      }}
    >
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
        className="section"
        data-aos="fade-up"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1200"
      >
        <article className="post">
          <ul className="post-list">
            {includeData &&
              includeData.map((item, key) => (
                <PostCard key={key} onClick={() => navigate(`/post/${item.id}`)}>
                  <PostImage />
                  <PostContent>
                    <PostCategory>
                      <PostComment>{item.category.current}</PostComment>
                      <PostComment>
                        <i class="fas fa-comments-alt"></i> {item.commentSu}{" "}
                      </PostComment>
                    </PostCategory>
                    <PostTitle>{item.title}</PostTitle>
                    <PostMeta>
                      <span>DEVH</span>|
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </PostMeta>
                  </PostContent>
                </PostCard>
              ))}
          </ul>
        </article>
        <article>
          <PostListGroup>
            {listData && listData.map((item, key) => (
              <PostListItem key={key} onClick={() => navigate(`/post/${item.id}`)}>
                <PostListContents>
                  <PostComment>{item.category.current}</PostComment>
                  <PostListTitle>{item.title}</PostListTitle>
                  <PostMeta>
                    <span>DEVH</span>|
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </PostMeta>
                </PostListContents>
              </PostListItem>
            ))}
          </PostListGroup>
        </article>
      </section>
    </div>
  );
})

export default MainPost;

const PostListGroup = styled.ul`
  width: 90vw;
`

const PostListItem = styled.li`
  width: 100%;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  cursor: pointer;
  transition: background 0.5s, color 0.5s, box-shadow 0.5s, transform 0.5s;
    &:hover {
    background: cornflowerblue;
    color: white;
    box-shadow: 3px 5px 6px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-10px);
  }
`

const PostCard = styled.li`
  min-width: 330px;
  max-width: 330px;
  max-height: 400px;
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

const PostListContents = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: row;
  gap: 1.5em;
  align-items: center;
  justify-content: flex-start;
`;

const PostMeta = styled.div`
  flex:2;
  width:100%;
  font-size: 11px;
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

const PostTitle = styled.h4`
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space : nowrap;
`;

const PostListTitle = styled.h4`
  flex: 1;
  width: 100%;
  font-size: 12px;
  white-space : nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;