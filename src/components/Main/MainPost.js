import { db } from "../../firebase";
import { forwardRef, useCallback, useEffect, useState } from "react";
// firestore의 메서드 import
import { collection, getDocs, query } from "firebase/firestore";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useFetch from "../../customFn/useFetch";
import planetFallback from "../../assets/planet-fallback.png";

const MainPost = forwardRef(({ headerAction }, ref) => {
  const [includeData, setIncludeData] = useState([]);
  const [listData, setListData] = useState([]);
  const navigate = useNavigate();
  const { data, loading } = useFetch();

  const extractImageFromMarkdown = (markdown) => {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = imageRegex.exec(markdown);
    return match ? match[1] : null;  // 이미지 URL 반환
  };

  // async - await로 데이터 fetch 대기
  const fetchData = useCallback(async () => {
    if (!loading && data.length > 0) {
      try {
        const newData = await Promise.all(
          data?.slice(0, 4)?.map(async (item) => {
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
          data?.slice(4)?.map(async (item) => {
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
    } else if (!loading) {
      setListData([]);
      setIncludeData([]);
    }
  }, [data, loading]);
  // 최초 마운트 시에 getTest import
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      ref={ref}
      style={{
        paddingTop: "5em",
        paddingBottom: "5em",
      }}
    >
      <PostHeader>
        <h1 className="effectFont">
          <i className="fas fa-pencil-alt"></i> Posts
        </h1>
        {headerAction}
      </PostHeader>
      <section className="section">
        {loading && <EmptyMessage>게시글을 불러오는 중입니다.</EmptyMessage>}
        {!loading && includeData.length === 0 && listData.length === 0 && (
          <EmptyMessage>아직 작성된 게시글이 없습니다.</EmptyMessage>
        )}
        <article className="post">
          <ul className="post-list">
            {includeData &&
              includeData.map((item, key) => {
                const imageUrl = extractImageFromMarkdown(item.contents); // 이미지 URL 추출
                return(
                <PostCard key={key} onClick={() => navigate(`/post/${item.id}`)}>
                  <PostImage $image={imageUrl} />
                  <PostContent>
                    <PostCategory>
                      <PostComment>{item.category.current}</PostComment>
                      <PostComment>
                        <i className="fas fa-comments-alt"></i> {item.commentSu}{" "}
                      </PostComment>
                    </PostCategory>
                    <PostTitle>{item.title}</PostTitle>
                    <PostMeta>
                      <span>DEVH</span>|
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </PostMeta>
                  </PostContent>
                </PostCard>
              )})}
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

const PostHeader = styled.div`
  width: 90vw;
  max-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  margin-bottom: 0.5em;

  h1 {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const PostListGroup = styled.ul`
  width: 90vw;
  max-width: 1100px;
  margin-top: 2em;
`

const PostListItem = styled.li`
  width: 100%;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.24);
  border-radius: 1em;
  cursor: pointer;
  transition: background 0.5s, color 0.5s, box-shadow 0.5s, transform 0.5s;
    &:hover {
    background: rgba(37, 99, 235, 0.82);
    color: white;
    box-shadow: 0 24px 50px rgba(37, 99, 235, 0.22);
    transform: translateY(-10px);
  }
`

const PostCard = styled.li`
  min-width: 330px;
  max-width: 330px;
  max-height: 400px;
  min-height: 400px;
  border-radius: 2em;
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.28);
  transition: background 0.5s, color 0.5s, box-shadow 0.5s, transform 0.5s;
  cursor: pointer;
  &:hover {
    background: rgba(37, 99, 235, 0.82);
    color: white;
    box-shadow: 0 24px 50px rgba(37, 99, 235, 0.22);
    transform: translateY(-10px);
  }
`;

const EmptyMessage = styled.p`
  width: 100%;
  padding: 3em 1em;
  box-sizing: border-box;
  text-align: center;
  color: #cbd5e1;
`;

const PostImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 270px;
  overflow: hidden;
  border-radius: 2em 2em 0 0;
  background: ${({ $image }) => `url(${$image || planetFallback}) no-repeat 50%`};
  background-size: cover;
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
  background: rgba(59, 130, 246, 0.16);
  border: 1px solid rgba(147, 197, 253, 0.22);
  border-radius: 2em;
  color: #bfdbfe;
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
