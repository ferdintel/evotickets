import { useEffect, useState } from "react";

import { firebaseDB } from "lib/firebase/client";
import { getDocs, collection } from "firebase/firestore";

const useGetDocsFromFirestore = <T>(collectionName: string) => {
  const [docs, setDocs] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // check if online or not
    if (navigator.onLine) {
      const docsRef = collection(firebaseDB, collectionName);

      getDocs(docsRef)
        .then((snapshot) => {
          const docsList = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as T)
          );
          setDocs(docsList);
        })
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    } else {
      setError({
        message: "Il semble que vous soyez hors ligne.",
        name: "ERR_INTERNET_DISCONNECTED",
      });

      setIsLoading(false);
    }
  }, [collectionName]);

  return { docs, isLoading, error };
};

export default useGetDocsFromFirestore;
