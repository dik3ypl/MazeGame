var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js' // bundle.js to wynik kompilacji projektu przez webpacka
    },
    devServer: {
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './game.html',
            title: "Play - Boletus Revenge",
            template: './src/index.html',
            h1: "h1",
            h2: "h2"
        })
    ],
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },
            {
                test: /.(md2)$/i,
                type: 'asset/resource',
            }
        ]
    },

    mode: 'development' // none, development, production
};