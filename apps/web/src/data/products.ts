import rawProducts from './products.json';

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductDetail = {
  slug: string;
  sku?: string;
  name: string;
  shortDescription: string;
  description: string;
  volumeLabel: string;
  servings: string;
  sizeOz?: number | null;
  unitPrice?: number | null;
  oneOffEligible?: boolean;
  heroImage: ProductImage;
  gallery: ProductImage[];
  highlights: Array<{ title: string; description: string }>;
  sustainability: string[];
};

export const products = rawProducts as ProductDetail[];

export const productSlugs = products.map((product) => product.slug);

export const findProductBySlug = (slug: string) => products.find((product) => product.slug === slug);
