import { extendedProduct } from './schema/extendedProduct';
export var query = "query getExtendedProductById($id: String!) {\n    catalog {\n      product(productId: $id, onlyVisible: true) {\n        ".concat(extendedProduct, "\n      }\n    }\n  }");
//# sourceMappingURL=getExtendedProductById.graphql.js.map