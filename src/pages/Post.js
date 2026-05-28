import { useNavigate, useParams } from "react-router-dom";
import { BlogHeader } from "../components/BlogHeader";
import { Sidebar } from "../components/Sidebar";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useComment, useCommentActions } from "../store/useCommentStore";
import useCommentFetch from "../customFn/useCommentFetch";
import { useLogin, useUserData } from "../store/useIsLogin";
import { useAdmin } from "../store/useAdmin";
import Modal from "../components/Modal";
import MDEditor from "@uiw/react-md-editor";

const formatPhoneTime = () =>
  new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const getCommentBatteryStatus = (commentCount) => {
  const percent = Math.min(commentCount * 12, 100);

  if (commentCount === 0) {
    return {
      percent: 0,
      fill: "linear-gradient(90deg, #ef4444, #fb7185)",
      glow: "rgba(248, 113, 113, 0.42)",
      textColor: "#fecaca",
    };
  }

  if (percent < 30) {
    return {
      percent,
      fill: "linear-gradient(90deg, #f97316, #facc15)",
      glow: "rgba(251, 191, 36, 0.34)",
      textColor: "#fff7ed",
    };
  }

  if (percent < 70) {
    return {
      percent,
      fill: "linear-gradient(90deg, #22d3ee, #60a5fa)",
      glow: "rgba(96, 165, 250, 0.34)",
      textColor: "#ecfeff",
    };
  }

  return {
    percent,
    fill: "linear-gradient(90deg, #34d399, #67e8f9)",
    glow: "rgba(45, 212, 191, 0.34)",
    textColor: "#ecfdf5",
  };
};

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
  const contentsRef = useRef(null);
  const [headingMarkers, setHeadingMarkers] = useState([]);
  const [phoneTime, setPhoneTime] = useState(formatPhoneTime);
  const navigate = useNavigate();
  const commentCount = comments.length;
  const batteryStatus = getCommentBatteryStatus(commentCount);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhoneTime(formatPhoneTime());
    }, 30000);

    return () => window.clearInterval(timer);
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

  const updateHeadingMarkers = useCallback(() => {
    const contentsElement = contentsRef.current;
    if (!contentsElement) {
      setHeadingMarkers([]);
      return;
    }

    const headings = Array.from(contentsElement.querySelectorAll("h1, h2, h3"));
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      setHeadingMarkers([]);
      return;
    }

    setHeadingMarkers(
      headings.map((heading, index) => {
        heading.dataset.postHeadingIndex = String(index);
        const top = heading.getBoundingClientRect().top + window.scrollY;
        const position = Math.min(Math.max((top / scrollableHeight) * 100, 0), 100);

        return {
          index,
          level: heading.tagName.toLowerCase(),
          position,
          title: heading.textContent?.trim() || "제목",
        };
      })
    );
  }, []);

  useEffect(() => {
    if (!data) return;

    const firstFrame = window.requestAnimationFrame(updateHeadingMarkers);
    const imageDelay = window.setTimeout(updateHeadingMarkers, 800);

    window.addEventListener("resize", updateHeadingMarkers);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(imageDelay);
      window.removeEventListener("resize", updateHeadingMarkers);
    };
  }, [data, updateHeadingMarkers]);

  const handleHeadingMarkerClick = (index) => {
    contentsRef.current
      ?.querySelector(`[data-post-heading-index="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      {headingMarkers.length > 0 && (
        <HeadingMarkerGroup>
          {headingMarkers.map((heading) => (
            <HeadingMarker
              key={heading.index}
              $level={heading.level}
              $position={heading.position}
              title={heading.title}
              data-title={heading.title}
              aria-label={`${heading.title}로 이동`}
              onClick={() => handleHeadingMarkerClick(heading.index)}
            />
          ))}
        </HeadingMarkerGroup>
      )}
      <div className="body">
        <BlogHeader
          isFixed={isFixed}
          eyebrow={data ? `${data.category.prev} - ${data.category.current}` : "DEVH POST"}
          writer={[data?.title || "게시글을 불러오는 중입니다"]}
        >
          {data && (
            <>
              <CategoryContainer>
                <CategoryBox onClick={() => navigate(`/board/${data.category.prev}/${data.category.current}`)}>
                  {data.category.prev} - {data.category.current}
                </CategoryBox>
              </CategoryContainer>
              <MetaContainer>
                <MetaItem>DEVH</MetaItem>
                <MetaItem>{new Date(data.date.toDate()).toLocaleString()}</MetaItem>
              </MetaContainer>
              {isAdmin && (
                <AdminContainer>
                  <Button onClick={() => handleEditPost()}>수정</Button>
                  <Button onClick={() => handleDeletePost()}>삭제</Button>
                </AdminContainer>
              )}
            </>
          )}
        </BlogHeader>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            {data != null && (
              <PostBody ref={contentsRef} data-color-mode="dark">
                <MDEditor.Markdown
                  source={data.contents}
                />
              </PostBody>
            )}
            <CommentContainer
              data-aos="fade-up"
              aos-offset="600"
              aos-easing="ease-in-sine"
              aos-duration="1200"
            >
              <PhoneStatusBar>
                <PhoneTime>{phoneTime}</PhoneTime>
                <PhoneIsland aria-hidden="true">
                  <PhoneCamera />
                </PhoneIsland>
                <PhoneBattery
                  aria-label={`댓글 ${commentCount}개`}
                  $percent={batteryStatus.percent}
                  $fill={batteryStatus.fill}
                  $glow={batteryStatus.glow}
                  $textColor={batteryStatus.textColor}
                >
                  <BatteryCount>{commentCount}</BatteryCount>
                </PhoneBattery>
              </PhoneStatusBar>
              <CommentScreenContainer>
                <CommentTopbar>
                  <span>DEVH Talk</span>
                  <small>{comments.length} comments</small>
                </CommentTopbar>
                <CommentPlaceHolderBox>
                  <i
                    style={{ fontSize: "1.35rem", color: "#93c5fd" }}
                    className="fas fa-comment-alt-edit"
                  ></i>
                  <h2>댓글</h2>
                </CommentPlaceHolderBox>
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
                                <i className="fas fa-paper-plane"></i>
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
                      placeholder="메시지를 입력하세요"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <CommentSubmitBox>
                      <CommentSubmit onClick={() => updateComment()}>
                        <i className="fas fa-paper-plane"></i>
                      </CommentSubmit>
                    </CommentSubmitBox>
                  </CommentBox>
                </CommentWriterBox>
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
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(147, 197, 253, 0.28);
  border-radius: 3em;
  padding: 0.4em 0.9em;
  cursor:pointer;
  color: #bfdbfe;
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

const PostBody = styled.div`
  padding: clamp(1.2em, 3vw, 2.2em);
  border: 1px solid rgba(148, 163, 184, 0.08);
  border-radius: 1em;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.28), rgba(15, 23, 42, 0.12));
  box-shadow: none;
  backdrop-filter: blur(6px);
  color: #e5e7eb;

  .wmde-markdown {
    background: transparent;
    color: #e5e7eb;
  }

  .wmde-markdown h1,
  .wmde-markdown h2,
  .wmde-markdown h3 {
    color: #f8fafc;
  }

  .wmde-markdown a {
    color: #93c5fd;
  }

  .wmde-markdown ul,
  .wmde-markdown ol {
    margin: 0.75em 0;
    padding-left: 1.7em;
  }

  .wmde-markdown ul {
    list-style: disc;
  }

  .wmde-markdown ol {
    list-style: decimal;
  }

  .wmde-markdown li {
    display: list-item;
    list-style: inherit;
    margin: 0.35em 0;
    padding: 0;
  }

  .wmde-markdown li::marker {
    color: #93c5fd;
  }

  .wmde-markdown code {
    background: rgba(15, 23, 42, 0.9);
  }
`;

const HeadingMarkerGroup = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0;
  z-index: 1200;
`;

const HeadingMarker = styled.button`
  position: absolute;
  left: ${({ $position }) => `${$position}%`};
  bottom: 0;
  --flag-color: ${({ $level }) => ($level === "h1" ? "#f8fafc" : $level === "h2" ? "#93c5fd" : "#5eead4")};
  --flag-glow: ${({ $level }) =>
    $level === "h1" ? "rgba(248, 250, 252, 0.55)" : $level === "h2" ? "rgba(147, 197, 253, 0.62)" : "rgba(94, 234, 212, 0.62)"};
  width: ${({ $level }) => ($level === "h1" ? "38px" : $level === "h2" ? "34px" : "30px")};
  height: ${({ $level }) => ($level === "h1" ? "34px" : $level === "h2" ? "30px" : "26px")};
  padding: 0;
  border: none;
  background:
    linear-gradient(#e5e7eb, #e5e7eb) 8px 4px / 2px calc(100% - 4px) no-repeat,
    radial-gradient(circle at 9px 100%, rgba(226, 232, 240, 0.95) 0 4px, transparent 4.5px);
  cursor: pointer;
  filter: drop-shadow(0 0 7px var(--flag-glow)) drop-shadow(0 3px 5px rgba(2, 6, 23, 0.82));
  transform: translateX(-50%) translateY(-2vmin);
  transition: transform 0.2s, filter 0.2s, opacity 0.2s;

  &:hover {
    filter: drop-shadow(0 0 13px var(--flag-glow)) drop-shadow(0 4px 8px rgba(2, 6, 23, 0.9));
    transform: translateX(-50%) translateY(calc(-2vmin - 4px));
  }

  &:focus-visible {
    outline: 2px solid #bfdbfe;
    outline-offset: 6px;
  }

  &::before {
    position: absolute;
    left: 10px;
    top: ${({ $level }) => ($level === "h1" ? "3px" : "4px")};
    width: ${({ $level }) => ($level === "h1" ? "24px" : $level === "h2" ? "21px" : "18px")};
    height: ${({ $level }) => ($level === "h1" ? "15px" : $level === "h2" ? "13px" : "11px")};
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.5), transparent 42%),
      var(--flag-color);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-left: none;
    border-radius: 0 0.35em 0.35em 0;
    box-shadow: inset -5px 0 9px rgba(2, 6, 23, 0.18);
    clip-path: polygon(0 0, 100% 0, 86% 48%, 100% 100%, 0 100%);
    content: "";
  }

  &::after {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 10px);
    max-width: 240px;
    padding: 0.55em 0.75em;
    border-radius: 0.5em;
    background: rgba(17, 24, 39, 0.94);
    color: white;
    content: attr(data-title);
    font-size: 12px;
    font-weight: 800;
    line-height: 1.35;
    opacity: 0;
    pointer-events: none;
    text-align: center;
    transform: translateX(-50%) translateY(4px);
    transition: opacity 0.2s, transform 0.2s;
    white-space: nowrap;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const CommentContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 16vh auto 0;
  border-radius: 4.5em;
  background:
    linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98)),
    #020617;
  border: 1px solid rgba(226, 232, 240, 0.18);
  box-shadow:
    inset 0 0 0 9px rgba(15, 23, 42, 0.95),
    inset 0 0 0 11px rgba(148, 163, 184, 0.14),
    0 34px 90px rgba(2, 6, 23, 0.55);
  min-height: 92vh;
  padding: 3.8em 1.35em 1.35em;
  box-sizing: border-box;
  backdrop-filter: blur(18px);
`;

const PhoneStatusBar = styled.div`
  position: absolute;
  top: 1.28em;
  left: clamp(3.1em, 7vw, 4.4em);
  right: clamp(3.1em, 7vw, 4.4em);
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  pointer-events: none;
`;

const PhoneTime = styled.span`
  min-width: 64px;
  padding-left: 0.25em;
  color: #f8fafc;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(2, 6, 23, 0.85);
`;

const CommentScreenContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 82vh;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 18% 0%, rgba(59, 130, 246, 0.14), transparent 28%),
    rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 3.2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  overflow: hidden;
`;

const PhoneIsland = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 118px;
  height: 32px;
  border-radius: 999px;
  background: #020617;
  border: 1px solid rgba(15, 23, 42, 0.9);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.08),
    0 10px 22px rgba(2, 6, 23, 0.5);
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  box-sizing: border-box;
`;

const PhoneCamera = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(147, 197, 253, 0.95), rgba(30, 64, 175, 0.55) 36%, #020617 70%);
  box-shadow:
    0 0 0 2px rgba(15, 23, 42, 0.9),
    0 0 8px rgba(96, 165, 250, 0.5);
`;

const PhoneBattery = styled.div`
  position: relative;
  width: 54px;
  height: 23px;
  margin-right: 0.2em;
  border: 1px solid rgba(226, 232, 240, 0.56);
  border-radius: 0.55em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $textColor }) => $textColor};
  font-size: 11px;
  font-weight: 900;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02)),
    rgba(2, 6, 23, 0.7);
  box-shadow:
    inset 0 0 0 1px rgba(15, 23, 42, 0.82),
    inset 0 1px 4px rgba(255, 255, 255, 0.06),
    0 0 18px ${({ $glow }) => $glow};
  overflow: visible;

  &::before {
    position: absolute;
    top: 3px;
    left: 3px;
    width: ${({ $percent }) => `${$percent}%`};
    max-width: calc(100% - 6px);
    height: calc(100% - 6px);
    border-radius: 0.35em;
    background: ${({ $fill }) => $fill};
    box-shadow: 0 0 12px ${({ $glow }) => $glow};
    content: "";
    transition: width 0.25s ease, background 0.25s ease;
  }

  &::after {
    position: absolute;
    top: 50%;
    right: -5px;
    width: 3px;
    height: 10px;
    border-radius: 0 2px 2px 0;
    background:
      linear-gradient(180deg, rgba(226, 232, 240, 0.74), rgba(100, 116, 139, 0.58));
    content: "";
    transform: translateY(-50%);
  }
`;

const BatteryCount = styled.span`
  position: relative;
  z-index: 1;
  line-height: 1;
  text-shadow: 0 1px 5px rgba(2, 6, 23, 0.75);
`;

const CommentTopbar = styled.div`
  min-height: 64px;
  padding: 1em 1.3em;
  box-sizing: border-box;
  background: rgba(2, 6, 23, 0.72);
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;

  span {
    color: #f8fafc;
    font-size: 18px;
    font-weight: 900;
  }

  small {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 800;
  }
`;

const CommentPlaceHolderBox = styled.div`
  display: flex;
  gap: 1em;
  box-sizing: border-box;
  align-items: center;
  padding: 1em 1.4em 0;
  color: #e5e7eb;

  h2 {
    font-size: 24px;
    margin: 0;
  }
`;

const CommentWriterBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  width: 100%;
  max-width: 100%;
  min-height: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  padding: 1em;
  box-sizing: border-box;
  background: rgba(2, 6, 23, 0.58);
`;

const CommentWriterImg = styled.img`
  border-radius: 50%;
  border: 2px solid rgba(147, 197, 253, 0.58);
`;

const CommentOtherBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85em;
  width: 100%;
  max-width: 100%;
  flex: 1;
  min-height: 38vh;
  padding: 1.2em 1.4em;
  background: transparent;
  box-sizing: border-box;
  overflow-y: auto;
`;

const CommentPersonalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  width: fit-content;
  max-width: min(76%, 560px);
  min-height: 0;
  background: rgba(30, 41, 59, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.2);
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.8em 1em;
  box-sizing: border-box;
  border-radius: 0.25em 1.2em 1.2em 1.2em;
  color: #e5e7eb;
`;

const CommentPersonalAuthor = styled.div`
  color: #93c5fd;
  font-size: 12px;
  font-weight: 900;
`;

const CommentPersonalComment = styled.div`
  width: 100%;
  padding: 0.2em 0;
  background: transparent;
  min-height: 0;
  border-radius: 0;
  box-sizing: border-box;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const CommentPersonalMeta = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 1vh;
  padding: 0.4em 0 0;
  border-radius: 0;
  font-size: 12px;
  background: transparent;
  box-sizing: border-box;
  gap: 1em;
  color: #94a3b8;
`;

const CommentAuthorBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.7em;
  padding: 0;
  box-sizing: border-box;
`;

const CommentAuthorInputBox = styled.div`
  border-radius: 999px;
  width: 100%;
  max-width: 49.5%;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.18);
  height: 2.4em;
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
  color: #e5e7eb;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
  }
`;

const CommentBox = styled.div`
  flex: 1;
  width: 100%;
  padding: 0.8em 0.9em;
  border-radius: 1.4em;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.18);
  min-height: 96px;
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
  color: #e5e7eb;
  resize: none;
  overflow-y: auto;
  font-family: inherit;

  &::placeholder {
    color: #94a3b8;
  }

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
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 2em;
  padding: 0;
  background: linear-gradient(135deg, #60a5fa, #2dd4bf);
  cursor: pointer;
  color: #020617;
  box-shadow: 0 10px 22px rgba(45, 212, 191, 0.18);
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
