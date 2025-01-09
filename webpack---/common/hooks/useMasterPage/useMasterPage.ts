import { useLayoutEffect, useState } from 'react';

export const useMasterPage = () => {
  const [masterPage, setMasterPage] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setMasterPage(document.getElementById('masterPage'));
  }, []);

  return masterPage;
};
