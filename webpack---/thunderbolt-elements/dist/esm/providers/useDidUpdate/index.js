import { useEffect, useRef } from 'react';
/* Triggers the received callback any time the deps change,
  not including first render (unlike React.useEffect) */
export const useDidUpdate = (cb, deps) => {
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (!isFirstRender.current) {
            cb();
        }
        isFirstRender.current = false;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps);
};
//# sourceMappingURL=index.js.map