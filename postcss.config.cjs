// postcss.config.cjs
// postcss.config.js  (or postcss.config.cjs)
module.exports = {
    plugins: {
        "@tailwindcss/postcss": {},   // ← use the new package
        autoprefixer: {},
    },
};

