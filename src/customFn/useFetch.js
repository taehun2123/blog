import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function useFetch(category, value) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let fetchData;
        setLoading(true);
        if (!category || !value) {
            fetchData = async () => {
                try {
                    const q = query(collection(db, "blogging"),                                 
                    orderBy("date", "desc") // 날짜를 기준으로 내림차순 정렬
                );
                    const querySnapshot = await getDocs(q);
                    const result = querySnapshot.docs.map(doc => ({
                        ...doc.data(), 
                        date: doc.data().date.toDate(), // Ensure you handle date conversion correctly
                        id: doc.id
                    }));
                    setData(result);
                    setError(null);
                    return;
                } catch (error) {
                    console.error('Error fetching data: ', error);
                    setError(error);
                    return;
                } finally{
                    setLoading(false);
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
                        date: doc.data().date.toDate(),
                        id: doc.id
                    }));
                    setData(result);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching data: ', error);
                    setError(error);
                } finally{
                    setLoading(false);
                }
            };
        }

        fetchData();
    }, [category, value]);

    return { data, loading, error };
}

export default useFetch;
