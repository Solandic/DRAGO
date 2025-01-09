/* eslint-disable prefer-named-capture-group */
/**
 * @deprecated this is only needed for a hack with GQL, once we merge it this hack should be deleted
 */
export var guidToInt = function (guid) {
    var reg = new RegExp(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/);
    if (!reg.exec(guid)) {
        return -1;
    }
    return parseInt(guid.replace(/-/g, ''), 16);
};
//# sourceMappingURL=guidToInt.js.map