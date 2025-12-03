<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Product Inventory Manager')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div id="app">
        <header>
            <div class="container">
                <h1>Product Inventory Manager</h1>
            </div>
        </header>

        <main class="container">
            @yield('content')
        </main>

        <footer>
            <div class="container">
                <p>&copy; {{ date('Y') }} Product Inventory Manager</p>
            </div>
        </footer>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
    @yield('scripts')
</body>
</html>
