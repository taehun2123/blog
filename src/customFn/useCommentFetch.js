import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function useCommentFetch(id){
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    if (!id) {
        setLoading(false);
        return;
    }

    const fetchData = async() =>{ 
      try {
        const q = query(collection(db, 'blogging', id, 'Comments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map((doc) => ({
          ...doc.data(),  
          commentId: doc.id  
        }));
        setData(comments);
      } catch (error) {
        console.error("댓글을 불러오는 데 실패했습니다:", error);
      }
    }
    fetchData();
  }, [id])

  return { data, error, loading };
}

export default useCommentFetch;
