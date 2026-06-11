import { BlogHeader } from "../components/BlogHeader";
import { Sidebar } from "../components/Sidebar";

import { useEffect, useState } from "react";
import styled from "styled-components";
import useFetch from "../customFn/useFetch";
import { usePost, usePostActions } from "../store/usePostStore";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor, { commands } from "@uiw/react-md-editor";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, authService } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import ImageModal from "../components/ImageModal";

const escapeHtmlAttribute = (value = "") =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function EditPost({ isFixed, targetComponentRef }) {
  const { data } = useFetch();
  const [images, setImages] = useState([]);
  const [api, setApi] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 추가
  const [uploadType, setUploadType] = useState("image");
  const navigate = useNavigate();
  const { title, contents, category } = usePost();
  const { setTitle, setContents, setCategoryPrev, setCategoryCurrent, resetPost } =
    usePostActions();
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category.prev))
  );
  const {id} = useParams();


  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user && user.uid === "rDy6MZqet8SNAS1K1Hw9YXC63No1") {
        alert("인증에 성공하였습니다.\n관리자님 오늘도 좋은 하루 되세요.");
      } else {
        alert("접근 권한이 없습니다!");
        navigate("/");
      }
    });
  }, []);

  // id가 불러지면 id에 해당하는 blogging 컬렉션의 문서를 받아옴
  useEffect(() => {
    const fetchData = async () => {
      const docData = await getDocument(); // 비동기 함수에서 데이터 받기
      setContents(docData.contents); // 상태 설정
      setTitle(docData.title);
      setCategoryCurrent(docData.category.current);
      setCategoryPrev(docData.category.prev);
    };
    if(id)
      fetchData();
  }, [id]);

  const getDocument = async () => {
    const docRef = doc(db, "blogging", id); // 문서 참조 생성
    const docSnap = await getDoc(docRef); // 문서 조회

    if (docSnap.exists()) return docSnap.data(); // 문서 데이터 반환
  };

  const image = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "이미지 업로드", title: "이미지 업로드" },
    icon: (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path
          fill="currentColor"
          d="M480 416v16c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h16v208c0 44.1 35.9 80 80 80h336zm96-80V80c0-26.5-21.5-48-48-48H144c-26.5 0-48 21.5-48 48v256c0 26.5 21.5 48 48 48h384c26.5 0 48-21.5 48-48zM256 128c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm-96 144l55.5-55.5c4.7-4.7 12.3-4.7 17 0L272 256l135.5-135.5c4.7-4.7 12.3-4.7 17 0L512 208v112H160v-48z"
        />
      </svg>
    ),
    execute: (state, api) => {
      openUploadModal(api, "image");
    },
  };

  const htmlAttachment = {
    name: "htmlAttachment",
    keyCommand: "htmlAttachment",
    buttonProps: { "aria-label": "HTML 첨부", title: "HTML 첨부" },
    icon: (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path
          fill="currentColor"
          d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zM164.6 121.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L75.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3zm310.7 0c-12.5 12.5-12.5 32.8 0 45.3l89.4 89.3-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0z"
        />
      </svg>
    ),
    execute: (state, api) => {
      openUploadModal(api, "html");
    },
  };

  const openUploadModal = (api, type) => {
    setModalOpen(true); // 모달 열기
    setUploadType(type);
    setApi(api);
    return handleFileChange;
  };

  const closeModal = () => {
    setModalOpen(false); // 모달 닫기
  };

  const insertEditorContent = (api, value) => {
    if (api?.replaceSelection) {
      api.replaceSelection(value);
      return;
    }

    setContents((prevContents = "") => `${prevContents}${prevContents ? "\n" : ""}${value}`);
  };

  const handleFileChange = (event, api) => {
    const file = event.target.files[0];
    if (file) {
      const isHtmlFile = file.type === "text/html" || file.name.toLowerCase().endsWith(".html");

      if (uploadType === "html" && !isHtmlFile) {
        alert("HTML 파일만 첨부할 수 있습니다.");
        closeModal();
        return;
      }

      handleFileUpload(file, uploadType, (url) => {
        if (uploadType === "html") {
          insertEditorContent(
            api,
            `<div class="html-attachment">\n  <iframe title="${escapeHtmlAttribute(file.name)}" src="${url}" loading="lazy" sandbox="allow-scripts allow-forms allow-popups"></iframe>\n  <a href="${url}" target="_blank" rel="noreferrer">HTML 첨부 새 탭에서 열기</a>\n</div>\n`
          );
          return;
        }

        insertEditorContent(api, `![](${url})\n`);
      });
    }
    closeModal(); // 파일 선택 후 모달 닫기
  };

  const handleFileUpload = (file, type, callback) => {
    const formData = new FormData();
    formData.append(type, file);

    const uploadRef = ref(
      storage,
      `${type === "html" ? "html" : "images"}/${Date.now()}_${file.name || (type === "html" ? "attachment.html" : "image.png")}`
    );
    const metadata = type === "html" ? { contentType: "text/html; charset=utf-8" } : undefined;

    uploadBytes(uploadRef, file, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // 콜백 함수를 이용하여 이미지 URL을 에디터에 삽입
        // 이미지 상태 업데이트
        callback(url);
        setImages([...images, url]);
      });
    });
  };

  async function handleUploadPost() {
    if(id){
      await updateDoc(doc(db,"blogging", id), {title, contents, date: serverTimestamp(), category});
      alert("성공적으로 게시글이 수정 되었습니다!");
      resetPost();
      navigate(`/post/${id}`);
      window.location.reload();
    } else {
      const createPostRef = await addDoc(collection(db, "blogging"), {
        title,
        contents,
        date: serverTimestamp(), // 현재 날짜,시간
        category,
      });
      if (createPostRef) {
        const postSnap = await getDoc(createPostRef);
        alert("성공적으로 게시글이 작성/변경되었습니다!");
        resetPost();
        navigate(`/post/${postSnap.id}`);
        window.location.reload();
      }
    }
  }

  return (
    <div className="container">
      <div className="body">
        <BlogHeader
          isFixed={isFixed}
          eyebrow="DEVH EDITOR"
          prev="[ 글 쓰기 공간 ]"
          writer={["오늘 하루도", "수고했어", "정말 고생했어"]}
        />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <h1 className="effectFont">
              <i className="fas fa-pencil-paintbrush"></i> 포스트 작성하기
            </h1>
            <InputBox
              list="prev"
              value={category.prev}
              onChange={(e) => setCategoryPrev(e.target.value)}
            />
            <datalist id="prev">
              {uniqueCategories.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>
            <InputBox
              list="list"
              value={category.current}
              onChange={(e) => setCategoryCurrent(e.target.value)}
            />
            <datalist id="list">
              {data.map((item, index) => (
                <option key={index} value={item.category.current} />
              ))}
            </datalist>
            <TitleBox>
              <TitleInputBox
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
              />
            </TitleBox>
            <EditorPanel data-color-mode="dark">
              <UploadActionBar>
                <UploadActionButton type="button" onClick={() => openUploadModal(null, "image")}>
                  <i className="fas fa-image" aria-hidden="true"></i>
                  이미지 업로드
                </UploadActionButton>
                <UploadActionButton type="button" onClick={() => openUploadModal(null, "html")}>
                  <i className="fas fa-code" aria-hidden="true"></i>
                  HTML 첨부
                </UploadActionButton>
              </UploadActionBar>
              <MDEditor
                commands={[...commands.getCommands(), image, htmlAttachment]}
                height={865}
                value={contents}
                onChange={setContents}
              />
              <ImageModal
                accept={uploadType === "html" ? ".html,text/html" : "image/*"}
                api={api}
                isOpen={modalOpen}
                onClose={closeModal}
                handleFileChange={handleFileChange}
                title={uploadType === "html" ? "HTML 첨부 업로드" : "이미지 업로드"}
              />
            </EditorPanel>
            <ButtonBox>
              <SaveButton>임시저장</SaveButton>
              <Button onClick={() => handleUploadPost()}>게시하기</Button>
            </ButtonBox>
          </div>
        </main>
      </div>
      <Sidebar />
    </div>
  );
}

const TitleBox = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 0.5em;
  width: 100%;
  padding: 1em 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 0.5em;
  background: rgba(15, 23, 42, 0.78);
`;

const TitleInputBox = styled.input`
  width: 95%;
  padding: 0.5em 0;
  outline: none;
  font-size: 36px;
  border: none;
  background: transparent;
  color: #e5e7eb;

  &::placeholder {
    color: #94a3b8;
  }
`;

const EditorPanel = styled.div`
  padding: 1em;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1.2em;
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.28);
`;

const UploadActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65em;
  margin-bottom: 0.85em;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const UploadActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55em;
  min-height: 42px;
  padding: 0 1em;
  border: 1px solid rgba(147, 197, 253, 0.28);
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.78);
  color: #dbeafe;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(94, 234, 212, 0.56);
    background: rgba(37, 99, 235, 0.42);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #93c5fd;
    outline-offset: 3px;
  }
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding: 1em 0;
`;

const Button = styled.button`
  padding: 1em 2em;
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

const SaveButton = styled.button`
  padding: 1em 2em;
  background: rgba(148, 163, 184, 0.18);
  border-radius: 1em;
  cursor: pointer;
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: #e5e7eb;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: rgba(148, 163, 184, 0.28);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled.input`
  border-radius: 0.5em;
  padding: 0.5em;
  box-sizing: border-box;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.78);
  color: #e5e7eb;
`;
