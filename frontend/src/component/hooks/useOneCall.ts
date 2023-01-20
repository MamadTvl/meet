import { useEffect, useRef } from 'react';

const useOneCall = (cb: () => void, conditions: any[] = [true]) => {
    const isCalledRef = useRef(false);
    useEffect(() => {
        const canCall = conditions.reduce((prv, current) => !!prv && !!current);
        console.log(canCall, isCalledRef.current);
        if (canCall && !isCalledRef.current) {
            cb();
            isCalledRef.current = true;
        }
        return () => {
            // isCalledRef.current = false;
        };
    }, [cb, conditions, isCalledRef]);
};

export default useOneCall;
