import { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { localProducts } from '../data/products';

const TECH_CATEGORIES = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];

export default function ProductList() {
  const { cart, dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchTechFromDummyJSON = async () => {
    // 1-bosqich: To'g'ridan-to'g'ri faqat texnika toifalarini so'rash
    const endpoints = [
      'https://dummyjson.com/products/category/smartphones',
      'https://dummyjson.com/products/category/laptops',
      'https://dummyjson.com/products/category/tablets',
      'https://dummyjson.com/products/category/mobile-accessories',
    ];

    const results = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url).then((res) => {
          if (!res.ok) throw new Error(`HTTP: ${res.status}`);
          return res.json();
        })
      )
    );

    const techList = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.products) {
        techList.push(...r.value.products);
      }
    }

    if (techList.length > 0) {
      return techList;
    }

    // 2-bosqich: Kengaytirilgan ro'yxatdan faqat texnikalarni filtrlash
    const res = await fetch('https://dummyjson.com/products?limit=100');
    if (!res.ok) throw new Error(`HTTP: ${res.status}`);
    const data = await res.json();
    const filtered = (data.products || []).filter((p) =>
      TECH_CATEGORIES.includes(p.category) ||
      p.category.includes('phone') ||
      p.category.includes('laptop') ||
      p.category.includes('tablet')
    );

    if (filtered.length > 0) return filtered;
    throw new Error("Texnika toifasidagi mahsulotlar topilmadi");
  };

  const loadData = () => {
    setLoading(true);
    setErrorMessage('');

    fetchTechFromDummyJSON()
      .then((items) => {
        setProducts(items);
        setIsUsingFallback(false);
      })
      .catch((err) => {
        console.warn("DummyJSON yuklanmadi, zaxira texnikalar yuklanmoqda:", err);
        setErrorMessage(
          err.message === 'Failed to fetch'
            ? "Tarmoq/AdBlock DummyJSON'ni blokladi"
            : err.message
        );
        setProducts(localProducts);
        setIsUsingFallback(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    fetchTechFromDummyJSON()
      .then((items) => {
        if (!isMounted) return;
        setProducts(items);
        setIsUsingFallback(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("DummyJSON yuklanmadi, zaxira texnikalar yuklanmoqda:", err);
        setErrorMessage(
          err.message === 'Failed to fetch'
            ? "Tarmoq/AdBlock DummyJSON'ni blokladi"
            : err.message
        );
        setProducts(localProducts);
        setIsUsingFallback(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getProductQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Dinamik toifalar ro'yxati (faqat texnika toifalari)
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  // Qidiruv va toifa filtri
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fallback Alert Banner */}
        {isUsingFallback && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-100 rounded-xl text-amber-700 text-lg">
                📱
              </span>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Zaxira texnikalar bazasi faollashtirildi {errorMessage ? `(${errorMessage})` : ''}
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Tarmoq yoki brauzer DummyJSON'ni cheklagani sababli telefon va kompyuterlar lokal bazadan yuklandi.
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              type="button"
              className="self-start sm:self-center px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              DummyJSON'ga qayta urinish
            </button>
          </div>
        )}

        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 shadow-xs border bg-white">
              {isUsingFallback ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Lokal Gadjetlar Bazasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  DummyJSON Texnika API (Onlayn)
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Texnika & Gadjetlar Katalogi
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Eng so'nggi smartfonlar, noutbuklar, planshetlar va aqlli qurilmalar
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Smartfon yoki noutbuk qidirish..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        {!loading && categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat === 'all'
                  ? 'Barcha texnikalar'
                  : cat === 'smartphones'
                  ? '📱 Smartfonlar'
                  : cat === 'laptops'
                  ? '💻 Noutbuklar'
                  : cat === 'tablets'
                  ? '📟 Planshetlar'
                  : cat === 'audio'
                  ? '🎧 Quloqchinlar'
                  : cat === 'gaming'
                  ? '🎮 O\'yin konsollari'
                  : cat === 'smartwatches'
                  ? '⌚ Aqlli soatlar'
                  : cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs animate-pulse flex flex-col space-y-4"
              >
                <div className="h-56 bg-gray-200 rounded-t-2xl w-full" />
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-md w-full" />
                    <div className="h-3 bg-gray-200 rounded-md w-4/5" />
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded-md w-16" />
                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Texnika topilmadi
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              "{searchTerm}" qidiruvi bo'yicha mahsulot topilmadi.
            </p>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const quantityInCart = getProductQuantity(product.id);
              const productImage = product.thumbnail || product.image || product.images?.[0];

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Standardized Image Container */}
                  <div className="relative h-56 w-full bg-slate-50/70 border-b border-gray-100/80 p-6 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={productImage}
                      alt={product.title}
                      className="max-h-40 max-w-[85%] w-auto h-auto object-contain drop-shadow-sm group-hover:scale-108 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-gray-700 shadow-xs uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>

                    {/* Rating badge */}
                    {product.rating && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-50/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-amber-700 font-bold text-xs shadow-xs">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                    )}

                    {/* Quantity in cart badge */}
                    {quantityInCart > 0 && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        Savatda: {quantityInCart}
                      </div>
                    )}
                  </div>

                  {/* Standardized Content Container */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="h-11 line-clamp-2 text-sm sm:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <p className="h-9 line-clamp-2 text-xs text-gray-500 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-3">
                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">
                          Narxi
                        </span>
                        <span className="text-lg font-black text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          dispatch({ type: 'ADD_TO_CART', payload: product })
                        }
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium text-xs transition-all shadow-sm shadow-indigo-200 cursor-pointer whitespace-nowrap"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Savatga
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
