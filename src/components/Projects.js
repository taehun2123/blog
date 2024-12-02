import { forwardRef, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ImageGallery from "react-image-gallery";
import MDEditor from "@uiw/react-md-editor";
import { collection, getDocs, query, doc, updateDoc, refEqual } from "firebase/firestore";
import { ref as imageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { authService } from "../firebase";

const Projects = forwardRef((props, ref) => {
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "projects"));
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (item) => {
    const user = authService.currentUser;
    if (user && user.uid === "rDy6MZqet8SNAS1K1Hw9YXC63No1") {
      alert("인증에 성공하였습니다.\n관리자님 오늘도 좋은 하루 되세요.");
      setIsEditing(true);
      setEditData({ ...item });
    } else {
      alert("접근 권한이 없습니다!");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      // 파일 이름에 timestamp 추가하여 고유성 보장
      const fileRef = imageRef(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
  
      // 기존 이미지 배열 복사
      const newImages = [...editData.image];
      newImages.push({
        original: downloadURL,
        thumbnail: downloadURL
      });
  
      setEditData({
        ...editData,
        image: newImages
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = editData.image.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      image: newImages
    });
  };

  const handleSave = async () => {
    try {
      const projectRef = doc(db, "projects", editData.id);
      await updateDoc(projectRef, {
        title: editData.title,
        date: editData.date,
        contents: editData.contents,
        image: editData.image
      });

      setData(data.map(item => 
        item.id === editData.id ? editData : item
      ));
      
      setIsEditing(false);
      setEditData(null);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  function handleProjectInfo(type){
    if(type) window.open(type, '_blank');
    else alert("준비중 입니다!");
  }

  function dolist() {
    return (
      <ProjectContainer>
        {data && data.map((item, key) => (
          <ProjectBox
            key={key}
            data-aos="fade-up"
            aos-offset="600"
            aos-easing="ease-in-sine"
            aos-duration="1200"
          >
            <ProjectTitleBox>
              {isEditing && editData?.id === item.id ? (
                <input
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  style={{ fontSize: '1.17em', marginBottom: '8px' }}
                />
              ) : (
                <h3>{item.title}</h3>
              )}
              {isEditing && editData?.id === item.id ? (
                <input
                  value={editData.date}
                  onChange={(e) => setEditData({...editData, date: e.target.value})}
                />
              ) : (
                <ProjectDate>{item.date}</ProjectDate>
              )}
            </ProjectTitleBox>
            <ProjectImage>
              <ProjectImagePosition>
                <ImageGallery items={item.image} />
                {isEditing && editData?.id === item.id && (
                  <ImageEditContainer>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <ProjectButton onClick={() => fileInputRef.current.click()}>
                      이미지 추가
                    </ProjectButton>
                    <ImagePreviewContainer>
                      {editData.image.map((img, index) => (
                        <ImagePreviewItem key={index}>
                          <img src={img.thumbnail} alt={`Preview ${index}`} />
                          <RemoveButton onClick={() => handleRemoveImage(index)}>
                            ✕
                          </RemoveButton>
                        </ImagePreviewItem>
                      ))}
                    </ImagePreviewContainer>
                  </ImageEditContainer>
                )}
              </ProjectImagePosition>
            </ProjectImage>
            <ProjectContents data-color-mode="light">
              {isEditing && editData?.id === item.id ? (
                <MDEditor
                  value={editData.contents}
                  onChange={(value) => setEditData({...editData, contents: value})}
                />
              ) : (
                <MDEditor.Markdown
                  style={{ padding: 10 }}
                  source={item.contents}
                />
              )}
            </ProjectContents>
            <ProjectButtonContainer>
              {isEditing && editData?.id === item.id ? (
                <>
                  <ProjectButton onClick={handleSave}>저장</ProjectButton>
                  <ProjectButton onClick={() => {
                    setIsEditing(false);
                    setEditData(null);
                  }}>취소</ProjectButton>
                </>
              ) : authService.currentUser && authService.currentUser.uid === "rDy6MZqet8SNAS1K1Hw9YXC63No1" && (
                <ProjectButton onClick={() => handleEdit(item)}>수정</ProjectButton>
              )}
              <ProjectReadMe onClick={()=>handleProjectInfo(item.readme)}>READ.ME</ProjectReadMe>
              <ProjectReadMe onClick={()=>handleProjectInfo(item.github)}>GITHUB</ProjectReadMe>
            </ProjectButtonContainer>
          </ProjectBox>
        ))}
      </ProjectContainer>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        paddingBottom: "5em",
        borderBottom: "1px solid lightgray",
        paddingTop: "5em",
      }}
      data-aos="fade-up"
      aos-offset="600"
      aos-easing="ease-in-sine"
      aos-duration="1200"
    >
      <h1 className="effectFont">
        <i className="fas fa-code"></i> Projects
      </h1>
      {dolist()}
    </div>
  );
});

export default Projects;

const ProjectContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  flex-wrap: wrap;
`;

const ProjectBox = styled.li`
  width: 100%;
  box-sizing: border-box;
  border-radius: 2em;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  padding: 2em 3em;
`;

const ProjectTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  padding-bottom: 1em;
`;

const ProjectDate = styled.span`
  color: gray;
`;

const ProjectImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const ProjectImagePosition = styled.div`
  width: 90%;
`;

const ProjectContents = styled.div`
  padding: 0.5em 0;
  border-bottom: 1px solid lightgray;
  margin-bottom: 1em;
`;

const ProjectButtonContainer = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 1em;
`;

const ProjectButton = styled.button`
  padding: 0.8em 1.5em;
  background: #4a90e2;
  border-radius: 1em;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: #357abd;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectReadMe = styled(ProjectButton)`
  background: var(--button-main-color);
  &:hover {
    background: var(--button-hover-color);
  }
`;

const ImageEditContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin-top: 1em;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  &:hover {
    background: darkred;
  }
`;