import React, {useState, useRef, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

export function ImageZoomInOut({imageUrl}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setScale((scale) => scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((scale) => scale - 0.1);
  };

  useEffect(() => {
    const image = imageRef.current;
    let isDragging = false;
    let prevPosition = {x: 0, y: 0};

    const handleMouseDown = (e) => {
      isDragging = true;
      prevPosition = {x: e.clientX, y: e.clientY};
      console.log('down');
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = {x: e.clientX, y: e.clientY};
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    const handleMouseUp = () => {
      isDragging = false;
      setPosition({...prevPosition});
    };

    image?.addEventListener('mousedown', handleMouseDown);
    image?.addEventListener('mousemove', handleMouseMove);
    image?.addEventListener('mouseup', handleMouseUp);

    return () => {
      image?.removeEventListener('mousedown', handleMouseDown);
      image?.removeEventListener('mousemove', handleMouseMove);
      image?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [imageRef, scale]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="btn-container">
        <button onClick={handleZoomIn}>
          <span className="material-symbols-outlined">add</span>
        </button>
        <button onClick={handleZoomOut}>
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>

      <img
        ref={imageRef}
        src={imageUrl.url}
        alt={imageUrl.altText}
        style={{
          // width: "50vw",
          // height: "auto",
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: 'move',
        }}
        draggable={false}
      />
    </div>
  );
}
