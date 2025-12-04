const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css', {
        sassOptions: {
            quietDeps: true,
            silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin']
        }
    })
    .sourceMaps()
    .version();

// Options for Laravel Mix
mix.options({
    processCssUrls: true,
    postCss: []
});
