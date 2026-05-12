/**
 * Catalog seeded from `client/public/product-images/`.
 * Image paths are served by Vite from `/public` (leading slash).
 *
 * Skipped (no usable product photo): skirt4.png — add row if replaced.
 */

const img = (filename) => `/product-images/${encodeURIComponent(filename)}`;

/** Categories aligned with your inventory (replaces older Sneakers/Apparel-only split). */
export const catalogCategories = [
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Sneakers, trainers, and lifestyle shoes.',
  },
  {
    name: 'Jeans & denim',
    slug: 'jeans-denim',
    description: 'Denim jeans, cargos, and statement bottoms.',
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Mini to midi dresses for day and evening.',
  },
  {
    name: 'Skirts',
    slug: 'skirts',
    description: 'Mini, midi, and maxi skirts.',
  },
  {
    name: 'Tops',
    slug: 'tops',
    description: 'Knit tops, corsets, and seasonal shirts.',
  },
  {
    name: 'Loungewear & sets',
    slug: 'loungewear-sets',
    description: 'Tracksuits, hoodies, and coordinated sets.',
  },
];

/**
 * @typedef {Object} CatalogProductSeed
 * @property {string} title
 * @property {string} categorySlug — must exist in `catalogCategories`
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {string[]} images — local public URLs
 * @property {boolean} [featured]
 * @property {string} [brand]
 */

/** @type {CatalogProductSeed[]} */
export const catalogProducts = [
  {
    title: 'Shell-Toe Platform Stripe Sneakers',
    categorySlug: 'footwear',
    description:
      'Crisp white low-tops with triple side stripes, a textured shell toe, and a chunky platform sole. Versatile streetwear staple for everyday rotation.',
    price: 79,
    stock: 48,
    images: [img('adidas.jpg')],
    featured: true,
    brand: 'MS',
  },
  {
    title: "Nike Dunk Low 'Neutral Taupe & Grey'",
    categorySlug: 'footwear',
    description:
      'Premium leather Dunk Low in muted grey and taupe panels with a soft cream Swoosh. Perforated toe, clean white midsole, and a versatile neutral palette.',
    price: 115,
    stock: 36,
    images: [img('nike.jpg')],
    featured: true,
    brand: 'Nike',
  },
  {
    title: 'New Balance 530 Retro Running Sneakers — White / Navy',
    categorySlug: 'footwear',
    description:
      'Retro running silhouette with breathable mesh, synthetic overlays, and ABZORB heel cushioning. White base with navy accents and silver hits.',
    price: 110,
    stock: 42,
    images: [img('New Balance shoes.jpg')],
    brand: 'New Balance',
  },
  {
    title: 'Urban White Chunky Platform Sneakers',
    categorySlug: 'footwear',
    description:
      'All-white chunky trainers with mesh panels, sculpted platform sole, and athletic paneling. Bold lift with a clean monochrome finish.',
    price: 59.99,
    stock: 55,
    images: [img('shoes4.jpg')],
    brand: 'MS',
  },
  {
    title: 'Butterfly Drip Custom Low-Top Sneakers',
    categorySlug: 'footwear',
    description:
      'White leather low-tops with dripping black Swoosh-style accent, butterfly artwork on the panels, and contrast AIR midsole detailing. Statement street pair.',
    price: 185,
    stock: 22,
    images: [img('shoes5.jpg')],
    featured: true,
    brand: 'MS Lab',
  },
  {
    title: 'High-Waist Acid Wash Wide-Leg Cargo Jeans',
    categorySlug: 'jeans-denim',
    description:
      'Charcoal acid-wash denim with a relaxed wide leg, cargo flap pockets, and a high-rise waist. Utility edge with a soft faded texture.',
    price: 64,
    stock: 38,
    images: [img('jean1.jpg')],
    brand: 'MS',
  },
  {
    title: 'Light-Wash Multi-Pocket Denim Cargo Pants',
    categorySlug: 'jeans-denim',
    description:
      'Stone-wash blue denim cargos with four utility pockets and hanging denim strap details. High waist and wide leg for a Y2K street look.',
    price: 68,
    stock: 44,
    images: [img('jean2.jpg')],
    brand: 'MS',
  },
  {
    title: 'Heart Print Wide-Leg Denim Jeans',
    categorySlug: 'jeans-denim',
    description:
      'Medium-wash wide-leg jeans with an all-over light blue heart motif, high waist, and classic five-pocket construction. Playful yet wearable.',
    price: 62,
    stock: 40,
    images: [img('jean3.jpg')],
    brand: 'MS',
  },
  {
    title: 'High-Waisted Wide-Leg Jeans with Bow Accents',
    categorySlug: 'jeans-denim',
    description:
      'Light-wash denim with bow-tied overlays, a cargo pocket on the thigh, and a baggy wide silhouette. Feminine details on a relaxed fit.',
    price: 68,
    stock: 35,
    images: [img('jean4.jpg')],
    brand: 'MS',
  },
  {
    title: 'Butterfly Graphic Wide-Leg Acid Wash Jeans',
    categorySlug: 'jeans-denim',
    description:
      'Washed black wide-leg jeans with scattered white butterfly graphics, high rise, and roomy leg. Retro graphic denim with everyday comfort.',
    price: 58,
    stock: 33,
    images: [img('jean5.png')],
    brand: 'MS',
  },
  {
    title: 'Elegant One-Shoulder Ribbed Mini Dress',
    categorySlug: 'dresses',
    description:
      'Cream ribbed knit mini dress with one-shoulder neckline, gold rose brooch, smocked waist, and tiered ruffle skirt. Soft stretch and party-ready polish.',
    price: 59.99,
    stock: 28,
    images: [img('dress.jpg')],
    featured: true,
    brand: 'MS',
  },
  {
    title: 'Summer Bloom Halter Ruched Mini Dress',
    categorySlug: 'dresses',
    description:
      'White halter mini with cowl neck, ruched bodycon bodice, yellow floral print, and tiered ruffle hem. Stretchy fabric for warm-weather occasions.',
    price: 42,
    stock: 30,
    images: [img('dress 2.jpg')],
    brand: 'MS',
  },
  {
    title: 'Elegant Burgundy Off-the-Shoulder Ruffle Dress',
    categorySlug: 'dresses',
    description:
      'Wine-red cocktail dress with tiered off-shoulder ruffle, ruched bodice, and asymmetrical ruffled skirt. Lightweight layered chiffon feel.',
    price: 115,
    stock: 18,
    images: [img('dress 3.jpg')],
    brand: 'MS',
  },
  {
    title: 'Off-the-Shoulder Ribbed Knit Dress with Fur-Trim Cuffs',
    categorySlug: 'dresses',
    description:
      'White ribbed Bardot mini dress with black satin bow, long sleeves, and faux fur cuffs on a fit-and-flare silhouette. Coquette holiday-ready piece.',
    price: 55,
    stock: 26,
    images: [img('dress4.jpg')],
    brand: 'MS',
  },
  {
    title: 'Monochrome Ribbed Knit Contrast-Trim Mini Dress',
    categorySlug: 'dresses',
    description:
      'White ribbed knit dress with black polo collar, bell cuffs, faux pocket flaps, and contrast hem. Preppy fit-and-flare for day-to-night styling.',
    price: 79,
    stock: 24,
    images: [img('dress5.png')],
    brand: 'MS',
  },
  {
    title: 'Black Tiered Ruffle Mini Skirt with Side Ties',
    categorySlug: 'skirts',
    description:
      'High-waisted black mini with double-tier ruffles, side drawstring ties, and long cord accents. Smooth stretch blend for streetwear looks.',
    price: 38,
    stock: 50,
    images: [img('skirt1.jpg')],
    brand: 'MS',
  },
  {
    title: 'Ruffled Denim Mini Skirt with Side Tie',
    categorySlug: 'skirts',
    description:
      'Medium-wash denim mini with tiered ruffles and a wrap-style self-tie bow at the waist. Easy pairing with tanks and sneakers.',
    price: 39.99,
    stock: 45,
    images: [img('skirt2.jpg')],
    brand: 'MS',
  },
  {
    title: 'Marble Print Ruched Midi Skirt',
    categorySlug: 'skirts',
    description:
      'Satin-feel midi in red and pink marble swirls with side drawstring ruching and a subtle slit. High waist and body-skimming drape.',
    price: 58,
    stock: 32,
    images: [img('skirt3.jpg')],
    brand: 'MS',
  },
  {
    title: 'Abstract Print Ruched Maxi Skirt',
    categorySlug: 'skirts',
    description:
      'High-waisted monochrome abstract maxi with ruched midsection and gentle mermaid flare. Stretch jersey for sleek evening or day looks.',
    price: 45,
    stock: 29,
    images: [img('skirt5.jpg')],
    brand: 'MS',
  },
  {
    title: 'Pink Ribbed Off-the-Shoulder Bow Top',
    categorySlug: 'tops',
    description:
      'Baby pink ribbed knit top with off-shoulder fold, large organza bow, asymmetrical pointed hem, and lettuce-edge cuffs. Soft stretch knit.',
    price: 45,
    stock: 40,
    images: [img('t-shirt.jpg')],
    brand: 'MS',
  },
  {
    title: 'One-Shoulder Ribbed Bell Sleeve Top',
    categorySlug: 'tops',
    description:
      'Deep burgundy ribbed top with one-shoulder cut, side ruching tie, dramatic bell sleeves, and asymmetrical lettuce hem.',
    price: 34.99,
    stock: 44,
    images: [img('t-shirt2.jpg')],
    brand: 'MS',
  },
  {
    title: 'Pearl-Embellished Tie Detail Corset Top',
    categorySlug: 'tops',
    description:
      'Strapless white corset-style top with shirt-collar fold, black pearl-studded tie, vertical boning, and pointed hem. Statement tailoring.',
    price: 48,
    stock: 27,
    images: [img('t-shir5.jpg')],
    brand: 'MS',
  },
  {
    title: 'Asymmetrical Denim Tube Top with Ring Tie',
    categorySlug: 'tops',
    description:
      'Light-wash denim strapless corset-style top with vertical seaming, a side metal ring with long white ribbon tie, and a dramatic pointed asymmetric hem.',
    price: 44,
    stock: 32,
    images: [img('t-shirt3.jpg')],
    brand: 'MS',
  },
  {
    title: 'Cream Ruched Halter Top with Gold Flower Accent',
    categorySlug: 'tops',
    description:
      'Off-white halter with draped cowl neckline, horizontal ruched bands on the bodice, and a gold-tone floral charm on the strap. Satin-smooth stretch fit.',
    price: 46,
    stock: 30,
    images: [img('t-shirt4.jpg')],
    brand: 'MS',
  },
  {
    title: 'Heather Grey Zip Hoodie & Wide-Leg Sweatpants Set',
    categorySlug: 'loungewear-sets',
    description:
      'Two-piece heather grey fleece set: full-zip hoodie with rib cuffs and matching wide-leg sweatpants with elastic waist. Minimal embroidered crest detail.',
    price: 110,
    stock: 25,
    images: [img('Tracksuite Set.jpg')],
    featured: true,
    brand: 'MS',
  },
  {
    title: 'Navy 3-Piece Zip Hoodie, Tank & Sweatpants Set',
    categorySlug: 'loungewear-sets',
    description:
      'Coordinated navy zip hoodie, white ribbed crop tank, and wide-leg sweatpants with matching embroidered logo. Complete lounge-to-street outfit.',
    price: 79.99,
    stock: 30,
    images: [img('Tracksuite 3 set.jpg')],
    brand: 'MS',
  },
  {
    title: 'Oatmeal Ribbed One-Shoulder Two-Piece Knit Set',
    categorySlug: 'loungewear-sets',
    description:
      'Beige ribbed knit set: one-shoulder top with bell sleeves and tie side, plus high-waisted flared pants with lettuce hems. Soft coordinated lounge chic.',
    price: 59.99,
    stock: 28,
    images: [img('Matching set.jpg')],
    brand: 'MS',
  },
];
