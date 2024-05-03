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
            <ContentContainer>
              {data?.contents}
            </ContentContainer>
            <CommentContainer>
              <CommentPlaceHolderBox>
                <i style={{fontSize: '3em'}} class="fas fa-comment-alt-edit effectFont"></i>
                <h2 className="effectFont">댓글을 작성해주세요!</h2>
              </CommentPlaceHolderBox>
              <CommentWriterBox>
                <CommentAuthorBox>
                  <CommentAuthorInputBox><CommentAuthorInput placeholder="이름"/></CommentAuthorInputBox>
                  <CommentAuthorInputBox><CommentAuthorInput type="password" placeholder="비밀번호"/></CommentAuthorInputBox>
                </CommentAuthorBox>
                <CommentBox>
                  <CommentTextarea placeholder="댓글을 작성해주세요!"/>
                  <CommentSubmitBox>
                    <CommentSubmit><i class="fas fa-paper-plane"></i></CommentSubmit>
                  </CommentSubmitBox>
                </CommentBox>
              </CommentWriterBox>
            </CommentContainer>
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

const ContentContainer = styled.div`
width: 100%;
min-height: 50vh;
box-sizing: border-box;
`

const CommentContainer = styled.div`
width: 100%;
border-radius: 5em 5em 0 0;
background: var(--background-sub-color);
min-height: 50vh;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
padding: 3em;
box-sizing: border-box;
`

const CommentPlaceHolderBox = styled.div`
  display: flex;
  gap: 1em;
`

const CommentWriterBox = styled.div`
display: flex;
flex-direction: column;
gap: 0.5em;
width: 100%;
max-width: 100%;
min-height: 30vh;
margin-top: 1em;
background: white;
border-radius: 3em;
padding: 1em;
box-sizing: border-box;
`

const CommentAuthorBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  box-sizing: border-box;
`

const CommentAuthorInputBox = styled.div`
border-radius: 2em;
width: 100%;
max-width: 49.5%;
background: var(--background-input-color);
height: 2em;
position: relative;
box-sizing: border-box;
display: flex;
justify-content: center;
align-items:center;
`

const CommentAuthorInput = styled.input`
width: 90%;
border: none;
background: none;
&:focus{
  outline: none;
}
`

const CommentBox = styled.div`
  flex: 1;
  width: 100%;
  padding: 1em;
  border-radius: 2em 2em;
  background: var(--background-input-color);
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const CommentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  border: none;
  background: none;
  resize: none;
  overflow-Y: auto;
  &:focus{
    outline: none;
  }
`

const CommentSubmitBox = styled.div`
display: flex;
justify-content: flex-end;
align-items: center;
width: 100%;
box-sizing: border-box;
padding: 1em 0 0 0;
`

const CommentSubmit = styled.div`
display: flex;
justify-content: center;
width: 30px;
border-radius: 2em;
padding: 0.5em;
background: white;
cursor:pointer;
`