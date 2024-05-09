import { Logo } from "../components/Logo";
import { Sidebar } from "../components/Sidebar";
import { TypeWriter } from "../components/TypeWriter";
import logoVideo from "../components/Items/logo_background.mp4";
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';

import { useEffect, useRef, useState } from "react"
import { Editor } from '@toast-ui/react-editor';

export function EditPost({isFixed, targetComponentRef}){
  const editorRef = useRef(null);
  const [images, setImages] = useState();
  const [contents, setContents] = useState();
  useEffect(() => {
    if (editorRef.current) {
      // 기존 훅 제거
      editorRef.current.getInstance().removeHook('addImageBlobHook');
	  // 새로운 훅 추가
      editorRef.current.getInstance().addHook('addImageBlobHook', (blob, callback) => {
        (async () => {
          let formData = new FormData();
          formData.append('image', blob);

          console.log('이미지가 업로드 됐습니다.');

          // await axios.post(`{저장할 서버 api}`, formData, {
          //   header: { 'content-type': 'multipart/formdata' },
          //   withCredentials: true,
          // });

          const imageUrl = '저장된 서버 주소' + blob.name;

          setImages([...images, imageUrl]);
          callback(imageUrl, 'image');
        })();

        return false;
      });
    }

    return () => {};
  }, [editorRef, images]);

  return(
    <div className="container">
      <div className="body">
        <Logo isFixed={isFixed} background={logoVideo} writer={<TypeWriter prev={'Hello,'} writer={['DEVH WORLD', 'Developer Hun']}/>}/>
        <main className="main" ref={targetComponentRef}>
          <div className="wrapper">
            <Editor
              previewStyle="vertical"
              initialEditType="wysiwyg"
              placeholder="글을 작성해 주세요"
              height="450px"
              onChange={() => setContents(editorRef.current.getInstance().getHTML())}
              ref={editorRef}            
              toolbarItems={[    
                ['bold', 'italic', 'strike'],
                ['hr'],
                ['image', 'link'],
                ['ul', 'ol'],
                ['code', 'codeblock'],
              ]}
              plugins={[
                [colorSyntax],
                [codeSyntaxHighlight, { highlighter: Prism }],
              ]}           
            />
          </div>
        </main>
        <footer></footer>
      </div>
      <Sidebar/>
    </div>
  )
}