import React, { useState } from 'react';
import { useGetCardsQuery } from './services/pokemonTcgApi';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const { data, error, isLoading, isFetching } = useGetCardsQuery({
    page,
    pageSize: 12,
    q: queryTerm ? `name:${queryTerm}*` : '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm);
    setPage(1);
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
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-4 py-4 bg-white border border-gray-100 rounded-full shadow-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all text-lg font-medium"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="text-center text-red-500 py-10 font-semibold bg-red-50 rounded-2xl mx-auto max-w-lg border border-red-100">
            Error loading Pokémon data. Please try again.
          </div>
        ) : isLoading || isFetching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-red-100 border-t-red-500 shadow-sm"></div>
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
                onClick={() => setSelectedCard(card)}
                className="bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex flex-col items-center border border-gray-50 cursor-pointer overflow-hidden group"
              >
                <div className="w-full aspect-[3/4] relative mb-5 flex justify-center items-center">
                  <img 
                    src={card.images.small} 
                    alt={card.name} 
                    className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" 
                    loading="lazy"
                  />
                </div>
                <h2 className="text-xl font-extrabold text-gray-800 tracking-wide text-center w-full truncate mb-2">
                  {card.name}
                </h2>
                
                <div className="mt-auto flex items-center justify-between w-full opacity-90 text-xs font-bold px-1">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full tracking-wider uppercase text-[10px]">
                    {card.supertype}
                  </span>
                  {card.hp && (
                    <span className="text-red-600 bg-red-50 px-3 py-1.5 rounded-full tracking-wider">
                      HP {card.hp}
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
              className="p-4 rounded-full bg-white shadow-md text-gray-600 border border-gray-50 hover:text-red-500 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
              className="p-4 rounded-full bg-white shadow-md text-gray-600 border border-gray-50 hover:text-red-500 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative cursor-default"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-colors z-10 cursor-pointer"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>

            {/* Modal Image */}
            <div className="md:w-1/2 p-8 bg-gray-50 flex items-center justify-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
              <img 
                src={selectedCard.images.large} 
                alt={selectedCard.name} 
                className="w-full max-w-sm h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Modal Stats */}
            <div className="md:w-1/2 p-8 flex flex-col text-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedCard.name}</h2>
                  <div className="flex gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                    <span>{selectedCard.supertype}</span>
                    {selectedCard.subtypes && <span>• {selectedCard.subtypes.join(', ')}</span>}
                  </div>
                </div>
                {selectedCard.hp && (
                  <div className="text-2xl font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    HP {selectedCard.hp}
                  </div>
                )}
              </div>

              {/* Types */}
              {selectedCard.types && (
                <div className="flex gap-2 mb-6">
                  {selectedCard.types.map(t => (
                    <span key={t} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100 mb-6" />

              {/* Abilities */}
              {selectedCard.abilities && selectedCard.abilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Abilities</h3>
                  <div className="space-y-4">
                    {selectedCard.abilities.map((ability, idx) => (
                      <div key={idx} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div className="font-heading font-bold text-blue-900 mb-1 flex items-center gap-2">
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase">
                            {ability.type}
                          </span>
                          {ability.name}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{ability.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attacks */}
              {selectedCard.attacks && selectedCard.attacks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Attacks</h3>
                  <div className="space-y-4">
                    {selectedCard.attacks.map((attack, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-heading font-bold text-gray-900 flex items-center gap-2">
                            {attack.name}
                          </div>
                          {attack.damage && <span className="font-black text-gray-700 text-lg">{attack.damage}</span>}
                        </div>
                        {attack.text && <p className="text-sm text-gray-500 leading-relaxed mb-2">{attack.text}</p>}
                        <div className="flex gap-1">
                          {attack.cost && attack.cost.map((cost, cIdx) => (
                            <div key={cIdx} className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                              {cost.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weakness & Rules */}
              <div className="mt-auto pt-6 grid grid-cols-2 gap-4 text-sm">
                  {selectedCard.weaknesses && (
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                      <span className="block text-xs font-bold text-red-400 uppercase mb-1">Weakness</span>
                      <span className="font-bold text-red-700">
                        {selectedCard.weaknesses[0].type} {selectedCard.weaknesses[0].value}
                      </span>
                    </div>
                  )}
                  {selectedCard.retreatCost && (
                    <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 text-center">
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Retreat Cost</span>
                      <div className="flex justify-center gap-1">
                        {selectedCard.retreatCost.map((_, i) => (
                           <div key={i} className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center text-[8px]">★</div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
