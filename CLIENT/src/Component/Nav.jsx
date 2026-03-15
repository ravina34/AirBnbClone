import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

// Icons
import { FiSearch, FiLogOut, FiPlusCircle, FiList, FiBookOpen } from "react-icons/fi";
import { GiHamburgerMenu, GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdWhatshot, MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";

// Contexts
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';

const categories = [
    { id: 'trending', label: 'Trending', icon: MdWhatshot },
    { id: 'villa', label: 'Villa', icon: GiFamilyHouse },
    { id: 'farmHouse', label: 'Farm House', icon: FaTreeCity },
    { id: 'poolHouse', label: 'Pool House', icon: MdOutlinePool },
    { id: 'rooms', label: 'Rooms', icon: MdBedroomParent },
    { id: 'flat', label: 'Flat', icon: BiBuildingHouse },
    { id: 'pg', label: 'PG', icon: IoBedOutline },
    { id: 'cabin', label: 'Cabins', icon: GiWoodCabin },
    { id: 'shops', label: 'Shops', icon: SiHomeassistantcommunitystore },
];

function Nav() {
    const [showpopup, setShowpopup] = useState(false);
    const [cate, setCate] = useState('trending');
    const [input, setInput] = useState("");
    
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);
    const { listingData, setNewListData, searchData, handleSearch, handleViewCard } = useContext(listingDataContext);

    const handleLogOut = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
            setUserData(null);
            setShowpopup(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleCategory = (categoryId) => {
        setCate(categoryId);
        if (categoryId === "trending") {
            setNewListData(listingData);
        } else {
            setNewListData(listingData.filter((list) => list.category === categoryId));
        }
    };

    const handleSearchItemClick = (id) => {
        if (userData) {
            handleViewCard(id);
            setInput(""); // Clear search after selection
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        handleSearch(input);
    }, [input]);

    return (
        <nav className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200'>
            {/* Top Bar */}
            <div className='max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4'>
                
                {/* Logo */}
                <div className='flex-shrink-0 cursor-pointer' onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" className='w-28 md:w-32 object-contain' />
                </div>

                {/* Desktop Search */}
                <div className='hidden md:flex flex-1 max-w-md relative group'>
                    <input 
                        type="text" 
                        className='w-full pl-6 pr-14 py-3 bg-gray-50 border border-gray-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md'
                        placeholder='Search destinations...'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <button className='absolute right-2 top-1.5 p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors'>
                        <FiSearch size={18} />
                    </button>
                    
                    {/* Search Results Dropdown */}
                    {input && searchData?.length > 0 && (
                        <div className='absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto'>
                            {searchData.map((item) => (
                                <div 
                                    key={item._id}
                                    onClick={() => handleSearchItemClick(item._id)}
                                    className='px-5 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors'
                                >
                                    <p className='font-medium text-gray-800'>{item.title}</p>
                                    <p className='text-xs text-gray-500'>{item.landMark}, {item.city}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className='flex items-center gap-3'>
                    <button 
                        onClick={() => navigate("/listingpage1")}
                        className='hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-gray-100 transition-colors'
                    >
                        List your home
                    </button>

                    <div className='relative'>
                        <button 
                            onClick={() => setShowpopup(!showpopup)}
                            className='flex items-center gap-3 p-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow bg-white'
                        >
                            <GiHamburgerMenu className='ml-1 text-gray-600' />
                            {userData ? (
                                <div className='w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold'>
                                    {userData?.name?.slice(0, 1).toUpperCase()}
                                </div>
                            ) : (
                                <CgProfile size={28} className='text-gray-500' />
                            )}
                        </button>

                        {/* User Menu Popup */}
                        {showpopup && (
                            <>
                                <div className='fixed inset-0 z-10' onClick={() => setShowpopup(false)}></div>
                                <div className='absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200'>
                                    {!userData ? (
                                        <button onClick={() => {navigate("/login"); setShowpopup(false)}} className='w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors'>Login / Sign up</button>
                                    ) : (
                                        <button onClick={handleLogOut} className='w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2'>
                                            <FiLogOut /> Logout
                                        </button>
                                    )}
                                    <div className='h-[1px] bg-gray-100 my-1'></div>
                                    <MenuLink icon={<FiPlusCircle />} label="List your home" onClick={() => navigate("/listingpage1")} />
                                    <MenuLink icon={<FiList />} label="My Listings" onClick={() => navigate("/mylisting")} />
                                    <MenuLink icon={<FiBookOpen />} label="My Bookings" onClick={() => navigate("/mybooking")} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className='md:hidden px-4 pb-4'>
                <div className='relative'>
                    <input 
                        type="text" 
                        className='w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm'
                        placeholder='Where to?'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <FiSearch className='absolute left-3 top-3 text-gray-400' />
                </div>
            </div>

            {/* Category Filter */}
            <div className='flex items-center gap-8 px-6 overflow-x-auto no-scrollbar bg-white border-t border-gray-100 justify-start md:justify-center py-2'>
                {categories.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleCategory(item.id)}
                        className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all duration-300 hover:text-black ${
                            cate === item.id ? 'border-black text-black opacity-100' : 'border-transparent text-gray-500 opacity-70 hover:opacity-100'
                        }`}
                    >
                        <item.icon size={24} />
                        <span className='text-xs font-medium whitespace-nowrap'>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

// Helper Component for Menu Links
const MenuLink = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className='w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-3'
    >
        <span className='text-gray-400'>{icon}</span>
        {label}
    </button>
);

export default Nav;