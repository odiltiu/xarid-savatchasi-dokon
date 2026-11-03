import { useEffect } from 'react';
import { useCart, maxQuantity } from '../Context/CartContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, dispatch, totalPrice, totalItems } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                <svg
                  className="w-5 h-5"
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
              </div>
              <div>
                <h3 id="cart-title" className="text-xl font-bold text-gray-900">Savatcha</h3>
                <p className="text-xs text-gray-500">
                  {totalItems > 0
                    ? `${totalItems} ta mahsulot tanlangan`
                    : "Savat bo'sh"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              aria-label="Savatni yopish"
              autoFocus
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800">
                  Savatchangiz bo'sh
                </h4>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                  Mahsulotlar katalogidan o'zingizga ma'qul mahsulotni tanlang va
                  savatga qo'shing.
                </p>
                <button
                  onClick={onClose}
                  type="button"
                  className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-100 cursor-pointer"
                >
                  Xarid qilishni boshlash
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    {/* Item info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-gray-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.thumbnail || item.image}
                          alt={item.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${Number(item.price).toFixed(2)} / dona
                        </p>
                        <p className="text-xs font-bold text-indigo-600 sm:hidden mt-0.5">
                          Jami: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREASE_QUANTITY",
                            payload: item.id,
                          })
                        }
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Kamaytirish"
                        aria-label={`${item.title} sonini kamaytirish`}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREASE_QUANTITY",
                            payload: item.id,
                          })
                        }
                        disabled={item.quantity >= maxQuantity(item)}
                        aria-label={`${item.title} sonini ko'paytirish`}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Ko'paytirish"
                      >
                        +
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right hidden sm:block w-24">
                      <span className="text-sm font-bold text-gray-900 block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: item.id,
                        })
                      }
                      type="button"
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="O'chirish"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-gray-50/80 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-500 font-medium">Umumiy narx:</span>
                <span className="text-2xl font-black text-indigo-950">
                  ${Number(totalPrice.toFixed(2)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                  type="button"
                  className="px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Tozalash
                </button>
                <button
                  onClick={() => {
                    alert("Buyurtmangiz qabul qilindi! Savat tozalandi.");
                    dispatch({ type: "CLEAR_CART" });
                    onClose();
                  }}
                  type="button"
                  className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold tracking-wide shadow-md shadow-indigo-200 transition-all cursor-pointer text-center"
                >
                  Buyurtma berish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
