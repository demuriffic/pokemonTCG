import React, { useState, useRef, useEffect } from 'react';
import { useGetCardsQuery } from './services/pokemonTcgApi';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [clickedCardId, setClickedCardId] = useState(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const modalRef = useRef(null);
  const rafId = useRef(null);

  const { data, error, isLoading, isFetching } = useGetCardsQuery({
    page,
    pageSize: 12,
    q: queryTerm ? `name:${queryTerm}*` : '',
  });

  const handleCardClick = (card) => {
    setClickedCardId(card.id);
    setTimeout(() => {
      setSelectedCard(card);
      setClickedCardId(null);
    }, 200);
  };

  const handleMouseMove = (e) => {
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    const rotationX = -deltaY * 15;
    const rotationY = deltaX * 15;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      setRotateX(rotationX);
      setRotateY(rotationY);
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm);
    setPage(1);
  };

  const getTypeColor = (type) => {
    const typeColors = {
      'Fire': 'text-red-600 bg-red-50',
      'Water': 'text-blue-600 bg-blue-50',
      'Lightning': 'text-yellow-600 bg-yellow-50',
      'Grass': 'text-green-600 bg-green-50',
      'Ice': 'text-cyan-600 bg-cyan-50',
      'Fighting': 'text-orange-800 bg-orange-50',
      'Poison': 'text-purple-600 bg-purple-50',
      'Ground': 'text-amber-700 bg-amber-50',
      'Flying': 'text-sky-600 bg-sky-50',
      'Psychic': 'text-pink-600 bg-pink-50',
      'Bug': 'text-lime-600 bg-lime-50',
      'Rock': 'text-gray-600 bg-gray-50',
      'Ghost': 'text-indigo-600 bg-indigo-50',
      'Dragon': 'text-violet-600 bg-violet-50',
      'Dark': 'text-slate-700 bg-slate-50',
      'Steel': 'text-zinc-600 bg-zinc-50',
      'Fairy': 'text-fuchsia-600 bg-fuchsia-50',
    };
    return typeColors[type] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-gray-800 relative">
      <main className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Header / Search Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <h1 className="font-branding text-4xl font-extrabold tracking-tight text-gray-900">Pokédex</h1>
          </div>
          
          <form onSubmit={handleSearch} className="w-full max-w-lg relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-red-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-4 py-4 bg-white border border-gray-100 rounded-full shadow-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-700/50 transition-all text-lg font-medium"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="text-center text-red-700 py-10 font-semibold bg-red-100 rounded-2xl mx-auto max-w-lg border border-red-200">
            Error loading Pokémon data. Please try again.
          </div>
        ) : isLoading || isFetching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-red-200 border-t-red-700 shadow-sm"></div>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-medium bg-white shadow-sm rounded-2xl mx-auto max-w-lg border border-gray-100">
            No Pokémon found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.data.map((card) => (
              <div 
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex flex-col items-center border border-gray-50 cursor-pointer overflow-hidden group ${
                  clickedCardId === card.id ? 'card-click-active' : ''
                }`}
              >
                <div className="w-full aspect-[3/4] relative mb-5 flex justify-center items-center">
                  <img 
                    src={card.images.small} 
                    alt={card.name} 
                    className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" 
                    loading="lazy"
                  />
                </div>

                <div className="w-full flex items-center justify-between mb-2">
                  <h2 className="text-lg font-extrabold text-gray-800 tracking-wide truncate flex-1">
                    {card.name}
                  </h2>
                  {card.cardmarket?.prices?.averageSellPrice && (
                    <span className="ml-2 text-sm font-bold text-red-700 whitespace-nowrap">
                      ${card.cardmarket.prices.averageSellPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="mt-auto flex items-center justify-between w-full opacity-90 text-xs font-bold px-1">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full tracking-wider uppercase text-[10px]">
                    {card.supertype}
                  </span>
                  {card.types && card.types.length > 0 && (
                    <span className={`px-3 py-1.5 rounded-full tracking-wider ${getTypeColor(card.types[0])}`}>
                      {card.types[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {data?.data && data.data.length > 0 && (
          <div className="mt-14 flex justify-center items-center space-x-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-4 rounded-full bg-white shadow-md text-gray-600 border border-gray-50 hover:text-red-700 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-extrabold text-gray-400 tracking-widest uppercase bg-white px-6 py-2 rounded-full shadow-sm">
              PAGE {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!data || data.data.length < 12}
              className="p-4 rounded-full bg-white shadow-md text-gray-600 border border-gray-50 hover:text-red-700 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      {selectedCard && (
        <div 
          className="modal-overlay-active fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedCard(null)}
          style={{ perspective: '1200px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={modalRef}
            className="modal-content-active modal-bg-gradient rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex items-center justify-center relative cursor-default transition-transform duration-0"
            onClick={(e) => e.stopPropagation()}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              willChange: 'transform',
              WebkitAcceleration: true
            }}
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-6 right-6 p-2.5 bg-white/80 hover:bg-red-700 text-gray-600 hover:text-white rounded-full transition-all duration-300 z-10 cursor-pointer hover:shadow-lg border border-gray-100 hover:border-red-700 backdrop-blur-sm active:scale-90"
            >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>

            {/* Modal Image */}
            <div className="modal-image-active p-8 relative">
              <div className="holographic-card relative">
                <img 
                  src={selectedCard.images.large} 
                  alt={selectedCard.name} 
                  className="w-auto h-[600px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
