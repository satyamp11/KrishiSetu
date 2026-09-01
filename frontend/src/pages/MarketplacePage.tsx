import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ShieldCheck,
  Leaf,
  Package,
  Sparkles,
  X,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  Navbar,
  Footer,
  Button,
  Input,
  Select,
  Modal,
  Badge,
  ProductCard,
  LoadingState,
  SkeletonCard,
  EmptyState,
  ErrorState,
  useToast,
} from '../components/ui';
import { apiService, ProductItem, ProductCategory, ProductsFilterParams } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export interface MarketplacePageProps {
  onNavigateToProductDetail?: (productId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'All', label: 'All Produce', icon: '🌾' },
  { id: 'Vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'Fruits', label: 'Fruits', icon: '🍎' },
  { id: 'Grains', label: 'Grains', icon: '🌾' },
  { id: 'Pulses', label: 'Pulses', icon: '🫘' },
  { id: 'Spices', label: 'Spices', icon: '🌶️' },
  { id: 'Dairy', label: 'Dairy', icon: '🥛' },
  { id: 'Organic Products', label: 'Organic Products', icon: '🌿' },
  { id: 'Seeds', label: 'Seeds', icon: '🌱' },
  { id: 'Fertilizers', label: 'Fertilizers', icon: '🧪' },
  { id: 'Farm Equipment', label: 'Farm Equipment', icon: '🚜' },
];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onNavigateToProductDetail = () => {},
  onNavigateTab = () => {},
}) => {
  const { user, token, openAuthModal } = useAuth();
  const toast = useToast();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating' | 'stock'>('newest');

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Products Data State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Farmer Add/Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Vegetables' as ProductCategory,
    price: '',
    unit: 'kg',
    availableQuantity: '',
    minOrderQuantity: '1',
    description: '',
    imageUrl: '',
    fpoName: '',
    isVerifiedFPO: false,
    isOrganicCertified: false,
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Fetch Products from Backend API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ProductsFilterParams = {
        category: selectedCategory,
        search: searchQuery,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        organicOnly,
        verifiedOnly,
        sort: sortOption,
        page,
        limit,
      };

      const res = await apiService.getProducts(params);
      if (res.success) {
        setProducts(res.products);
        setTotal(res.total);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load products from database.');
      }
    } catch (err) {
      setError('Network error connecting to marketplace API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, organicOnly, verifiedOnly, sortOption, page]);

  // Open Product Modal for Add or Edit
  const handleOpenProductModal = (productToEdit?: ProductItem) => {
    if (!user) {
      toast.info('Authentication Required', 'Please sign in as a Farmer / FPO to post produce.');
      openAuthModal('login');
      return;
    }

    if (user.role !== 'farmer' && user.role !== 'admin') {
      toast.warning('Farmer Authorization Required', 'Only registered Farmers and FPOs can list produce.');
      return;
    }

    if (productToEdit) {
      setEditingProduct(productToEdit);
      setFormData({
        title: productToEdit.title,
        category: productToEdit.category,
        price: String(productToEdit.price),
        unit: productToEdit.unit,
        availableQuantity: String(productToEdit.availableQuantity),
        minOrderQuantity: String(productToEdit.minOrderQuantity || 1),
        description: productToEdit.description || '',
        imageUrl: productToEdit.imageUrl,
        fpoName: productToEdit.fpoName || '',
        isVerifiedFPO: productToEdit.isVerifiedFPO,
        isOrganicCertified: productToEdit.isOrganicCertified,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        category: 'Vegetables',
        price: '',
        unit: 'kg',
        availableQuantity: '',
        minOrderQuantity: '1',
        description: '',
        imageUrl: '',
        fpoName: user.farmInfo?.fpoName || '',
        isVerifiedFPO: !!user.farmInfo?.fpoName,
        isOrganicCertified: !!user.farmInfo?.organicCertified,
      });
    }

    setIsProductModalOpen(true);
  };

  // Submit Add or Edit Product Form
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.title.trim() || !formData.price || !formData.availableQuantity) {
      toast.error('Validation Error', 'Title, price, and available quantity are required.');
      return;
    }

    setFormLoading(true);
    try {
      if (editingProduct) {
        // Edit existing product
        const res = await apiService.updateProduct(token, editingProduct.id, {
          title: formData.title.trim(),
          category: formData.category,
          price: Number(formData.price),
          unit: formData.unit,
          availableQuantity: Number(formData.availableQuantity),
          minOrderQuantity: Number(formData.minOrderQuantity),
          description: formData.description,
          imageUrl: formData.imageUrl || undefined,
          fpoName: formData.fpoName,
          isVerifiedFPO: formData.isVerifiedFPO,
          isOrganicCertified: formData.isOrganicCertified,
        });

        if (res.success) {
          toast.success('Listing Updated', 'Produce listing updated successfully.');
          setIsProductModalOpen(false);
          fetchProducts();
        } else {
          toast.error('Update Failed', res.message || 'Unable to update listing.');
        }
      } else {
        // Create new product
        const res = await apiService.createProduct(token, {
          title: formData.title.trim(),
          category: formData.category,
          price: Number(formData.price),
          unit: formData.unit,
          availableQuantity: Number(formData.availableQuantity),
          minOrderQuantity: Number(formData.minOrderQuantity),
          description: formData.description,
          imageUrl: formData.imageUrl || undefined,
          fpoName: formData.fpoName,
          isVerifiedFPO: formData.isVerifiedFPO,
          isOrganicCertified: formData.isOrganicCertified,
          state: user?.state,
          district: user?.district,
          village: user?.village,
        });

        if (res.success) {
          toast.success('Listing Created', 'Produce published to Agricultural Marketplace!');
          setIsProductModalOpen(false);
          fetchProducts();
        } else {
          toast.error('Creation Failed', res.message || 'Unable to create listing.');
        }
      }
    } catch (err) {
      toast.error('Error', 'Network error submitting product form.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this produce listing?')) return;

    try {
      const res = await apiService.deleteProduct(token, productId);
      if (res.success) {
        toast.success('Listing Deleted', 'Produce item removed from marketplace.');
        fetchProducts();
      } else {
        toast.error('Delete Failed', res.message || 'Unable to delete listing.');
      }
    } catch (err) {
      toast.error('Error', 'Network error deleting product.');
    }
  };

  const isFarmer = user?.role === 'farmer' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar
        activeTab="marketplace"
        onNavigate={(tab) => onNavigateTab(tab)}
        user={user}
        onOpenAuth={(mode) => openAuthModal(mode)}
      />

      {/* Marketplace Header Hero */}
      <section className="bg-emerald-950 text-white py-10 border-b border-emerald-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  Phase 4: Agri Marketplace
                </Badge>
                <Badge variant="earth" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}>
                  Direct Intermediary Elimination
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Agricultural Produce Marketplace
              </h1>
              <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
                Direct trade connecting Indian Farmers & FPOs directly with Consumers and Bulk Buyers. Zero middleman margins.
              </p>
            </div>

            {isFarmer && (
              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => handleOpenProductModal()}
              >
                Post Produce Listing
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 10 Categories Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto py-2.5 scrollbar-none">
          <div className="flex items-center space-x-2 shrink-0">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Search, Filter Toolbar & Sorting */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search produce, wheat, tomatoes, FPO name, district..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="newest">Sort: Newest Harvest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="stock">In Stock Quantity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Collapse Panel */}
        {isFilterOpen && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">Produce Filters</h4>
              <button onClick={() => setIsFilterOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">Organic Certified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">Verified FPOs Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorState
            title="Marketplace Data Error"
            message={error}
            onRetry={fetchProducts}
          />
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="No Produce Found"
            description={`No crop produce items matched category "${selectedCategory}" or search query "${searchQuery}".`}
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setMinPrice('');
              setMaxPrice('');
              setOrganicOnly(false);
              setVerifiedOnly(false);
            }}
          />
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Showing {products.length} of {total} produce items</span>
              <span>Category: <strong>{selectedCategory}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => {
                const isOwner = user?.id === prod.farmerId || user?.role === 'admin';

                return (
                  <div key={prod.id} className="relative group">
                    <ProductCard
                      id={prod.id}
                      title={prod.title}
                      category={prod.category}
                      price={prod.price}
                      unit={prod.unit}
                      availableQuantity={prod.availableQuantity}
                      rating={prod.rating}
                      reviewCount={prod.reviewCount}
                      farmerName={prod.farmerName}
                      fpoName={prod.fpoName}
                      location={prod.location}
                      isVerifiedFPO={prod.isVerifiedFPO}
                      isOrganicCertified={prod.isOrganicCertified}
                      imageUrl={prod.imageUrl}
                      mandiBenchmarkPrice={prod.mandiBenchmarkPrice}
                      onAddToCart={() => toast.success('Added to Cart', `${prod.title} added.`)}
                      onBuyNow={() => onNavigateToProductDetail(prod.id)}
                      onViewDetails={() => onNavigateToProductDetail(prod.id)}
                    />

                    {/* Farmer Management Action Overlay */}
                    {isOwner && (
                      <div className="mt-2 flex items-center justify-end gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleOpenProductModal(prod)}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Produce</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 bg-white px-2.5 py-1 rounded-lg border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <span className="text-xs font-bold text-slate-700 px-3">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Farmer Produce Creation / Edit Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Produce Listing' : 'Post New Produce Listing'}
        description="Publish your crop produce directly to Indian consumers & B2B bulk buyers."
      >
        <form onSubmit={handleProductFormSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Produce Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fresh Red Tomatoes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 32"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="Quintal">Quintal (100 kg)</option>
                <option value="Ton">Ton (1000 kg)</option>
                <option value="Liter">Liter</option>
                <option value="Dozen">Dozen</option>
                <option value="Piece">Piece / Unit</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Stock *</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.isOrganicCertified}
                onChange={(e) => setFormData({ ...formData, isOrganicCertified: e.target.checked })}
              />
              <span>Organic Certified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.isVerifiedFPO}
                onChange={(e) => setFormData({ ...formData, isVerifiedFPO: e.target.checked })}
              />
              <span>Verified FPO Producer</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={formLoading}>
              {editingProduct ? 'Save Changes' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Footer */}
      <Footer onNavigate={(tab) => onNavigateTab(tab)} />
    </div>
  );
};
