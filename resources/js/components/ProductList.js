import React from 'react';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="products-section">
                <h2>Products List</h2>
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="products-section">
                <h2>Products List</h2>
                <p className="no-products">No products found.</p>
            </div>
        );
    }

    return (
        <div className="products-section">
            <h2>Products List</h2>
            <div className="products-list">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <strong>{product.name}</strong>
                                </td>
                                <td>
                                    <span className="category-badge">
                                        {product.category || 'Uncategorized'}
                                    </span>
                                </td>
                                <td>{product.description || '-'}</td>
                                <td>{product.quantity}</td>
                                <td>₱{parseFloat(product.price).toFixed(2)}</td>
                                <td className="actions">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => onEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => onDelete(product)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
