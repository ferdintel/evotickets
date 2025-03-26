import { useEffect, useState, useMemo } from "react";
import { getDocs, query, QueryConstraint, Query } from "firebase/firestore";

const useDocsFromFirestore = <T>(
  collectionRef: Query,
  queryConstraints?: QueryConstraint[],
  enabled: boolean = true
) => {
  const [docs, setDocs] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // to prevent re-renders
  const memoizedConstraints = useMemo(
    () => queryConstraints || [],
    [JSON.stringify(queryConstraints)]
  );

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        if (!navigator.onLine) {
          throw new Error("ERR_INTERNET_DISCONNECTED");
        }

        const q = query(collectionRef, ...memoizedConstraints);

        const snapshot = await getDocs(q);
        const docsList = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );

        setDocs(docsList);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Une erreur inconnue est survenue"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchData();
  }, [collectionRef, memoizedConstraints, enabled]);

  return { docs, isLoading, error };
};

export default useDocsFromFirestore;
