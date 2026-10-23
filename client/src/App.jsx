// main application component
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UtilityBar from './components/UtilityBar';
import MainHeader from './components/MainHeader';
import CategoryNav from './components/CategoryNav';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import ProductsCatalog from './components/ProductsCatalog';
import TrustSection from './components/TrustSection';
import RecentNews from './components/RecentNews';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';

export default function App() {
  // api state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalRecords: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filter state
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompatible, setSelectedCompatible] = useState('');
  const [hasPartNumber, setHasPartNumber] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  // inquiry modal state
  const [inquiryProduct, setInquiryProduct] = useState(null);

  // catalog scroll ref
  const catalogRef = useRef(null);

  // load categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
  }, []);

  // fetch products with active filters
  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', '12');

    if (activeCategory) params.set('category', activeCategory);
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCompatible) params.set('compatibleBrand', selectedCompatible);
    if (hasPartNumber) params.set('hasPartNumber', hasPartNumber);
    if (sortBy) params.set('sortBy', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setProducts(data.data || []);
          setPagination(data.pagination || {});
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.message || 'Could not connect to the product database.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, activeCategory, searchTerm, selectedCompatible, hasPartNumber, sortBy]);

  // trigger fetch when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // event handlers
  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCompatibleChange = (brand) => {
    setSelectedCompatible(brand);
    setCurrentPage(1);
  };

  const handleHasPartNumberChange = (val) => {
    setHasPartNumber(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveCategory('');
    setSearchTerm('');
    setSelectedCompatible('');
    setHasPartNumber('');
    setSortBy('createdAt');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* utility top bar */}
      <UtilityBar onOpenInquiry={setInquiryProduct} />

      {/* header */}
      <MainHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onOpenInquiry={setInquiryProduct}
      />

      {/* category navigation */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* hero section */}
      <HeroSection
        onExploreCatalog={handleExploreCatalog}
        onOpenInquiry={setInquiryProduct}
      />

      {/* category cards */}
      <CategoryGrid
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* product catalog with filters and pagination */}
      <ProductsCatalog
        catalogRef={catalogRef}
        products={products}
        loading={loading}
        error={error}
        pagination={pagination}
        categories={categories}
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        selectedCompatible={selectedCompatible}
        hasPartNumber={hasPartNumber}
        sortBy={sortBy}
        onCategoryChange={handleCategorySelect}
        onSearchChange={handleSearchChange}
        onCompatibleChange={handleCompatibleChange}
        onHasPartNumberChange={handleHasPartNumberChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onPageChange={handlePageChange}
        onInquire={setInquiryProduct}
        onRetry={fetchProducts}
      />

      {/* trust and capabilities */}
      <TrustSection />

      {/* recent news */}
      <RecentNews />

      {/* footer */}
      <Footer
        categories={categories}
        onSelectCategory={handleCategorySelect}
        onOpenInquiry={setInquiryProduct}
      />

      {/* inquiry modal */}
      {inquiryProduct && (
        <InquiryModal
          product={inquiryProduct}
          onClose={() => setInquiryProduct(null)}
        />
      )}
    </div>
  );
}
