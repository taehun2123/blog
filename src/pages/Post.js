import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import logoVideo from "../components/Items/logo_background.mp4";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
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
  const { setAuthor, setComment, setPasswd, resetCommentInput } =
    useCommentActions();
  const { data: comments } = useCommentFetch(id);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");
  const [handle, setHandle] = useState();
  const [handleIdx, setHandleIdx] = useState(null);
    // 현재 편집 중인 댓글의 인덱스를 저장하는 상태
    const [editingIndex, setEditingIndex] = useState(null);
    // 댓글 내용을 변경하기 위한 상태
    const [editedComment, setEditedComment] = useState("");
  const navigate = useNavigate();

  /**
   * Modal Toggle handler
   * 타입 : "edit", "delete"
   * isAdmin인 경우는 Modal을 무시한다.
   * 작성자가 본인인 경우는 Modal을 무시한다.
   * 작성자가 본인인 것을 확인하는 경로는 다음과 같다.,
   * Comment(여기서는 item 변수)의 passwd가 userData의 uid와 같은 경우
   * 이외에는 모달을 띄워 비밀번호를 확인한다.
   */
  const toggleModal = (item, index, type) => {
    if (isAdmin && type === "edit") {
      changeStateEditDoc(item, index);
      return;
    }
    if (isAdmin && type === "delete") {
      handleDeleteDoc(item);
      return;
    }
    if (item.passwd === userData.uid && type === "edit") {
      changeStateEditDoc(item, index);
      return;
    }
    if (item.passwd === userData.uid && type === "delete") {
      handleDeleteDoc(item);
      return;
    }
    setType(type);
    setHandle(item);
    setHandleIdx(index);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  //로그인이 된 경우(구글 로그인) -> Author과 Passwd를 userData에서 각각 displayName(이름) 과 uid로 지정한다.
  useEffect(() => {
    if (isLoggedin) {
      setAuthor(userData.providerData[0].displayName);
      setPasswd(userData.uid);
    }
  }, [isLoggedin, setAuthor, setPasswd, userData.displayName, userData.providerData, userData.uid]);

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
          <CategoryBox onClick={()=> navigate(`/board/${data?.category.prev}/${data?.category.current}`)}>
            {data?.category.prev} - {data?.category.current}
          </CategoryBox>
        </CategoryContainer>
        <h1>{data?.title}</h1>
        <MetaContainer>
          <MetaItem>DEVH</MetaItem>
          <MetaItem>{new Date(data?.date.toDate()).toLocaleString()}</MetaItem>
        </MetaContainer>
        {isAdmin && (
          <AdminContainer>
            <Button onClick={() => handleEditPost()}>수정</Button>
            <Button onClick={() => handleDeletePost()}>삭제</Button>
          </AdminContainer>
        )}
      </div>
    );
  }

  /**
   * 게시글 수정 함수
   * Params의 id값을 이용하여 수정 정보 불러옴
   */
  function handleEditPost() {
    navigate(`/edit/${id}`);
  }

  /**
   * 게시글 삭제 함수
   * 현재의 Params의 id값으로 삭제함
   */
  async function handleDeletePost() {
    const confirm = window.confirm("정말로 삭제하겠습니까?");

    if (confirm) {
      const desertRef = doc(db, "blogging", id);
      try {
        await deleteDoc(desertRef);
        alert("삭제를 성공적으로 완료하였습니다!");
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * handling한 댓글 삭제 함수
   * Parameter의 item은 해당 댓글에 대한 item임
   */
  async function handleDeleteDoc(item) {
    const confirm = window.confirm("정말로 삭제하겠습니까?");

    if (confirm) {
      const desertRef = doc(db, "blogging", id, "Comments", item.commentId);
      try {
        await deleteDoc(desertRef);
        alert("삭제를 성공적으로 완료하였습니다!");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  function changeStateEditDoc(prevItem, idx) {
    // 편집 모드 진입 함수
      setEditingIndex(idx);
      setEditedComment(prevItem.comment);
  }

  /**
   * 댓글 수정 함수
   * Params의 id값을 이용하여 수정 정보 불러옴
   */
  async function handleEditDoc(item) {
    try {
      await updateDoc(doc(db, "blogging", id, "Comments", item.commentId), {
        comment: editedComment,
        createdAt: new Date(),
      });
      alert("해당 댓글의 수정을 성공적으로 완료하였습니다");
      setEditingIndex(null); // 편집 모드 종료
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={postWriter()} />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            {data != null && (
              <div data-color-mode="light" style={{ padding: 15 }}>
                <MDEditor.Markdown
                  style={{ padding: 10 }}
                  source={data.contents}
                />
              </div>
            )}
            <CommentContainer
              data-aos="fade-up"
              aos-offset="600"
              aos-easing="ease-in-sine"
              aos-duration="1200"
            >
              <CommentScreenContainer>
                <CommentTopbar />
                <CommentPlaceHolderBox>
                  <i
                    style={{ fontSize: "2rem", color: "cornflowerblue" }}
                    class="fas fa-comment-alt-edit"
                  ></i>
                  <h2 className="effectFont">댓글을 작성해주세요!</h2>
                </CommentPlaceHolderBox>
                <CommentWriterBox>
                  <CommentAuthorBox>
                    {isLoggedin ? (
                      <FlexBox>
                        <CommentWriterImg
                          width={30}
                          src={userData.photoURL}
                          alt="프로필"
                        />
                        {userData.providerData[0].displayName}
                      </FlexBox>
                    ) : (
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
                    )}
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
                        {editingIndex === index ? (
                          <>
                            <CommentTextarea
                              value={editedComment}
                              onChange={(e) => setEditedComment(e.target.value)}
                            />
                            <CommentSubmitBox>
                              <CommentSubmit onClick={() => handleEditDoc(item)}>
                                <i class="fas fa-paper-plane"></i>
                              </CommentSubmit>
                            </CommentSubmitBox>
                          </>
                        ) : (
                          <>
                            <CommentPersonalComment>
                              {item.comment}
                            </CommentPersonalComment>
                            <CommentPersonalMeta>
                              <IconBox>
                                <span
                                  style={{
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                  }}
                                  onClick={() => toggleModal(item, index, "edit")}
                                >
                                  수정
                                </span>
                                <span
                                  style={{
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                  }}
                                  onClick={() =>
                                    toggleModal(item, index, "delete")
                                  }
                                >
                                  삭제
                                </span>
                              </IconBox>
                              <div>
                                {new Date(
                                  item.createdAt.toDate()
                                ).toLocaleString()}
                              </div>
                            </CommentPersonalMeta>
                          </>
                        )}
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
                <Modal
                  item={handle}
                  idx={handleIdx}
                  type={type}
                  isOpen={isOpen}
                  onClose={()=>setIsOpen(false)}
                  changeStateEditDoc={changeStateEditDoc}
                  handleDeleteDoc={handleDeleteDoc}
                />
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
  cursor:pointer;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AdminContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0.3em;
  gap: 0.2em;
`;

const MetaItem = styled.span`
  font-size: 16px;
  &:nth-child(1)::after {
    content: "\t·\t";
    margin: 0 8px;
  }
`;

const Button = styled.button`
  padding: 0.5em 1em;
  background: var(--button-main-color);
  border-radius: 1em;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: var(--button-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
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
`;

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
`;

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
  gap: 1em;
`;

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
`;
const IconBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  font-weight: 650;
  font-size: 1em;
`;
