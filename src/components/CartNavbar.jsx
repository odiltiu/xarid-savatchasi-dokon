import { useCart } from '../Context/CartContext';

export default function CartNavbar({ onOpenCart }) {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">TechStore</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Elektronika va gadjetlar</p>
          </div>
        </div>

        {/* Cart Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCart}
            type="button"
            className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all duration-200 font-medium cursor-pointer"
          >
            <div className="relative">
              <svg
                className="w-5 h-5 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                Savat
              </span>
              <span className="text-sm font-bold text-indigo-950">
                ${Number(totalPrice.toFixed(2)).toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
