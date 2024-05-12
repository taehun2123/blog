import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { TypeWriter } from "../components/TypeWriter";
import logoVideo from "../components/Items/logo_background.mp4";
import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import Prism from "prismjs";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import styled from "styled-components";
import useFetch from "../customFn/useFetch";
import { usePost, usePostActions } from "../store/usePostStore";

import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage, db, authService} from "../firebase";
import { addDoc, collection, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLogin, useUserData } from "../store/useIsLoggin";

export function EditPost({ isFixed, targetComponentRef }) {
  const {data} = useFetch();
  const editorRef = useRef(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const {title, contents, category} = usePost();
  const {setTitle, setContents, setCategoryPrev, setCategoryCurrent} = usePostActions();
  const uniqueCategories = Array.from(new Set(data.map(item => item.category.prev)));

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user && user.uid === "rDy6MZqet8SNAS1K1Hw9YXC63No1") {
        alert("인증에 성공하였습니다.\n관리자님 오늘도 좋은 하루 되세요.");
      } else {
        alert("접근 권한이 없습니다!");
        navigate("/");
      }
    })
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      // 기존 훅 제거
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      // 새로운 훅 추가
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          const imageRef = ref(storage, `images/${Date.now()}_${blob.name || 'image.png'}`);
          uploadBytes(imageRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              // 콜백 함수를 이용하여 이미지 URL을 에디터에 삽입
              callback(url, "image");
              // 이미지 상태 업데이트
              setImages([...images, url]);
            });
          });
          return false; // 기본 이미지 삽입 동작 방지
        });
    }
  }, [editorRef]);

  async function handleUploadPost(){
    const createPostRef = await addDoc(collection(db, "blogging"), {
        title,
        contents,
        date: serverTimestamp(), // 현재 날짜,시간
        category
      });
      if(createPostRef){
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
            <SelectBox onChange={(e)=>setCategoryPrev(e.target.value)}>
              {uniqueCategories.map((item, index) =>
              <option value={item} key={index}>
                {item}
              </option>
              )}
            </SelectBox>
            <InputBox list="list" onChange={(e)=>setCategoryCurrent(e.target.value)}/>
            <datalist id="list">
            {data.map((item, index) =>
              <option key={index} value={item.category.current}/>
            )}
            </datalist>
            <TitleBox>
            <TitleInputBox onChange={(e)=> setTitle(e.target.value)} placeholder="제목을 입력해주세요"/>
            </TitleBox>
            <Editor
              previewStyle="vertical"
              initialEditType="wysiwyg"
              placeholder="내용을 입력해 주세요"
              height="450px"
              onChange={() =>
                setContents(editorRef.current.getInstance().getHTML())
              }
              ref={editorRef}
              plugins={[
                [colorSyntax],
                [codeSyntaxHighlight, { highlighter: Prism }],
              ]}
            />
            <ButtonBox>
              <SaveButton>임시저장</SaveButton>
              <Button onClick={()=> handleUploadPost()}>게시하기</Button>
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
  align-items:center;
  box-sizing: border-box;
  margin-bottom: 0.5em;
`

const TitleInputBox = styled.input`
  width: 90%;
  padding: 0.5em 0;
  outline: none;
  font-size: 36px;
  border: none;
`

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

const SelectBox = styled.select`
  border-radius: 0.5em;
  padding: 0.5em;
  box-sizing: border-box;
  border: 1px solid lightgray;
  margin-bottom: 0.5em;
  margin-right: 0.5em;
`
const InputBox = styled.input`
border-radius: 0.5em;
padding: 0.5em;
box-sizing: border-box;
border: 1px solid lightgray;
`