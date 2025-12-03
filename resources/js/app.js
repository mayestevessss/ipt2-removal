require('./bootstrap');

/**
 * Product Inventory Manager Application
 * Handles all CRUD operations for products using JavaScript and Axios
 */

window.ProductsApp = {
    // API endpoints
    apiUrl: '/api/products',
    
    // Current edit mode
    editMode: false,
    editProductId: null,

    /**
     * Initialize the application
     */
    init: function() {
        this.setupAxios();
        this.loadProducts();
        this.attachEventListeners();
    },

    /**
     * Setup Axios with CSRF token
     */
    setupAxios: function() {
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        }
    },

    /**
     * Attach event listeners to form and buttons
     */
    attachEventListeners: function() {
        const form = document.getElementById('productForm');
        const searchBtn = document.getElementById('searchBtn');
        const clearBtn = document.getElementById('clearBtn');
        const searchInput = document.getElementById('searchInput');
        const cancelBtn = document.getElementById('cancelBtn');

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterProducts();
            });
        }

        // Clear search button
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.loadProducts();
            });
        }

        // Search on Enter key
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterProducts();
                }
            });
        }

        // Cancel edit button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelEdit();
            });
        }
    },

    /**
     * Load all products or filtered products
     */
    loadProducts: function(searchTerm = '') {
        const url = searchTerm ? `${this.apiUrl}?search=${encodeURIComponent(searchTerm)}` : this.apiUrl;
        
        axios.get(url)
            .then(response => {
                if (response.data.success) {
                    this.displayProducts(response.data.products);
                }
            })
            .catch(error => {
                this.showMessage('Error loading products: ' + error.message, 'error');
            });
    },

    /**
     * Filter products by search term
     */
    filterProducts: function() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim();
        this.loadProducts(searchTerm);
    },

    /**
     * Display products in the list
     */
    displayProducts: function(products) {
        const productsList = document.getElementById('productsList');
        
        if (!products || products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        let html = '<table class="products-table"><thead><tr><th>Name</th><th>Description</th><th>Quantity</th><th>Price</th><th>Actions</th></tr></thead><tbody>';
        
        products.forEach(product => {
            html += `
                <tr>
                    <td>${this.escapeHtml(product.name)}</td>
                    <td>${this.escapeHtml(product.description || '-')}</td>
                    <td>${product.quantity}</td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn btn-edit" onclick="ProductsApp.editProduct(${product.id})">Edit</button>
                        <button class="btn btn-delete" onclick="ProductsApp.deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        productsList.innerHTML = html;
    },

    /**
     * Handle form submission (Add or Update)
     */
    handleFormSubmit: function() {
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;

        // Validation
        if (!name || !quantity || !price) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        const productData = {
            name: name,
            description: description,
            quantity: parseInt(quantity),
            price: parseFloat(price)
        };

        if (this.editMode && this.editProductId) {
            this.updateProduct(this.editProductId, productData);
        } else {
            this.addProduct(productData);
        }
    },

    /**
     * Add a new product
     */
    addProduct: function(productData) {
        axios.post(this.apiUrl, productData)
            .then(response => {
                if (response.data.success) {
                    this.showMessage(response.data.message, 'success');
                    this.resetForm();
                    this.loadProducts();
                }
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Error adding product';
                this.showMessage(message, 'error');
            });
    },

    /**
     * Update an existing product
     */
    updateProduct: function(id, productData) {
        axios.put(`${this.apiUrl}/${id}`, productData)
            .then(response => {
                if (response.data.success) {
                    this.showMessage(response.data.message, 'success');
                    this.resetForm();
                    this.cancelEdit();
                    this.loadProducts();
                }
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Error updating product';
                this.showMessage(message, 'error');
            });
    },

    /**
     * Edit a product (populate form)
     */
    editProduct: function(id) {
        axios.get(`${this.apiUrl}?search=`)
            .then(response => {
                if (response.data.success) {
                    const product = response.data.products.find(p => p.id === id);
                    if (product) {
                        this.populateForm(product);
                    }
                }
            })
            .catch(error => {
                this.showMessage('Error loading product details', 'error');
            });
    },

    /**
     * Populate form with product data for editing
     */
    populateForm: function(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description || '';
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('price').value = product.price;

        // Update UI for edit mode
        this.editMode = true;
        this.editProductId = product.id;
        document.getElementById('formTitle').textContent = 'Update Product';
        document.getElementById('submitBtn').textContent = 'Update Product';
        document.getElementById('cancelBtn').style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Cancel edit mode
     */
    cancelEdit: function() {
        this.resetForm();
        this.editMode = false;
        this.editProductId = null;
        document.getElementById('formTitle').textContent = 'Add New Product';
        document.getElementById('submitBtn').textContent = 'Add Product';
        document.getElementById('cancelBtn').style.display = 'none';
    },

    /**
     * Delete a product
     */
    deleteProduct: function(id) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        axios.delete(`${this.apiUrl}/${id}`)
            .then(response => {
                if (response.data.success) {
                    this.showMessage(response.data.message, 'success');
                    this.loadProducts();
                }
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Error deleting product';
                this.showMessage(message, 'error');
            });
    },

    /**
     * Reset the form
     */
    resetForm: function() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    },

    /**
     * Show message to user
     */
    showMessage: function(message, type) {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

