module.exports = {
    devServer:{
        proxy:{
            "/tk":{
                'target':'https://www.taokubuy.com/',
                'changeOrigin':true,
                pathRewrite: {
                    '^/tk': ''
                }
            }
        }
    }
}