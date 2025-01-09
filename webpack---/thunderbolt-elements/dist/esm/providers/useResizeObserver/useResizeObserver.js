import { useEffect } from 'react';
/** Hook to listen to component size change
 * @param object of: {
 *  callback: ResizeObserverCallback
 *  ref: RefObject<any>,
 * }
 */
export const useResizeObserver = ({ callback, ref, elem, }) => {
    useEffect(() => {
        const observer = new ResizeObserver(callback);
        if (ref?.current) {
            observer.observe(ref.current);
        }
        if (elem) {
            observer.observe(elem);
        }
        return () => {
            observer.disconnect();
        };
    }, [ref, elem, callback]);
};
//# sourceMappingURL=useResizeObserver.js.map