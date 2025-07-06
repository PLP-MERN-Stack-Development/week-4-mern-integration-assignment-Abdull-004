import tailwindcssPlugin from '@tailwindcss/postcss';
// Also import 'autoprefixer' explicitly.
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    // Use the imported plugin function.
    tailwindcssPlugin(),
    // Call autoprefixer as a function to initialize it.
    autoprefixer(),
  ],
};