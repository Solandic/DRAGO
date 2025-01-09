import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

export type IMegaMenuContextValue = {
  isOpen: boolean | undefined;
  setIsOpen: (isOpen: boolean) => void;
  labelRef?: React.MutableRefObject<HTMLAnchorElement | HTMLDivElement | null>;
};

export const MegaMenuContext = createContext<IMegaMenuContextValue>({
  isOpen: undefined,
  setIsOpen: () => {},
});

export const useMegaMenuContext = () => useContext(MegaMenuContext);

export const MegaMenuContextProvider: React.FC<
  PropsWithChildren<IMegaMenuContextValue>
> = ({ children, isOpen, setIsOpen, labelRef }) => {
  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      labelRef,
    }),
    [isOpen, setIsOpen, labelRef],
  );

  return (
    <MegaMenuContext.Provider value={contextValue}>
      {children}
    </MegaMenuContext.Provider>
  );
};
