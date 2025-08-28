import React from 'react';

// Simple SVG shapes for the background
const BookShape = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M6,4H11V12L8.5,10.5L6,12V4Z"></path></svg>;
const CapShape = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"></path></svg>;

const BackgroundAnimations = () => {
    const items = Array.from({ length: 30 }, (_, i) => {
        const Shape = Math.random() > 0.5 ? BookShape : CapShape;
        const size = Math.random() * 30 + 20; // size between 20 and 50
        return { Shape, size, id: i };
    });

    return (
        <div className="background-shapes">
            {items.map(item => (
                <div 
                    key={item.id} 
                    className="shape-container"
                    style={{ 
                        '--size': `${item.size}px`,
                        '--delay': `${Math.random() * -20}s`,
                        '--duration': `${Math.random() * 20 + 15}s`, // 15s to 35s
                        '--start-opacity': Math.random() * 0.2, // 0 to 0.2
                        '--x-dir': `${(Math.random() - 0.5) * 400}px`, // horizontal drift
                        top: `${Math.random() * 80 + 20}%`, // Start lower on the page
                        left: `${Math.random() * 100}%`,
                     }}
                >
                    <item.Shape />
                </div>
            ))}
        </div>
    );
};

export default BackgroundAnimations;