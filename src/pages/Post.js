import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import logoVideo from "../components/Items/logo_background.mp4";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";

export function Post({ isFixed, targetComponentRef }) {
  let {id} = useParams();
  const [data, setData] = useState(null);

  const getDocument = async () => {
    const docRef = doc(db, 'blogging', id);  // 문서 참조 생성
    const docSnap = await getDoc(docRef);    // 문서 조회

    if (docSnap.exists())
      return docSnap.data();  // 문서 데이터 반환
  }

  useEffect(() => {
    const fetchData = async () => {
      const docData = await getDocument();  // 비동기 함수에서 데이터 받기
      setData(docData);  // 상태 설정
    };
    
    fetchData();  // 함수 실행
  }, []);  // 의존성 배열에 id 추가


  function postWriter(){
    return(
      <div className="logo-text">
        <CategoryContainer>
          <CategoryBox>{data?.category.prev} - {data?.category.current}</CategoryBox>
        </CategoryContainer>
        <h1>{data?.title}</h1>
        <MetaContainer>
          <MetaItem>DEVH</MetaItem> 
          <MetaItem>{new Date(data?.date.toDate()).toLocaleString()}</MetaItem>
        </MetaContainer>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="body">
        <Logo 
          isFixed={isFixed} 
          background={logoVideo} 
          writer={postWriter()}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            {data?.contents}
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar />
    </div>
  );
}

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 18px;
  margin-bottom: 1em;
`

const CategoryBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
  border-radius: 3em;
  padding: 0.4em 0.9em;
`

const MetaContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`

const MetaItem = styled.span`
  font-size: 16px;
  &:nth-child(1)::after{
    content: '\t·\t'; 
    margin: 0 8px; /* 좌우 마진을 추가하여 간격 조정 */
  }
`