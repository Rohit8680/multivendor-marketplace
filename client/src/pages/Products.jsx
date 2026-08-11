import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { PackageX } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams({
          page,
          limit: 8,
          ...(search && { search }),
          ...(category && { category })
        }).toString();

        const { data } = await API.get(`/products?${query}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch marketplace products');
      }
    };
    fetchProducts();
  }, [search, category, page]);

  const handleSearchChange = (val) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (val) {
        params.set('search', val);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleCategorySelect = (catSlug) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (catSlug) {
        params.set('category', catSlug);
      } else {
        params.delete('category');
      }
      params.set('page', '1');
      return params;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      return params;
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header & Filters Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Explore Products
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Showing {totalProducts} items across independent vendors
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          background: 'var(--bg-card)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange('')}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleCategorySelect}
          />
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading message="Loading products catalog..." />
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0' }}>
          <PackageX size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.4rem' }}>No Products Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try adjusting your search criteria or category filter.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="btn btn-secondary btn-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-cards">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Products;
