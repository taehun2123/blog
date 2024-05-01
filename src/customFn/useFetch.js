import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function useFetch(category, value) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ensure category and value are valid to prevent unnecessary queries
        if (!category || !value) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "blogging"), where(category, "==", value));
                const querySnapshot = await getDocs(q);
                const result = querySnapshot.docs.map(doc => ({
                    ...doc.data(), 
                    date: doc.data().date.toDate(), // Ensure you handle date conversion correctly
                    id: doc.id
                }));
                setData(result);
                setError(null);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, value]);

    return { data, error, loading };
}

export default useFetch;
