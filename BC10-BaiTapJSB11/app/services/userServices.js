function userServices() {
    this.getListProductApi = function () {
        return axios({
            url: "https://60c9eb09772a760017204c3b.mockapi.io/api/products",
            method: "GET",
        });
    };

    this.addProductApi = function (product) {
        return axios({
            url: "https://60c9eb09772a760017204c3b.mockapi.io/api/products",
            method: "POST",
            data: product,
        });
    };

    this.deleteProductApi = function (id) {
        return axios({
            url: `https://60c9eb09772a760017204c3b.mockapi.io/api/products/${id}`,
            method: "DELETE",
        });
    };

    this.getProductByIdApi = function (id) {
        return axios({
            url: `https://60c9eb09772a760017204c3b.mockapi.io/api/products/${id}`,
            method: "GET",
        });
    };

    
    this.updateProductApi = function (product) {
        return axios({
            url: `https://60c9eb09772a760017204c3b.mockapi.io/api/products/${product.id}`,
            method: "PUT",
            data: product,
        });
    };
}
