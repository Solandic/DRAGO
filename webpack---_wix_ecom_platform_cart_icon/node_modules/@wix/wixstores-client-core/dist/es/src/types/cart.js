export var CartType;
(function (CartType) {
    CartType["DIGITAL"] = "digital";
    CartType["PHYSICAL"] = "physical";
    CartType["MIXED"] = "mixed";
    CartType["MIXED_VERTICALS"] = "mixed_verticals";
    CartType["SERVICE"] = "service";
    CartType["GIFT_CARD"] = "gift_card";
    CartType["UNRECOGNISED"] = "unrecognised";
})(CartType || (CartType = {}));
export var CartEvents;
(function (CartEvents) {
    CartEvents["CHANGED"] = "Cart.Changed";
    CartEvents["CLEARED"] = "Cart.Cleared";
    CartEvents["INVALIDATED"] = "Cart.Invalidated";
})(CartEvents || (CartEvents = {}));
//# sourceMappingURL=cart.js.map