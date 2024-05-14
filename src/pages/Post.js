import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import logoVideo from "../components/Items/logo_background.mp4";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useComment, useCommentActions } from "../store/useCommentStore";
import useCommentFetch from "../customFn/useCommentFetch";
import { useLogin, useUserData } from "../store/useIsLogin";
import { useAdmin } from "../store/useAdmin";
import Modal from "../components/Modal";
import MDEditor from "@uiw/react-md-editor";

export function Post({ isFixed, targetComponentRef }) {
  // -------------- 상태 관리 선언 변수 & Zustand -------------
  let { id } = useParams();
  const isLoggedin = useLogin();
  const userData = useUserData();
  const isAdmin = useAdmin();
  const [data, setData] = useState(null);
  const { author, comment, passwd } = useComment();
  const { setAuthor, setComment, setPasswd, resetCommentInput } = useCommentActions();
  const { data: comments } = useCommentFetch(id);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");

  /** 
   * Modal Toggle handler
   * 타입 : "edit", "delete"
   * isAdmin인 경우는 Modal을 무시한다.
   * 작성자가 본인인 경우는 Modal을 무시한다.
   * 작성자가 본인인 것을 확인하는 경로는 다음과 같다.,
   * Comment(여기서는 item 변수)의 passwd가 userData의 uid와 같은 경우
   * 이외에는 모달을 띄워 비밀번호를 확인한다.
   */
  const toggleModal = (item, type) => {
    if(isAdmin && type === "edit"){
      handleEditDoc(item);
      return;
    }
    if(isAdmin && type === "delete"){
      handleDeleteDoc(item);
      return;
    }
    if(item.passwd === userData.uid && type === "edit"){
      handleEditDoc(item);
      return;
    }
    if(item.passwd === userData.uid && type === "delete"){
      handleDeleteDoc(item);
      return;
    }
    setType(type);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  //로그인이 된 경우(구글 로그인) -> Author과 Passwd를 userData에서 각각 displayName(이름) 과 uid로 지정한다.
  useEffect(() => {
    if(isLoggedin){
      setAuthor(userData.displayName);
      setPasswd(userData.uid);
    }
  }, [isLoggedin, setAuthor, setPasswd, userData.displayName, userData.uid])

  // id가 불러지면 id에 해당하는 blogging 컬렉션의 문서를 받아옴
  useEffect(() => {
    const fetchData = async () => {
      const docData = await getDocument(); // 비동기 함수에서 데이터 받기
      setData(docData); // 상태 설정
    };
  
    fetchData();
  }, [id]); 

  const getDocument = async () => {
    const docRef = doc(db, "blogging", id); // 문서 참조 생성
    const docSnap = await getDoc(docRef); // 문서 조회

    if (docSnap.exists()) return docSnap.data(); // 문서 데이터 반환
  };

  const updateComment = async () => {
    try {
      const requestData = {
        author,
        comment,
        passwd,
        createdAt: new Date(),
      };
      const commentRef = doc(collection(db, "blogging", id, "Comments"));
      await setDoc(commentRef, requestData);
      alert("작성을 완료했습니다!");
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      resetCommentInput();
    }
  };

  function postWriter() {
    return (
      <div className="logo-text">
        <CategoryContainer>
          <CategoryBox>
            {data?.category.prev} - {data?.category.current}
          </CategoryBox>
        </CategoryContainer>
        <h1>{data?.title}</h1>
        <MetaContainer>
          <MetaItem>DEVH</MetaItem>
          <MetaItem>{new Date(data?.date.toDate()).toLocaleString()}</MetaItem>
        </MetaContainer>
      </div>
    );
  }

  async function handleDeleteDoc(item){
    const confirm = window.confirm('정말로 삭제하겠습니까?');

    if (confirm) {
      const desertRef = doc(db, 'blogging', id, 'Comments', item.commentId);
      try {
        await deleteDoc(desertRef);
        alert("삭제를 성공적으로 완료하였습니다!");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleEditDoc(item){

  }
  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={postWriter()} />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            {data != null &&
            <div data-color-mode="light" style={{padding:15}}>
              <MDEditor.Markdown
              style={{ padding: 10 }}
              source={data.contents}
              />
            </div>
            }
            <CommentContainer data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
              <CommentScreenContainer>
                <CommentTopbar/>
                <CommentPlaceHolderBox>
                  <i
                    style={{ fontSize: "2rem", color: "cornflowerblue" }}
                    class="fas fa-comment-alt-edit"
                  ></i>
                  <h2 className="effectFont">댓글을 작성해주세요!</h2>
                </CommentPlaceHolderBox>
                <CommentWriterBox>
                  <CommentAuthorBox>
                    {isLoggedin ?
                  <FlexBox>
                    <CommentWriterImg width={30} src={userData.photoURL} alt="프로필"/>{userData.displayName}
                  </FlexBox>
                  :
                  <>
                  <CommentAuthorInputBox>
                  <CommentAuthorInput
                    placeholder="이름"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </CommentAuthorInputBox>
                <CommentAuthorInputBox>
                  <CommentAuthorInput
                    type="password"
                    value={passwd}
                    onChange={(e) => setPasswd(e.target.value)}
                    placeholder="비밀번호"
                  />
                </CommentAuthorInputBox>
                </>
                  }

                  </CommentAuthorBox>
                  <CommentBox>
                    <CommentTextarea
                      placeholder="댓글을 작성해주세요!"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <CommentSubmitBox>
                      <CommentSubmit onClick={() => updateComment()}>
                        <i class="fas fa-paper-plane"></i>
                      </CommentSubmit>
                    </CommentSubmitBox>
                  </CommentBox>
                </CommentWriterBox>
                <CommentOtherBox>
                  {comments.length > 0 ? (
                    comments.map((item, index) => (
                      <CommentPersonalBox key={index}>
                        <CommentPersonalAuthor>
                          {item.author}
                        </CommentPersonalAuthor>
                        <CommentPersonalComment>
                          {item.comment}
                        </CommentPersonalComment>
                        <CommentPersonalMeta>
                          <IconBox>
                            <span style={{cursor:'pointer'}} onClick={()=>toggleModal(item, "edit")}>
                              수정
                            </span>
                            <span style={{cursor:'pointer'}} onClick={()=>toggleModal(item, "delete")}>
                              삭제
                            </span>
                          </IconBox>
                          <Modal type={type} isOpen={isOpen} onClose={toggleModal} />
                          <div>
                            {new Date(item.createdAt.toDate()).toLocaleString()}
                          </div>
                        </CommentPersonalMeta>
                      </CommentPersonalBox>
                    ))
                  ) : (
                    <CommentPersonalBox>
                      <CommentPersonalComment>
                        새로운 댓글이 없어요 ㅠㅠ
                      </CommentPersonalComment>
                    </CommentPersonalBox>
                  )}
                </CommentOtherBox>
              </CommentScreenContainer>
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
`;

const CategoryBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
  border-radius: 3em;
  padding: 0.4em 0.9em;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MetaItem = styled.span`
  font-size: 16px;
  &:nth-child(1)::after {
    content: "\t·\t";
    margin: 0 8px;
  }
`;

const CommentContainer = styled.div`
  width: 100%;
  border-radius: 8em;
  background: black;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  min-height: 120vh;
  padding: 2em;
  box-sizing: border-box;
  margin-top: 20vh;
`;

const CommentScreenContainer = styled.div`
  width: 100%;
  min-height: 120vh;
  box-sizing: border-box;
  background: white;
  border-radius: 6em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5%;
`;

const CommentTopbar = styled.div`
  width: 25%;
  background: black;
  height: 5vh;
  border-radius: 3em;
  margin: -4% auto 4% auto;
`

const CommentPlaceHolderBox = styled.div`
  display: flex;
  gap: 1em;
  box-sizing: border-box;
  align-items: center;
  white-space: wrap;
  word-wrap: break;
`;

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
  background: var(--background-sub-color);
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
`;

const CommentWriterImg = styled.img`
  border-radius: 50%;
  border: 2px solid lightgray;
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
  background: var(--background-sub-color);
  box-sizing: border-box;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
`;

const CommentPersonalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: auto;
  min-height: 10vh;
  background: var(--background-main-color);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1em;
  box-sizing: border-box;
  border-radius: 0 1em 1em 1em;
`;

const CommentPersonalAuthor = styled.div`
  padding: 0.5em;
  background: var(--site-sub-color);
  border-radius: 1em;
  color: white;
  font-weight: 650;
`;

const CommentPersonalComment = styled.div`
  width: 100%;
  padding: 0.5em;
  background: var(--background-main-color);
  min-height: 10vh;
  border-radius: 1em;
  box-sizing: border-box;
`;

const CommentPersonalMeta = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
align-items: center;
min-height: 1vh;
padding: 1em;
border-radius: 0 0 1em 1em;
font-size: 12px;
background: var(--site-main-color);
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
`;

const CommentAuthorInputBox = styled.div`
  border-radius: 0.8em;
  width: 100%;
  max-width: 49.5%;
  background: var(--background-main-color);
  height: 2em;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentAuthorInput = styled.input`
  width: 90%;
  border: none;
  background: none;
  &:focus {
    outline: none;
  }
`;

const CommentBox = styled.div`
  flex: 1;
  width: 100%;
  padding: 1em;
  border-radius: 1.5em;
  background: var(--background-main-color);
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CommentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  border: none;
  background: none;
  resize: none;
  overflow-y: auto;
  &:focus {
    outline: none;
  }
`;

const CommentSubmitBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 1em 0 0 0;
`;

const CommentSubmit = styled.div`
  display: flex;
  justify-content: center;
  width: 30px;
  border-radius: 2em;
  padding: 0.5em;
  background: var(--background-main-color);
  cursor: pointer;
  color: var(--font-main-color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const FlexBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 0.3em;
font-weight: 650;
`
const IconBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 1em;
font-weight: 650;
font-size: 1em;
`
