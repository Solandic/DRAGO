import * as React from 'react';
import classNames from 'clsx';
import type { ZoomedImageProps } from '../ZoomedImage.types';
import Image from '../../Image/viewer/Image';
import styles from './style/zoomedImage.scss';
import ZoomIn from './assets/zoom-in.svg';
import {
  handleKeyDown,
  handleButtonKeyDown,
  toggleKeyboardZoom,
} from './ZoomedImageUtils';
import { TestIds } from '../constants';

const CANCEL_ZOOM_TIMEOUT = 1200;
let tick: boolean = false,
  moveX: number,
  moveY: number,
  zoomTimer: ReturnType<typeof setTimeout>;

const ZoomedImage: React.FC<ZoomedImageProps> = props => {
  const {
    width: imageWidth,
    height: imageHeight,
    className: skinStyle,
    magnifyKeyboardOperabilityEnabled,
    translations,
    zoomedImageResponsiveOverride,
  } = props;

  const [isZoomed, setIsZoomed] = React.useState(false);
  const [positionOnZoomedImage, setPosition] = React.useState({ x: 0, y: 0 });
  const useRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isZoomedByKeyboard, setIsZoomedByKeyboard] = React.useState(false);

  const handleBlur = () => setIsZoomedByKeyboard(false);

  const toggleZoom = (ev: React.MouseEvent) => {
    const event = ev.nativeEvent;

    if (isZoomed) {
      setIsZoomed(false);
    } else if (!isZoomed && event && event.type === 'click') {
      setIsZoomed(true);

      const { offsetX, offsetY } = getCoordinatesOnTarget(
        event.clientX,
        event.clientY,
      );
      const { x, y } = getCoordinatesOnFullImage(offsetX, offsetY);
      setPosition({ x, y });
    }
  };

  const waitBeforeZoomOut = (ev: React.MouseEvent) => {
    zoomTimer = setTimeout(() => toggleZoom(ev), CANCEL_ZOOM_TIMEOUT);
  };

  const clearZoomTimer = () => {
    clearTimeout(zoomTimer);
  };

  const getCoordinatesOnFullImage = (x: number, y: number) => {
    const CONTAINER_WIDTH = useRef.current!.offsetWidth;
    const CONTAINER_HEIGHT = useRef.current!.offsetHeight;

    const percentageOffsetX = x / CONTAINER_WIDTH;
    const percentageOffsetY = y / CONTAINER_HEIGHT;

    return {
      x: percentageOffsetX * (imageWidth - CONTAINER_WIDTH),
      y: percentageOffsetY * (imageHeight - CONTAINER_HEIGHT),
    };
  };

  const getCoordinatesOnTarget = (clientX: number, clientY: number) => {
    const measurements = useRef.current!.getBoundingClientRect();

    return {
      offsetX: clientX - measurements.left,
      offsetY: clientY - measurements.top,
    };
  };

  const requestTick = (ev: React.MouseEvent) => {
    const event = ev.nativeEvent;

    const { offsetX, offsetY } = getCoordinatesOnTarget(
      event.clientX,
      event.clientY,
    );
    ({ x: moveX, y: moveY } = getCoordinatesOnFullImage(offsetX, offsetY));

    if (!tick) {
      requestAnimationFrame(drag);
    }
    tick = true;
  };

  const drag = () => {
    setPosition({ x: moveX, y: moveY });
    tick = false;
  };

  const zoomedInEventsHandlers = {
    onMouseLeave: waitBeforeZoomOut,
    onMouseEnter: clearZoomTimer,
    onMouseMove: requestTick,
  };
  let imageInlineStyles = {};
  if (isZoomed && !isZoomedByKeyboard) {
    imageInlineStyles = {
      transform: `translate(-${positionOnZoomedImage.x}px, -${positionOnZoomedImage.y}px)`,
      transitionTimingFunction: 'ease-out',
      transitionDuration: '0.2s',
      willChange: 'transform',
    };
  } else if (isZoomedByKeyboard && !isZoomed) {
    imageInlineStyles = {
      transform: `translate(${positionOnZoomedImage.x}px, ${positionOnZoomedImage.y}px)`,
      transition: 'transform 0.3s ease',
      willChange: 'transform',
    };
  }

  const handlers = isZoomed
    ? { onClick: toggleZoom, ...zoomedInEventsHandlers }
    : { onClick: toggleZoom };

  const zoomedOverrides =
    isZoomed || isZoomedByKeyboard
      ? {
          targetWidth: props.width,
          targetHeight: props.height,
          skipMeasure: true,
          zoomedImageResponsiveOverride,
        }
      : {
          skipMeasure: false,
        };

  return (
    <div
      {...handlers}
      className={classNames(
        styles.container,
        `${isZoomed ? styles.zoomOut : styles.zoomIn}`,
      )}
      ref={useRef}
      onKeyDown={event =>
        handleKeyDown(event, isZoomedByKeyboard, setPosition, useRef, {
          width: imageWidth,
          height: imageHeight,
        })
      }
      onBlur={handleBlur}
      tabIndex={0}
    >
      <Image
        {...props}
        className={skinStyle}
        imageStyles={imageInlineStyles}
        {...zoomedOverrides}
      />
      {magnifyKeyboardOperabilityEnabled && (
        <button
          className={styles.zoomButton}
          data-testid={TestIds.zoomButton}
          aria-label={translations?.zoomInButtonAriaLabel}
          aria-pressed={isZoomedByKeyboard}
          onClick={() =>
            toggleKeyboardZoom(
              isZoomedByKeyboard,
              setIsZoomedByKeyboard,
              setPosition,
            )
          }
          onKeyDown={event =>
            handleButtonKeyDown(
              // @ts-expect-error
              event,
              () =>
                toggleKeyboardZoom(
                  isZoomedByKeyboard,
                  setIsZoomedByKeyboard,
                  setPosition,
                ),
              () => setIsZoomedByKeyboard(false),
            )
          }
          ref={buttonRef}
        >
          <ZoomIn />
        </button>
      )}
    </div>
  );
};

export default ZoomedImage;
