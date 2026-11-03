import { useState } from 'react';
import { CartProvider } from './Context/CartContext';
import CartNavbar from './components/CartNavbar';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
        {/* Navbar */}
        <CartNavbar onOpenCart={() => setIsCartOpen(true)} />

        {/* Asosiy kontent */}
        <main className="flex-1">
          <ProductList />
        </main>

        {/* Savat modali */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
          <p>© 2026 TechStore Shopping Cart • 4-oy 2-dars 3-topshiriq</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
