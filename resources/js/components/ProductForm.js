import React, { useState, useEffect } from 'react';

const ProductForm = ({ editingProduct, onAdd, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        quantity: '',
        price: ''
    });

    const [errors, setErrors] = useState({});

    // Predefined categories
    const categories = [
        'Office Supplies',
        'Computer Parts',
        'Electronics',
        'Furniture',
        'Accessories',
        'Stationery',
        'Hardware',
        'Software',
        'Other'
    ];

    // Update form when editing product changes
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                category: editingProduct.category || '',
                description: editingProduct.description || '',
                quantity: editingProduct.quantity || '',
                price: editingProduct.price || ''
            });
        } else {
            resetForm();
        }
    }, [editingProduct]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (!formData.quantity || formData.quantity < 0) {
            newErrors.quantity = 'Quantity must be 0 or greater';
        }

        if (!formData.price || formData.price < 0) {
            newErrors.price = 'Price must be 0 or greater';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productData = {
            name: formData.name.trim(),
            category: formData.category.trim(),
            description: formData.description.trim(),
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price)
        };

        let success = false;
        if (editingProduct) {
            success = await onUpdate(editingProduct.id, productData);
        } else {
            success = await onAdd(productData);
        }

        if (success) {
            resetForm();
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            description: '',
            quantity: '',
            price: ''
        });
        setErrors({});
    };

    // Handle cancel
    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <div className="form-section">
            <h2>{editingProduct ? 'Update Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">
                        Product Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="e.g., Pilot G-Tech Pen 0.4"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">
                        Category <span className="required">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={errors.category ? 'error' : ''}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="e.g., Fine-tip gel pen for smooth writing"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="quantity">
                            Quantity <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            className={errors.quantity ? 'error' : ''}
                        />
                        {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">
                            Price <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
