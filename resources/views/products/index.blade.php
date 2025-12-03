@extends('layouts.app')

@section('title', 'Product Inventory Manager')

@section('content')
<div class="inventory-container">
    <!-- Filter Section -->
    <div class="filter-section">
        <h2>Filter Products</h2>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search by product name..." />
            <button id="searchBtn" class="btn btn-search">Search</button>
            <button id="clearBtn" class="btn btn-clear">Clear</button>
        </div>
    </div>

    <!-- Add Product Form -->
    <div class="form-section">
        <h2 id="formTitle">Add New Product</h2>
        <form id="productForm">
            <input type="hidden" id="productId" value="">
            
            <div class="form-group">
                <label for="name">Product Name <span class="required">*</span></label>
                <input type="text" id="name" name="name" required>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="3"></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="quantity">Quantity <span class="required">*</span></label>
                    <input type="number" id="quantity" name="quantity" min="0" required>
                </div>

                <div class="form-group">
                    <label for="price">Price <span class="required">*</span></label>
                    <input type="number" id="price" name="price" step="0.01" min="0" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" id="submitBtn" class="btn btn-primary">Add Product</button>
                <button type="button" id="cancelBtn" class="btn btn-secondary" style="display: none;">Cancel</button>
            </div>
        </form>
    </div>

    <!-- Products List -->
    <div class="products-section">
        <h2>Products List</h2>
        <div id="messageBox" class="message-box" style="display: none;"></div>
        <div id="productsList" class="products-list">
            <!-- Products will be loaded here via JavaScript -->
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    // Initialize the products app when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.ProductsApp !== 'undefined') {
            window.ProductsApp.init();
        }
    });
</script>
@endsection
