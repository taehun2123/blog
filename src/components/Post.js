import { db } from "../firebase";
import { useEffect, useState } from "react";
// firestore의 메서드 import
import { doc, getDoc } from "firebase/firestore";
import styled from "styled-components";
import image from "../banner.png";

export function Post(){
  const [test, setTest] = useState();
  // async - await로 데이터 fetch 대기
  async function getTest() {
    // document에 대한 참조 생성
    const docRef = doc(db, "blogging", "bSGeTMHZ4ThkF5PdW3DA");
    // 참조에 대한 Snapshot 쿼리
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTest(docSnap.data());
    }
  }
  // 최초 마운트 시에 getTest import
  useEffect(() => {
    getTest();
  }, []);
  return(
    <section class="section" data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
        <article class="post" >
          <ul class="post-list">
            {test !== undefined && (
              <PostCard>
                <PostImage/>
                <PostContent>
                  <PostMeta>
                    <span>DEVH</span>
                    <span>2024. 4. 25.</span>
                  </PostMeta>
                  <h3>{test.title}</h3>
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
  padding: 1em;
`

const PostMeta = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
  margin: 0.5em 0;
`