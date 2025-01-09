import {SdkEvents} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkEvents';
import {MediaFrameMediaType, ProductType} from '@wix/wix-ecommerce-common-storefront/dist/src/enums/product';

export class CartItemImage {
  public product;
  private readonly width;
  private readonly height;

  /* @ngInject */
  constructor(private readonly utils, private readonly sdkEvents: SdkEvents) {}

  public getMediaUrl = () => {
    if (!this.product.media.url) {
      return;
    }
    const dimensions = {width: this.width, height: this.height};
    const media = this.product.media;
    this.product.media.width = this.product.media.width || this.width;
    this.product.media.height = this.product.media.height || this.height;
    return this.utils.media.getMediaUrl(media, dimensions);
  };

  public closeCartWidgetPopup(): void {
    this.sdkEvents.broadcast('Minicart.Toggle', null);
    this.sdkEvents.broadcast('Minicart.DidClose', null);
  }

  public getDefaultProductFileType = () => {
    if (this.product.productType !== ProductType.DIGITAL) {
      return '';
    }

    const defaultFile = this.product.digitalProductFileItems[0];

    switch (defaultFile && defaultFile.fileType) {
      case MediaFrameMediaType.SECURE_PICTURE:
        return 'picture';
      case MediaFrameMediaType.SECURE_VIDEO:
        return 'video';
      case MediaFrameMediaType.SECURE_DOCUMENT:
        return 'document';
      case MediaFrameMediaType.SECURE_MUSIC:
        return 'music';
      case MediaFrameMediaType.SECURE_ARCHIVE:
        return 'archive';
      default:
        return '';
    }
  };
}

export const cartItemImage = {
  template: require('./productMediaView.html'),
  controller: CartItemImage,
  bindings: {
    product: '=',
    width: '=',
    height: '=',
    productSectionId: '=',
    isLineItemClickable: '=',
  },
};
