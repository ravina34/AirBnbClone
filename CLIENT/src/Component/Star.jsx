import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

function Star({ starValue = 5, onRate }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <div className='flex items-center gap-1.5 p-2 bg-gray-50/50 rounded-full w-fit'>
            {[...Array(starValue)].map((_, index) => {
                const currentStarValue = index + 1;
                const isFilled = currentStarValue <= (hover || rating);
                const isHovered = currentStarValue <= hover;

                return (
                    <button
                        key={currentStarValue}
                        type="button"
                        className="focus:outline-none transition-transform duration-150 active:scale-90"
                        onClick={() => {
                            setRating(currentStarValue);
                            if (onRate) onRate(currentStarValue);
                        }}
                        onMouseEnter={() => setHover(currentStarValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <FaStar 
                            className={`
                                cursor-pointer text-2xl transition-all duration-300 ease-out
                                ${isFilled ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-gray-300"}
                                ${isHovered ? "scale-110" : "scale-100"}
                            `}
                        />
                    </button>
                );
            })}
            
            {/* Opcional: Indicador numérico moderno */}
            {rating > 0 && (
                <span className='ml-2 text-sm font-bold text-amber-600 animate-in fade-in slide-in-from-left-2'>
                    {rating}.0
                </span>
            )}
        </div>
    );
}

export default Star;