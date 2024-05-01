import { useEffect, useState } from "react";
// firestore의 메서드 import
import styled from "styled-components";
import image from "../banner.png";
import useFetch from "../customFn/useFetch";

export function Posts({category, value}){
  const [post, setPost] = useState([]);
  const {data} = useFetch(category, value);
  useEffect(() => {
    if(data)
      setPost(data);
  }, []);
  return(
    <section class="section" data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
        <article class="post" >
          <ul class="post-list">
            {post && post.map((item) => 
              <PostCard>
                <PostImage/>
                <PostContent>
                  <PostCategory>
                    <PostComment>{item.category.study ? item.category.study : item.category.project}</PostComment>
                    <PostComment><i class="fas fa-comments-alt"></i> 0 </PostComment>
                  </PostCategory>
                  <h3>{item.title}</h3>
                  <PostMeta>
                    <span>DEVH</span>|
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </PostMeta>
                </PostContent>
              </PostCard>
            )}
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
  background: url(${image}) no-repeat 50%;
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
`