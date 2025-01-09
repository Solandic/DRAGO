/**
 * @deprecated this is only needed for a hack with GQL, once we merge it this hack should be deleted
 */
export function intToGuid(int) {
    if (int < 0) {
        throw Error('min convertable int to guid is 0');
    }
    if (int > 2147483647) {
        throw Error('max convertable int to guid is 2147483647');
    }
    var baseGuid = '00000000-0000-0000-0000-000000000000';
    var convertedToBase16 = int.toString(16);
    return baseGuid.slice(0, -convertedToBase16.length) + convertedToBase16;
}
//# sourceMappingURL=intToGuid.js.map