import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import SearchFilter from './SearchFilter';

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

    // Setup axios with CSRF token
    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        }
        loadProducts();
    }, []);

    // Load products from API
    const loadProducts = async (search = '') => {
        setLoading(true);
        try {
            const url = search ? `/api/products?search=${encodeURIComponent(search)}` : '/api/products';
            const response = await axios.get(url);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            showMessage('Error loading products: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (term) => {
        setSearchTerm(term);
        loadProducts(term);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        loadProducts('');
    };

    // Show message
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 5000);
    };

    // Add product
    const handleAddProduct = async (productData) => {
        try {
            const response = await axios.post('/api/products', productData);
            if (response.data.success) {
                showMessage(response.data.message, 'success');
                loadProducts(searchTerm);
                setShowForm(false);
                return true;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error adding product';
            showMessage(errorMessage, 'error');
            return false;
        }
    };

    // Update product
    const handleUpdateProduct = async (id, productData) => {
        try {
            const response = await axios.put(`/api/products/${id}`, productData);
            if (response.data.success) {
                showMessage(response.data.message, 'success');
                setEditingProduct(null);
                setShowForm(false);
                loadProducts(searchTerm);
                return true;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error updating product';
            showMessage(errorMessage, 'error');
            return false;
        }
    };

    // Delete product
    const handleDeleteProduct = (product) => {
        setDeleteModal({ show: true, product });
    };

    // Confirm delete
    const confirmDelete = async () => {
        const productId = deleteModal.product.id;
        setDeleteModal({ show: false, product: null });

        try {
            const response = await axios.delete(`/api/products/${productId}`);
            if (response.data.success) {
                showMessage(response.data.message, 'success');
                loadProducts(searchTerm);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error deleting product';
            showMessage(errorMessage, 'error');
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setDeleteModal({ show: false, product: null });
    };

    // Edit product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
        // Scroll to form
        setTimeout(() => {
            document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setShowForm(false);
    };

    // Show add form
    const handleShowAddForm = () => {
        setEditingProduct(null);
        setShowForm(true);
        setTimeout(() => {
            document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Calculate totals
    const calculateStats = () => {
        const totalProducts = products.length;
        const totalCost = products.reduce((sum, product) => sum + (parseFloat(product.price) * parseInt(product.quantity)), 0);
        const uniqueCategories = [...new Set(products.map(p => p.category))].length;
        
        return {
            totalProducts,
            totalCost: totalCost.toFixed(2),
            totalCategories: uniqueCategories
        };
    };

    const stats = calculateStats();

    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <h1>Product Inventory Manager</h1>
                </div>
            </header>

            <main className="container">
                <div className="inventory-container">
                    {/* Summary Statistics */}
                    <div className="summary-stats">
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalProducts}</div>
                            <div className="stat-label">Total Products</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">₱{stats.totalCost}</div>
                            <div className="stat-label">Total Inventory Cost</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalCategories}</div>
                            <div className="stat-label">Total Categories</div>
                        </div>
                    </div>

                    {/* Search Filter Section */}
                    <SearchFilter
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        onClear={handleClearSearch}
                    />

                    {/* Add Product Button */}
                    {!showForm && (
                        <div className="add-product-section">
                            <button className="btn btn-primary btn-add-product" onClick={handleShowAddForm}>
                                Add New Product
                            </button>
                        </div>
                    )}

                    {/* Product Form Section */}
                    {showForm && (
                        <ProductForm
                            editingProduct={editingProduct}
                            onAdd={handleAddProduct}
                            onUpdate={handleUpdateProduct}
                            onCancel={handleCancelEdit}
                        />
                    )}

                    {/* Message Box */}
                    {message.text && (
                        <div className={`message-box ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Products List Section */}
                    <ProductList
                        products={products}
                        loading={loading}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />

                    {/* Delete Confirmation Modal */}
                    {deleteModal.show && (
                        <div className="modal-overlay" onClick={cancelDelete}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h3>Confirm Delete</h3>
                                <p>Are you sure you want to delete this product?</p>
                                <div className="product-info">
                                    <strong>{deleteModal.product.name}</strong>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn btn-danger" onClick={confirmDelete}>
                                        Delete
                                    </button>
                                    <button className="btn btn-secondary" onClick={cancelDelete}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Product Inventory Manager</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
