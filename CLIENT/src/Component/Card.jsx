import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegCircle } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";

// Contexts
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import { bookingDataContext } from '../Context/BookingContext';

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host }) {
    const navigate = useNavigate();
    const { userData } = useContext(userDataContext);
    const { handleViewCard } = useContext(listingDataContext);
    const { cancelBooking } = useContext(bookingDataContext);
    
    const [popUp, setPopUp] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const images = [image1, image2, image3];

    const handleClick = (e) => {
        // Evitar que el click se dispare si estamos interactuando con el popup de cancelación
        if (popUp) return;
        
        if (userData) {
            handleViewCard(id);
        } else {
            navigate("/login");
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation(); // Evita que navegue al detalle al hacer click en cancelar
        setPopUp(true);
    };

    return (
        <div 
            className='group flex flex-col gap-3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300'
            onClick={!isBooked ? handleClick : undefined}
        >
            {/* Contenedor de Imagen con Overlay de Estado */}
            <div className='relative aspect-[11/10] w-full rounded-2xl overflow-hidden shadow-sm'>
                
                {/* Carrusel de Imágenes Simple */}
                <div className='flex w-full h-full overflow-hidden'>
                    <img 
                        src={images[currentImg]} 
                        alt={title} 
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                    />
                </div>

                {/* Badges de Estado */}
                <div className='absolute top-3 left-3 flex flex-col gap-2'>
                    {isBooked && (
                        <div className='flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-emerald-600 font-bold text-xs uppercase tracking-wider'>
                            <GiConfirmed size={16} />
                            Booked
                        </div>
                    )}
                </div>

                {/* Botón Cancelar (Solo para el Host) */}
                {isBooked && host === userData?._id && (
                    <button 
                        onClick={handleCancel}
                        className='absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 rounded-full text-rose-500 shadow-md transition-colors'
                    >
                        <MdCancel size={22} />
                    </button>
                )}

                {/* Modal de Confirmación de Cancelación */}
                {popUp && (
                    <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl p-5 shadow-2xl animate-in zoom-in duration-200 text-center'>
                            <p className='text-gray-800 font-semibold mb-4'>¿Cancelar esta reserva?</p>
                            <div className='flex gap-3 justify-center'>
                                <button 
                                    className='px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600'
                                    onClick={(e) => { e.stopPropagation(); cancelBooking(id); setPopUp(false); }}
                                >
                                    Sí, cancelar
                                </button>
                                <button 
                                    className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200'
                                    onClick={(e) => { e.stopPropagation(); setPopUp(false); }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Información del Destino */}
            <div className='flex flex-col gap-1 px-1'>
                <div className='flex justify-between items-start'>
                    <h3 className='font-bold text-gray-800 truncate text-[16px] leading-tight'>
                        {landMark}, {city}
                    </h3>
                    <div className='flex items-center gap-1.5'>
                        <FaStar className='text-rose-500' size={14} />
                        <span className='text-sm font-light text-gray-600'>{ratings}</span>
                    </div>
                </div>
                
                <p className='text-gray-500 text-sm truncate font-light'>
                    {title}
                </p>

                <div className='mt-1'>
                    <span className='font-bold text-gray-900 text-[16px]'>₹{rent}</span>
                    <span className='text-gray-500 font-light text-sm'> / noche</span>
                </div>
            </div>
        </div>
    );
}

export default Card;