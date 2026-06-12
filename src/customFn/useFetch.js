import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const toDate = (date) => {
    if (!date) return null;
    return typeof date.toDate === "function" ? date.toDate() : date;
};

function useFetch(category, value) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let fetchData;
        setLoading(true);
        setError(null);
        if (!category || !value) {
            fetchData = async () => {
                try {
                    const q = query(collection(db, "blogging"),                                 
                    orderBy("date", "desc") // 날짜를 기준으로 내림차순 정렬
                );
                    const querySnapshot = await getDocs(q);
                    const result = querySnapshot.docs.map(doc => ({
                        ...doc.data(), 
                        date: toDate(doc.data().date), // Ensure you handle date conversion correctly
                        id: doc.id
                    }));
                    if (!isMounted) return;
                    setData(result);
                    setError(null);
                    return;
                } catch (error) {
                    console.error('Error fetching data: ', error);
                    if (!isMounted) return;
                    setError(error);
                    setData([]);
                    return;
                } finally{
                    if (isMounted) setLoading(false);
                }
            }
        }
        else {
            fetchData = async () => {
                try {
                    const q = query(collection(db, "blogging"), 
                                where(category, "==", value)
                                );
                    const querySnapshot = await getDocs(q);
                    const result = querySnapshot.docs.map(doc => ({
                        ...doc.data(), 
                        date: toDate(doc.data().date),
                        id: doc.id
                    }));
                    if (!isMounted) return;
                    setData(result);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching data: ', error);
                    if (!isMounted) return;
                    setError(error);
                    setData([]);
                } finally{
                    if (isMounted) setLoading(false);
                }
            };
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [category, value]);

    return { data, loading, error };
}

export default useFetch;
