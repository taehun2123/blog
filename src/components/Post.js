import { db } from "../firebase";
import { useEffect, useState } from "react";
// firestore의 메서드 import
import { doc, getDoc } from "firebase/firestore";

export function Post(){
  const [test, setTest] = useState();
  // async - await로 데이터 fetch 대기
  async function getTest() {
    // document에 대한 참조 생성
    const docRef = doc(db, "blogging", "bSGeTMHZ4ThkF5PdW3DA");
    // 참조에 대한 Snapshot 쿼리
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTest(docSnap.data());
    }
  }
  // 최초 마운트 시에 getTest import
  useEffect(() => {
    getTest();
  }, []);
  return(
    <section class="section" data-aos="fade-up" aos-offset="600" aos-easing="ease-in-sine" aos-duration="1200">
        <article class="post" >
          <ul class="post-list">
            {test !== undefined && (
              <li class="post-card">
                <h3>{test.title}</h3>
                <p>{test.contents}</p>
                <span class="post-meta">
                  <span>DEVH</span>
                  <span>2024. 4. 25.</span>
                </span>
              </li>
            )}
          </ul>
        </article>
      </section>
  )
}