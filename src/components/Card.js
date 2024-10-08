import { useEffect, useState } from "react";
// firestore의 메서드 import
import styled from "styled-components";
import defaultImage from "../banner.png";
import useFetch from "../customFn/useFetch";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function Card({category, value}){
  const {data} = useFetch(category, value);
  const [includeData, setIncludeData] = useState([]);

  const extractImageFromMarkdown = (markdown) => {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = imageRegex.exec(markdown);
    return match ? match[1] : null;  // 이미지 URL 반환
  };

  useEffect(() => {
    const fetchData = async () => {
      const newData = await Promise.all(data?.map(async (item) => {
          const q = query(collection(db, 'blogging', item.id, 'Comments'));
          const querySnapshot = await getDocs(q);
          const comments = querySnapshot.docs.map((doc) => ({
            ...doc.data(),  
            commentId: doc.id  
          }));
        return {
          ...item,
          commentSu: comments.length
        };
      }));
      setIncludeData(newData);
    };

    fetchData();
  }, [data]);

  const navigate = useNavigate();
  
  return(
    <section class="section" data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
        <article class="post" >
          <ul class="post-list">
          {includeData &&
              includeData.map((item, key) => {
                const imageUrl = extractImageFromMarkdown(item.contents); // 이미지 URL 추출
                return(
                <PostCard key={key} onClick={() => navigate(`/post/${item.id}`)}>
                  <PostImage image={imageUrl} />
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
              )})}
          </ul>
        </article>
      </section>
  )
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
`

const PostImage = styled.div`
  display: flex;
  justify-content: center;
  alien-items: center;
  width: 100%;
  height: 270px;
  overflow: hidden;
  border-radius: 2em 2em 0 0;
  background: ${({ image }) => image ? `url(${image}) no-repeat 50%` : `url(${defaultImage}) no-repeat 50%`};
  background-size: cover;
  background-color: black;
  object-fit: contain;
`

const PostContent = styled.div`
  flex: 1;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5em;
  align-items: flex-start;
`

const PostMeta = styled.div`
  font-size: 11px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1em;
`

const PostCategory = styled.div`
width:100%;
display: flex;
flex-direction: row;
justify-content: space-between;
alien-items: center;
`

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