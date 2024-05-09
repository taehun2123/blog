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

export function EditPost({ isFixed, targetComponentRef }) {
  const editorRef = useRef(null);
  const [images, setImages] = useState();
  const [contents, setContents] = useState();
  useEffect(() => {
    if (editorRef.current) {
      // 기존 훅 제거
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      // 새로운 훅 추가
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          (async () => {
            let formData = new FormData();
            formData.append("image", blob);

            console.log("이미지가 업로드 됐습니다.");

            // await axios.post(`{저장할 서버 api}`, formData, {
            //   header: { 'content-type': 'multipart/formdata' },
            //   withCredentials: true,
            // });

            const imageUrl = "저장된 서버 주소" + blob.name;

            setImages([...images, imageUrl]);
            callback(imageUrl, "image");
          })();

          return false;
        });
    }

    return () => {};
  }, [editorRef, images]);

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
            <select>
              <option>
                FrontEnd
              </option>
              <option>
                BackEnd
              </option>
            </select>
            <input/>
            <TitleBox>
            <TitleInputBox placeholder="제목을 입력해주세요"/>
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
              toolbarItems={[
                ["bold", "italic", "strike"],
                ["hr"],
                ["image", "link"],
                ["ul", "ol"],
                ["code", "codeblock"],
              ]}
              plugins={[
                [colorSyntax],
                [codeSyntaxHighlight, { highlighter: Prism }],
              ]}
            />
            <ButtonBox>
              <SaveButton>임시저장</SaveButton>
              <Button>게시하기</Button>
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
