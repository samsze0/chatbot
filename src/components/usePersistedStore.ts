// https://docs.pmnd.rs/zustand/integrations/persisting-store-data#usage-in-next.js

import { useState, useEffect } from "react";

const usePersistedStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default usePersistedStore;
