module.exports = {
  content: [
    './public/assets/js/*.js',
    './public/assets/css/*.css',
    './views/**/*.html',
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    styled: true,
    themes: [
      "synthwave",
      "dark",
      "aqua",
      // ... puedes añadir más temas de la lista de temas de daisyUI ...
    ],
  },
}
