import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { TypeWriter } from "../components/TypeWriter";
import logoVideo from "../components/Items/logo_background.mp4";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useFetch from "../customFn/useFetch";
import { usePost, usePostActions } from "../store/usePostStore";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor, { commands, executeCommand } from "@uiw/react-md-editor";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, authService } from "../firebase";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ImageModal from "../components/ImageModal";

export function EditPost({ isFixed, targetComponentRef }) {
  const { data } = useFetch();
  const editorRef = useRef(null);
  const [images, setImages] = useState([]);
  const [api, setApi] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();
  const { title, contents, category } = usePost();
  const { setTitle, setContents, setCategoryPrev, setCategoryCurrent } =
    usePostActions();
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category.prev))
  );
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

  const image = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Insert Image" },
    icon: (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path
          fill="#000000"
          d="M480 416v16c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h16v208c0 44.1 35.9 80 80 80h336zm96-80V80c0-26.5-21.5-48-48-48H144c-26.5 0-48 21.5-48 48v256c0 26.5 21.5 48 48 48h384c26.5 0 48-21.5 48-48zM256 128c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm-96 144l55.5-55.5c4.7-4.7 12.3-4.7 17 0L272 256l135.5-135.5c4.7-4.7 12.3-4.7 17 0L512 208v112H160v-48z"
        />
      </svg>
    ),
    execute: (state, api) => {
      uploadImage(api);
    },
  };

  const uploadImage = (api) => {
    setModalOpen(true); // 모달 열기
    setApi(api);
    return handleFileChange;
  };

  const closeModal = () => {
    setModalOpen(false); // 모달 닫기
  };

  const handleFileChange = (event, api) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file, (url) => {
        api.replaceSelection(`![](${url})\n`);
      });
    }
    closeModal(); // 파일 선택 후 모달 닫기
  };

  const handleImageUpload = (file, callback) => {
    const formData = new FormData();
    formData.append("image", file);

    const imageRef = ref(
      storage,
      `images/${Date.now()}_${file.name || "image.png"}`
    );
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // 콜백 함수를 이용하여 이미지 URL을 에디터에 삽입
        // 이미지 상태 업데이트
        callback(url);
        setImages([...images, url]);
      });
    });
  };

  async function handleUploadPost() {
    const createPostRef = await addDoc(collection(db, "blogging"), {
      title,
      contents,
      date: serverTimestamp(), // 현재 날짜,시간
      category,
    });
    if (createPostRef) {
      const postSnap = await getDoc(createPostRef);
      alert("성공적으로 게시글이 작성되었습니다!");
      navigate(`/post/${postSnap.id}`);
    }
  }

  return (
    <div className="container">
      <div className="body">
        <Logo
          isFixed={isFixed}
          background={logoVideo}
          writer={
            <TypeWriter
              prev={"[ 글 쓰기 공간 ]"}
              writer={["오늘 하루도", "수고했어", "정말 고생했어"]}
            />
          }
        />
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <h1 className="effectFont">
              <i class="fas fa-pencil-paintbrush"></i> 포스트 작성하기
            </h1>
            <InputBox
              list="prev"
              onChange={(e) => setCategoryPrev(e.target.value)}
            />
            <datalist id="prev">
              {uniqueCategories.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>
            <InputBox
              list="list"
              onChange={(e) => setCategoryCurrent(e.target.value)}
            />
            <datalist id="list">
              {data.map((item, index) => (
                <option key={index} value={item.category.current} />
              ))}
            </datalist>
            <TitleBox>
              <TitleInputBox
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
              />
            </TitleBox>
            <div data-color-mode="light">
              <MDEditor
                commands={[...commands.getCommands(), image]}
                height={865}
                value={contents}
                onChange={setContents}
              />
              <ImageModal
                api={api}
                isOpen={modalOpen}
                onClose={closeModal}
                handleFileChange={handleFileChange}
              />
            </div>
            <ButtonBox>
              <SaveButton>임시저장</SaveButton>
              <Button onClick={() => handleUploadPost()}>게시하기</Button>
            </ButtonBox>
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar />
    </div>
  );
}

const TitleBox = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.5em;
  width: 100%;
  padding: 1em 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 0.5em;
`;

const TitleInputBox = styled.input`
  width: 90%;
  padding: 0.5em 0;
  outline: none;
  font-size: 36px;
  border: none;
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
  background: var(--button-sub-color);
  border-radius: 1em;
  cursor: pointer;
  border: none;
  color: black;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: var(--button-sub-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled.input`
  border-radius: 0.5em;
  padding: 0.5em;
  box-sizing: border-box;
  border: 1px solid lightgray;
`;
