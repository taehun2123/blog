import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function useCommentFetch(id){
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let isMounted = true;

    if (!id) {
        setData([]);
        setLoading(false);
        return () => {
          isMounted = false;
        };
    }

    setLoading(true);
    setError(null);

    const fetchData = async() =>{ 
      try {
        const q = query(collection(db, 'blogging', id, 'Comments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map((doc) => ({
          ...doc.data(),  
          commentId: doc.id  
        }));
        if (!isMounted) return;
        setData(comments);
        setError(null);
      } catch (error) {
        console.error("댓글을 불러오는 데 실패했습니다:", error);
        if (!isMounted) return;
        setError(error);
        setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id])

  return { data, error, loading };
}

export default useCommentFetch;
