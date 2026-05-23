import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useProductsPresenter } from '../Presenter/ProductsPresenter';
import { useCartModel } from '../../Cart/Model/CartContext';
import { useWishlist } from '../../Wishlist/Model/WishlistContext';

function ProductsView() {
  const navigate = useNavigate();
  const {
    user, loading, filteredProducts, searchTerm, selectedCategory, categories,
    setSearchTerm, setSelectedCategory
  } = useProductsPresenter();
  const { addToCart } = useCartModel();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar user={user} />
        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[1200px] px-6 py-10">
            <h1 className="text-brand-dark dark:text-slate-100 text-4xl font-black mb-8">All Products</h1>
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Search</h3>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full p-3 rounded-lg border border-brand-soft focus:ring-primary dark:bg-brand-dark dark:border-brand-medium"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50 transition-all">
                        <div 
                          className="aspect-square bg-brand-soft overflow-hidden relative group/image cursor-pointer"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <img className="w-full h-full object-cover transition-transform group-hover/image:scale-105" src={product.image_url} alt={product.name} />
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product); }}
                            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-red-500 shadow-sm transition-all hover:scale-110"
                          >
                            <span className="material-symbols-outlined text-sm">{isInWishlist(product.id) ? 'favorite' : 'favorite_border'}</span>
                          </button>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                          <p className="text-xs text-brand-light font-bold uppercase tracking-wider">{product.category}</p>
                          <h4 
                            onClick={() => navigate(`/products/${product.id}`)} 
                            className="text-brand-dark dark:text-white font-bold text-sm cursor-pointer hover:text-primary transition-colors"
                          >
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-brand-dark dark:text-white font-black text-lg">₱{product.price}</span>
                            <button onClick={() => addToCart(product)} className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors">
                              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-brand-light">No products found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProductsView;
