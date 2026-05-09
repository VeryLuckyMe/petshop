import { useState, useEffect } from 'react';
import { ProductsModel } from '../Model/ProductsModel';

export const useProductsPresenter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Nutrition', 'Toys', 'Bedding', 'Accessories'];

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await ProductsModel.getSession();
      if (session) setUser(session.user);
      
      const { data, error } = await ProductsModel.getAllProducts();
      if (!error && data) {
        setProducts(data);
        setFilteredProducts(data);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'All') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return {
    user, loading, filteredProducts, searchTerm, selectedCategory, categories,
    setSearchTerm, setSelectedCategory
  };
};
