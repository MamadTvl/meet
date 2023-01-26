import { useEffect } from 'react';
import React, { useCallback } from 'react';
import { calculateLayout } from '../../utils/layout';

interface Args {
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    videoCount: number;
}

const useCalculateCalculate = (args: Args) => {
    const { videoCount, containerRef } = args;
    const recalculateLayout = useCallback(() => {
        const headerHeight =
            document.getElementsByTagName('header')?.[0]?.offsetHeight;
        const aspectRatio = 16 / 9;

        const screenWidth = document.body.getBoundingClientRect().width;
        const screenHeight =
            document.body.getBoundingClientRect().height - headerHeight;
        
        const { width, height, cols } = calculateLayout(
            screenWidth,
            screenHeight,
            videoCount,
            aspectRatio,
        );
        console.log(width, height, cols);
        

        containerRef.current?.style?.setProperty('--width', width + 'px');
        containerRef.current?.style?.setProperty('--height', height + 'px');
        containerRef.current?.style?.setProperty('--cols', cols + '');
    }, [containerRef, videoCount]);

    useEffect(() => {
        recalculateLayout();
        window.addEventListener('resize', recalculateLayout);
        return () => {
            window.removeEventListener('resize', recalculateLayout);
        };
    }, [recalculateLayout]);
};

export default useCalculateCalculate;
