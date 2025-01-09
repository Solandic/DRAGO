var QueryParamsService = /** @class */ (function () {
    function QueryParamsService(_a) {
        var location = _a.location;
        var _this = this;
        this.getUrlWithCustomPageParam = function (index) {
            var url = _this.location.url;
            var splittedParams = url.split('?');
            var baseUrl = splittedParams[0];
            var urlParams = splittedParams.length > 1 ? splittedParams[1] : '';
            var searchParams = new URLSearchParams(urlParams);
            searchParams.delete('page');
            if (index !== 1) {
                searchParams.append('page', "".concat(index));
            }
            return "".concat(baseUrl).concat(searchParams.toString() ? '?' : '').concat(searchParams.toString());
        };
        this.getQueryParam = function (key) {
            return _this.location.query[key];
        };
        this.location = location;
    }
    return QueryParamsService;
}());
export { QueryParamsService };
//# sourceMappingURL=QueryParamsService.js.map