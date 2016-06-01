module.exports = {
    devtool: "source-map",
    target: "node",
    entry: {
        "stage": "./ts/views/panel/StagePanel2.ts",
        "main": "./ts/main.ts"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
// Where should the compiled file go?
    output: {
// To the `dist` folder
        path: './dist',
// With the filename `build.js` so it's dist/build.js
        filename: "[name].bundle.js"
    }
};