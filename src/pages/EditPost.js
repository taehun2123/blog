import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { storage, db, authService } from "../firebase";
import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { TypeWriter } from "../components/TypeWriter";
import ImageModal from "../components/ImageModal";
import useFetch from "../customFn/useFetch";
import { usePost, usePostActions } from "../store/usePostStore";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export function EditPost({ isFixed, targetComponentRef }) {
  const { data } = useFetch();
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { title, contents, category } = usePost();
  const { setTitle, setContents, setCategoryPrev, setCategoryCurrent, resetPost } = usePostActions();
  const uniqueCategories = Array.from(new Set(data.map((item) => item.category.prev)));
  const { id } = useParams();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user && user.uid === "rDy6MZqet8SNAS1K1Hw9YXC63No1") {
        alert("인증에 성공하였습니다.\n관리자님 오늘도 좋은 하루 되세요.");
      } else {
        alert("접근 권한이 없습니다!");
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const docData = await getDocument();
        setContents(docData.contents);
        setTitle(docData.title);
        setCategoryCurrent(docData.category.current);
        setCategoryPrev(docData.category.prev);
      }
    };
    fetchData();
  }, [id, setContents, setTitle, setCategoryCurrent, setCategoryPrev]);

  const getDocument = async () => {
    const docRef = doc(db, "blogging", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `images/${Date.now()}_${file.name || "image.png"}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    setImages((prevImages) => [...prevImages, url]);
    return url;
  };

  const insertImage = async (file, api) => {
    try {
      const url = await handleImageUpload(file);
      api.replaceSelection(`![](${url})\n`);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
    setModalOpen(false);
  };

  const imageCommand = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Insert Image" },
    icon: (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path fill="#000000" d="M480 416v16c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h16v208c0 44.1 35.9 80 80 80h336zm96-80V80c0-26.5-21.5-48-48-48H144c-26.5 0-48 21.5-48 48v256c0 26.5 21.5 48 48 48h384c26.5 0 48-21.5 48-48zM256 128c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm-96 144l55.5-55.5c4.7-4.7 12.3-4.7 17 0L272 256l135.5-135.5c4.7-4.7 12.3-4.7 17 0L512 208v112H160v-48z" />
      </svg>
    ),
    execute: (state, api) => {
      setModalOpen(true);
    },
  };

  const handleUploadPost = async () => {
    try {
      const postData = {
        title,
        contents,
        date: serverTimestamp(),
        category,
      };

      if (id) {
        await updateDoc(doc(db, "blogging", id), postData);
        alert("성공적으로 게시글이 수정되었습니다!");
      } else {
        const createPostRef = await addDoc(collection(db, "blogging"), postData);
        id = createPostRef.id;
        alert("성공적으로 게시글이 작성되었습니다!");
      }

      resetPost();
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("게시글 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="body">
        <Logo
          isFixed={isFixed}
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
            <div data-color-mode="light">
              <MDEditor
                commands={[...commands.getCommands(), imageCommand]}
                height={865}
                value={contents}
                onChange={setContents}
              />
              <ImageModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                handleFileChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    insertImage(file, MDEditor.commands.getCommand("image").execute);
                  }
                }}
              />
            </div>
            <ButtonBox>
              <SaveButton>임시저장</SaveButton>
              <Button onClick={handleUploadPost}>게시하기</Button>
            </ButtonBox>
          </div>
        </main>
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
  width: 95%;
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