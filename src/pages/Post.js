import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import logoVideo from "../components/Items/logo_background.mp4";
import { doc, getDoc, collection, setDoc,query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useComment, useCommentActions } from "../store/useCommentStore";
import { update } from "firebase/database";

export function Post({ isFixed, targetComponentRef }) {
  let {id} = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const {author, comment, passwd} = useComment();
  const {setAuthor, setComment, setPasswd, resetCommentInput} = useCommentActions();

  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const docData = await getDocument();  // 비동기 함수에서 데이터 받기
      setData(docData);  // 상태 설정
    };
    
    fetchData();  // 함수 실행
    getComments();
  }, []); 

  const getDocument = async () => {
    const docRef = doc(db, 'blogging', id);  // 문서 참조 생성
    const docSnap = await getDoc(docRef);    // 문서 조회

    if (docSnap.exists())
      return docSnap.data();  // 문서 데이터 반환
  }

  const updateComment = async () => {
    try {
      const requestData = {
        author, comment, passwd,
        createdAt: new Date()
      };
      const commentRef = doc(collection(db, 'blogging', id, 'Comments'));
      await setDoc(commentRef, requestData);
      alert('작성을 완료했습니다!');
    } catch (error) {
      console.log(error);
    } finally {
      resetCommentInput();
      getComments();
    }
  }

  const getComments = async () => {
    const q = query(collection(db, 'blogging', id, 'Comments'), orderBy('createdAt', 'desc'));
  
    try {
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        ...doc.data(),  
        commentId: doc.id  
      }));
      setComments(comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

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
                  <CommentAuthorInputBox><CommentAuthorInput placeholder="이름" value={author} onChange={(e) => setAuthor(e.target.value)}/></CommentAuthorInputBox>
                  <CommentAuthorInputBox><CommentAuthorInput type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} placeholder="비밀번호"/></CommentAuthorInputBox>
                </CommentAuthorBox>
                <CommentBox>
                  <CommentTextarea placeholder="댓글을 작성해주세요!" value={comment} onChange={(e)=> setComment(e.target.value)}/>
                  <CommentSubmitBox>
                    <CommentSubmit onClick={()=>updateComment()}><i class="fas fa-paper-plane"></i></CommentSubmit>
                  </CommentSubmitBox>
                </CommentBox>
              </CommentWriterBox>
              <CommentOtherBox>
                {comments.length > 0 ? comments.map((item,index) => 
                <CommentPersonalBox key={index}>
                  <CommentPersonalAuthor>{item.author}</CommentPersonalAuthor>
                  <CommentPersonalComment>{item.comment}</CommentPersonalComment>
                </CommentPersonalBox>
                )
              :
              <CommentPersonalBox>
                <CommentPersonalComment>새로운 댓글이 없어요 ㅠㅠ</CommentPersonalComment>
              </CommentPersonalBox>
              }
              </CommentOtherBox>
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
box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
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
border-radius: 3em;
padding: 1.5em;
box-sizing: border-box;
background: var(--background-main-color);
box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
`

const CommentOtherBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 100%;
  max-width: 100%;
  min-height: 10vh;
  margin-top: 1em;
  border-radius: 3em;
  padding: 2em;
  background: var(--background-main-color);
  box-sizing: border-box;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
`

const CommentPersonalBox = styled.div`
  display: flex;
  flex-direction:column;
  gap: 0.5em;
  width: 60%;
  min-height: 10vh;
  background: var(--background-input-color);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1em;
  box-sizing: border-box;
  border-radius: 0 1em 1em 1em;
`

const CommentPersonalAuthor = styled.div`
  padding: 0.5em;
  background: var(--background-main-color);
  border-radius: 1em;
`

const CommentPersonalComment = styled.div`
  width: 100%;
  padding: 0.5em;
  background: var(--background-main-color);
  min-height: 10vh;
  border-radius: 1em;
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
border-radius: 0.8em;
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
  border-radius: 1.5em;
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