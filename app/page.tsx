"use client";

import { useState, useRef, useCallback } from "react";

const OCCASIONS = [
  "Work / Office", "Weekend Casual", "Evening & Events",
  "Travel", "Active / Outdoor", "Date Nights"
];

const RETAILERS: Record<string, string[]> = {
  minimalist: ["COS", "Everlane", "Quince", "Uniqlo", "Mango"],
  classic: ["J.Crew", "Banana Republic", "Ann Taylor", "Brooks Brothers", "Ralph Lauren"],
  bohemian: ["Free People", "Anthropologie", "Madewell", "ASOS", "Urban Outfitters"],
  edgy: ["Zara", "& Other Stories", "ASOS", "AllSaints", "Topshop"],
  romantic: ["Reformation", "Anthropologie", "& Other Stories", "Free People", "BHLDN"],
  sporty: ["Lululemon", "Nike", "Athleta", "Outdoor Voices", "Vuori"],
  business: ["Ann Taylor", "Banana Republic", "J.Crew", "M.M. LaFleur", "Talbots"],
  eclectic: ["ASOS", "Depop", "ThredUp", "Poshmark", "Anthropologie"],
  default: ["Zara", "ASOS", "Mango", "Uniqlo", "& Other Stories"],
};

const CAPSULE_ITEMS: Record<string, { category: string; items: string[] }[]> = {
  minimalist: [
    { category: "Tops", items: ["White structured button-down", "Black fine-knit turtleneck", "Cream ribbed tank (×2)", "Oatmeal linen tee"] },
    { category: "Bottoms", items: ["Straight-leg dark denim", "Tailored wide-leg trousers (black)", "Midi slip skirt (ivory)"] },
    { category: "Layers", items: ["Oversized blazer (camel)", "Merino cardigan (oatmeal)", "Classic trench coat"] },
    { category: "Dresses", items: ["Clean shift dress (navy)", "Linen wrap dress (stone)"] },
    { category: "Shoes", items: ["White leather sneakers", "Black loafers", "Nude block-heel mule"] },
    { category: "Bags", items: ["Structured leather tote (tan)", "Mini crossbody (black)"] },
  ],
  classic: [
    { category: "Tops", items: ["Crisp white Oxford shirt", "Breton stripe tee", "Silk blouse (ivory)", "Navy fine-knit sweater"] },
    { category: "Bottoms", items: ["Dark slim jeans", "Tailored chinos (khaki)", "Pleated midi skirt (camel)"] },
    { category: "Layers", items: ["Camel double-breasted coat", "Navy blazer", "Cashmere cardigan (cream)"] },
    { category: "Dresses", items: ["Shirt dress (chambray)", "Little black dress"] },
    { category: "Shoes", items: ["Ballet flats (nude)", "Oxford shoes (cognac)", "Classic pumps (black)"] },
    { category: "Bags", items: ["Leather satchel (tan)", "Chain-strap bag (black)"] },
  ],
  bohemian: [
    { category: "Tops", items: ["Embroidered peasant blouse", "Flowy wrap top (terracotta)", "Crochet trim tank", "Linen button-front top"] },
    { category: "Bottoms", items: ["Flared jeans", "Tiered maxi skirt", "Wide-leg linen pants (rust)"] },
    { category: "Layers", items: ["Fringe kimono", "Oversized denim jacket", "Chunky knit cardigan"] },
    { category: "Dresses", items: ["Floral maxi dress", "Smocked sundress (rust)"] },
    { category: "Shoes", items: ["Leather sandals", "Western ankle boots", "Espadrille wedges"] },
    { category: "Bags", items: ["Woven straw tote", "Suede fringe crossbody"] },
  ],
  edgy: [
    { category: "Tops", items: ["Black fitted turtleneck", "Graphic band tee", "Asymmetric draped top", "Leather-look cami"] },
    { category: "Bottoms", items: ["Black skinny jeans", "Leather-look straight pants", "Mini skirt (black)"] },
    { category: "Layers", items: ["Oversized leather jacket", "Longline blazer (charcoal)", "Cropped moto jacket"] },
    { category: "Dresses", items: ["Slip dress (black)", "Cut-out bodycon dress"] },
    { category: "Shoes", items: ["Combat boots", "Pointed-toe ankle boots", "Platform sneakers"] },
    { category: "Bags", items: ["Chain-link shoulder bag", "Mini leather backpack"] },
  ],
  romantic: [
    { category: "Tops", items: ["Ruffle blouse (blush)", "Puff-sleeve top (cream)", "Silk cami (dusty rose)", "Smocked crop top"] },
    { category: "Bottoms", items: ["Floral midi skirt", "Wide-leg trousers (blush)", "Denim skirt (vintage wash)"] },
    { category: "Layers", items: ["Lace-trim cardigan", "Oversized linen blazer (cream)", "Wrap coat (dusty pink)"] },
    { category: "Dresses", items: ["Floral wrap dress", "Linen sundress (lavender)", "Midi ruffle dress"] },
    { category: "Shoes", items: ["Strappy heeled sandals", "Mary Jane flats", "White sneakers"] },
    { category: "Bags", items: ["Woven raffia bag", "Satin evening clutch", "Leather hobo bag"] },
  ],
  sporty: [
    { category: "Activewear Tops", items: ["Performance tee (×3 colors)", "Sports bra (×2)", "Quarter-zip pullover", "Cropped hoodie"] },
    { category: "Activewear Bottoms", items: ["High-waist leggings (black)", "Jogger pants", "Athletic shorts (×2)"] },
    { category: "Casual Layers", items: ["Track jacket", "Lightweight puffer vest", "Zip-up hoodie"] },
    { category: "Casual Tops", items: ["Relaxed graphic tee", "Henley top", "Polo shirt"] },
    { category: "Shoes", items: ["Running sneakers", "Lifestyle sneakers (white)", "Slides"] },
    { category: "Bags", items: ["Gym duffel", "Fanny pack", "Canvas tote"] },
  ],
  business: [
    { category: "Tops", items: ["Silk shell (ivory)", "Printed blouse (navy/white)", "Fine-knit top (camel)", "Crisp white button-down"] },
    { category: "Bottoms", items: ["Tailored trousers (black)", "Pencil skirt (charcoal)", "Straight-leg pants (navy)"] },
    { category: "Layers", items: ["Structured blazer (black)", "Longline cardigan (grey)", "Classic trench coat"] },
    { category: "Dresses", items: ["Sheath dress (navy)", "Wrap dress (jewel tone)"] },
    { category: "Shoes", items: ["Block-heel pumps (nude)", "Pointed loafers (black)", "Low-heel ankle boots"] },
    { category: "Bags", items: ["Leather work tote", "Structured top-handle bag"] },
  ],
  eclectic: [
    { category: "Tops", items: ["Vintage graphic tee", "Statement printed blouse", "Color-block knit", "Lace trim top"] },
    { category: "Bottoms", items: ["Patchwork jeans", "Bold-print maxi skirt", "Tailored shorts (plaid)"] },
    { category: "Layers", items: ["Vintage denim jacket (embroidered)", "Colorful oversized blazer", "Patterned cardigan"] },
    { category: "Dresses", items: ["Mixed-print midi dress", "Vintage-inspired slip dress"] },
    { category: "Shoes", items: ["Colorful chunky sneakers", "Vintage cowboy boots", "Strappy heeled mules"] },
    { category: "Bags", items: ["Beaded clutch", "Vintage bucket bag", "Painted canvas tote"] },
  ],
  default: [
    { category: "Tops", items: ["White button-down shirt", "Striped knit top", "Solid tank (×2)", "Casual crewneck tee"] },
    { category: "Bottoms", items: ["Dark straight-leg jeans", "Tailored trousers", "Midi skirt (neutral)"] },
    { category: "Layers", items: ["Blazer (neutral)", "Cardigan (oatmeal)", "Trench coat"] },
    { category: "Dresses", items: ["Wrap dress (solid)", "Casual midi dress"] },
    { category: "Shoes", items: ["White sneakers", "Loafers or flats", "Ankle boots"] },
    { category: "Bags", items: ["Everyday tote", "Crossbody bag"] },
  ],
};

function buildShopUrl(retailer: string, item: string): string {
  const q = encodeURIComponent(item);
  const map: Record<string, string> = {
    "COS": `https://www.cos.com/en_usd/search?q=${q}`,
    "Everlane": `https://www.everlane.com/search?query=${q}`,
    "Quince": `https://www.quince.com/search?q=${q}`,
    "Uniqlo": `https://www.uniqlo.com/us/en/search?q=${q}`,
    "Mango": `https://shop.mango.com/us/search?qt=${q}`,
    "J.Crew": `https://www.jcrew.com/search2/index.jsp?q=${q}`,
    "Banana Republic": `https://bananarepublic.gap.com/browse/search.do?searchText=${q}`,
    "Ann Taylor": `https://www.anntaylor.com/search/search?q=${q}`,
    "Free People": `https://www.freepeople.com/search/?q=${q}`,
    "Anthropologie": `https://www.anthropologie.com/search?q=${q}`,
    "Madewell": `https://www.madewell.com/r/search?q=${q}`,
    "ASOS": `https://www.asos.com/us/search/?q=${q}`,
    "Urban Outfitters": `https://www.urbanoutfitters.com/search?q=${q}`,
    "Zara": `https://www.zara.com/us/en/search?q=${q}&v=2`,
    "& Other Stories": `https://www.stories.com/en_usd/search.html?q=${q}`,
    "Reformation": `https://www.thereformation.com/search?q=${q}`,
    "Lululemon": `https://shop.lululemon.com/search?Ntt=${q}`,
    "Nike": `https://www.nike.com/w?q=${q}&vst=${q}`,
    "Athleta": `https://athleta.gap.com/browse/search.do?searchText=${q}`,
    "Outdoor Voices": `https://www.outdoorvoices.com/search?q=${q}`,
    "Vuori": `https://vuoriclothing.com/search?q=${q}`,
    "M.M. LaFleur": `https://mmlafleur.com/search?q=${q}`,
    "Talbots": `https://www.talbots.com/search?term=${q}`,
    "Ralph Lauren": `https://www.ralphlauren.com/search?q=${q}`,
    "Brooks Brothers": `https://www.brooksbrothers.com/search?q=${q}`,
    "AllSaints": `https://www.allsaints.com/en-us/search/?q=${q}`,
    "Topshop": `https://www.asos.com/us/search/?q=${q}`,
    "Depop": `https://www.depop.com/search/?q=${q}`,
    "ThredUp": `https://www.thredup.com/search?search_text=${q}`,
    "Poshmark": `https://poshmark.com/search?query=${q}`,
    "BHLDN": `https://www.bhldn.com/search?q=${q}`,
  };
  return map[retailer] || `https://www.google.com/search?q=${encodeURIComponent(retailer + " " + item)}`;
}

function estimateBudget(total: number) {
  return [
    { category: "Tops", pct: 0.18, count: 4 },
    { category: "Bottoms", pct: 0.22, count: 3 },
    { category: "Layers", pct: 0.22, count: 3 },
    { category: "Dresses", pct: 0.12, count: 2 },
    { category: "Shoes", pct: 0.15, count: 3 },
    { category: "Bags", pct: 0.11, count: 2 },
  ].map(b => ({
    ...b,
    budget: Math.round(total * b.pct),
    perItem: Math.round((total * b.pct) / b.count),
  }));
}

const TIPS: Record<string, string> = {
  minimalist: "Invest in quality over quantity. One well-made white shirt is worth three fast fashion alternatives. Look for natural fibers and clean construction.",
  classic: "Build around a neutral base and add interest through fit and texture. A well-tailored blazer will outlast any trend by decades.",
  bohemian: "Mix vintage and new. Thrifted pieces often have the worn-in quality that makes bohemian dressing feel authentic rather than costume-y.",
  edgy: "Proportion is everything. Balance an oversized leather jacket with slim-fitting basics underneath for a look that feels intentional.",
  romantic: "Layer delicate pieces for dimension. A silk cami under a lace cardigan creates texture and depth without losing the soft, feminine feel.",
  sporty: "Invest in your activewear — it takes the most wear. For the casual side, quality neutral basics make everything look more put-together.",
  business: "Fit is your most important tool. Even a modest blazer looks polished when properly tailored. Budget for alterations, not just the garment.",
  eclectic: "Anchor with one neutral piece per outfit. An eclectic wardrobe shines when 70% is simple and 30% is the statement.",
  default: "Build intentionally — buy less, choose better. Start with pieces you'll reach for constantly, then add interest once your foundation is solid.",
};

async function analyzePhotos(photos: { id: string; file: File; url: string }[]) {
  const images = await Promise.all(
    photos.map(async (photo) => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(photo.file);
      });
      return { base64, mediaType: photo.file.type };
    })
  );

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images }),
  });

  return response.json();
}

const VIBE_LABEL: Record<string, string> = {
  minimalist: "Minimalist", classic: "Classic & Timeless", bohemian: "Bohemian",
  edgy: "Edgy & Modern", romantic: "Romantic & Soft", sporty: "Sporty & Casual",
  business: "Business Chic", eclectic: "Eclectic Mix", default: "Curated",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  .app{min-height:100vh;background:#FAF7F2;font-family:'Josefin Sans',sans-serif;color:#2C2420;overflow-x:hidden}
  .header{padding:40px 40px 28px;text-align:center;border-bottom:1px solid rgba(44,36,32,.1)}
  .eyebrow{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#9B7E6E;font-weight:300;margin-bottom:10px}
  .logo{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:300;color:#2C2420;line-height:1.1}
  .logo em{font-style:italic;color:#9B7E6E}
  .main{max-width:760px;margin:0 auto;padding:44px 32px}
  .step-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;margin-bottom:6px}
  .step-sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9B7E6E;font-weight:300;margin-bottom:32px}
  .progress{display:flex;align-items:center;justify-content:center;padding:20px 40px}
  .pdot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;border:1px solid rgba(44,36,32,.2);color:rgba(44,36,32,.3);transition:all .3s;flex-shrink:0}
  .pdot.active{background:#2C2420;color:#FAF7F2;border-color:#2C2420}
  .pdot.done{background:#9B7E6E;color:#FAF7F2;border-color:#9B7E6E}
  .pline{width:50px;height:1px;background:rgba(44,36,32,.15);margin:0 6px;flex-shrink:0}
  .pline.done{background:#9B7E6E}
  .upload-zone{border:1.5px dashed rgba(44,36,32,.2);padding:40px 24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.4)}
  .upload-zone:hover{border-color:#9B7E6E;background:rgba(155,126,110,.05)}
  .upload-icon{font-size:32px;margin-bottom:12px;opacity:.4}
  .upload-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;margin-bottom:6px}
  .upload-hint{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B7E6E;font-weight:300}
  .photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}
  .photo-thumb{position:relative;aspect-ratio:1;overflow:hidden}
  .photo-thumb img{width:100%;height:100%;object-fit:cover}
  .photo-remove{position:absolute;top:4px;right:4px;width:20px;height:20px;background:rgba(44,36,32,.8);color:#FAF7F2;border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}
  .analyzing{text-align:center;padding:28px;border:1px solid rgba(44,36,32,.1);background:rgba(255,255,255,.5);margin-top:14px}
  .analyze-spinner{width:30px;height:30px;border:1px solid rgba(44,36,32,.15);border-top-color:#9B7E6E;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 14px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .analyze-text{font-family:'Cormorant Garamond',serif;font-size:17px;font-style:italic;font-weight:300}
  .ai-result{padding:18px 20px;background:rgba(155,126,110,.08);border-left:2px solid #9B7E6E;margin-top:14px}
  .ai-result-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-bottom:10px;font-weight:300}
  .ai-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
  .ai-chip{padding:4px 12px;background:rgba(44,36,32,.08);font-size:9px;letter-spacing:2px;text-transform:uppercase}
  .ai-palette{display:flex;gap:4px;margin-top:10px}
  .ai-swatch{width:22px;height:22px;border-radius:2px}
  .field{margin-bottom:22px}
  label{display:block;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-bottom:8px;font-weight:300}
  input,textarea,select{width:100%;padding:11px 14px;border:1px solid rgba(44,36,32,.15);background:rgba(255,255,255,.7);font-family:'Josefin Sans',sans-serif;font-size:13px;color:#2C2420;outline:none;transition:border-color .2s}
  input:focus,textarea:focus,select:focus{border-color:#9B7E6E}
  textarea{resize:vertical;min-height:72px}
  .meas-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .tag-group{display:flex;flex-wrap:wrap;gap:7px}
  .tag{padding:7px 14px;border:1px solid rgba(44,36,32,.2);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-weight:300;background:transparent}
  .tag.sel{background:#2C2420;color:#FAF7F2;border-color:#2C2420}
  .bwrap{position:relative}
  .bsym{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-family:'Cormorant Garamond',serif;font-size:22px;color:#9B7E6E}
  .binput{padding-left:30px!important;font-size:22px!important;font-family:'Cormorant Garamond',serif!important;font-weight:300}
  .radio-row{display:flex;gap:10px}
  .ropt{flex:1;padding:11px;border:1px solid rgba(44,36,32,.15);text-align:center;cursor:pointer;font-size:9px;letter-spacing:2px;text-transform:uppercase;transition:all .2s}
  .ropt.sel{background:#2C2420;color:#FAF7F2;border-color:#2C2420}
  .toggle-row{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid rgba(44,36,32,.1);cursor:pointer}
  .tog{width:38px;height:20px;border-radius:10px;border:1px solid rgba(44,36,32,.2);position:relative;transition:all .2s;flex-shrink:0}
  .tog.on{background:#2C2420;border-color:#2C2420}
  .tog::after{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:white;top:2px;left:2px;transition:all .2s}
  .tog.on::after{transform:translateX(18px)}
  .tog-label{font-size:9px;letter-spacing:2px;text-transform:uppercase}
  .tog-sub{font-size:9px;color:rgba(44,36,32,.45);margin-top:2px;font-style:italic}
  .btn{display:block;width:100%;padding:17px;background:#2C2420;color:#FAF7F2;font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;border:none;cursor:pointer;margin-top:36px;transition:all .2s;font-weight:300}
  .btn:hover{background:#9B7E6E}
  .btn:disabled{background:rgba(44,36,32,.18);cursor:not-allowed}
  .btn-ghost{display:block;width:100%;padding:14px;background:transparent;color:#2C2420;font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;border:1px solid rgba(44,36,32,.2);cursor:pointer;transition:all .2s;font-weight:300}
  .btn-row{display:flex;gap:10px;margin-top:36px}
  .btn-row .btn,.btn-row .btn-ghost{margin-top:0;flex:1}
  .loading{text-align:center;padding:80px 0}
  .load-spinner{width:40px;height:40px;border:1px solid rgba(44,36,32,.15);border-top-color:#9B7E6E;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px}
  .load-text{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;font-style:italic}
  .load-sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-top:6px;font-weight:300}
  .result-hero{text-align:center;padding:36px;background:#2C2420;color:#FAF7F2;margin-bottom:40px}
  .rh-eye{font-size:9px;letter-spacing:4px;color:#9B7E6E;margin-bottom:10px}
  .rh-title{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:300}
  .rh-title em{font-style:italic;color:#C8A882}
  .palette-strip{display:flex;height:5px;margin-top:20px}
  .pbar{flex:1}
  .sec-label{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#9B7E6E;margin-bottom:20px;font-weight:300}
  .budget-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:40px}
  .bcard{padding:18px;border:1px solid rgba(44,36,32,.1);background:rgba(255,255,255,.5)}
  .bc-cat{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-bottom:6px;font-weight:300}
  .bc-amt{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300}
  .bc-per{font-size:9px;color:rgba(44,36,32,.4);margin-top:3px}
  .divider{height:1px;background:rgba(44,36,32,.08);margin:36px 0}
  .cat-block{margin-bottom:40px}
  .cat-head{display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(44,36,32,.08)}
  .cat-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400}
  .cat-bud{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B7E6E;margin-left:auto;font-weight:300}
  .item-list{display:grid;gap:10px}
  .item-row{display:flex;align-items:flex-start;padding:14px;border:1px solid rgba(44,36,32,.07);background:rgba(255,255,255,.55);gap:14px;flex-wrap:wrap}
  .item-name{font-size:12px;flex:1;padding-top:3px;min-width:140px}
  .shop-links{display:flex;flex-wrap:wrap;gap:5px}
  .slink{font-size:8px;letter-spacing:2px;text-transform:uppercase;padding:5px 9px;border:1px solid rgba(44,36,32,.18);color:#2C2420;text-decoration:none;font-weight:300;transition:all .15s;white-space:nowrap}
  .slink:hover{background:#2C2420;color:#FAF7F2;border-color:#2C2420}
  .tip-box{padding:22px;background:rgba(155,126,110,.08);border-left:2px solid #9B7E6E;margin-top:36px}
  .tip-t{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-bottom:8px}
  .tip-txt{font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;line-height:1.65}
  .ai-insight{padding:16px 20px;background:rgba(44,36,32,.04);border:1px solid rgba(44,36,32,.08);margin-bottom:32px}
  .ai-insight-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#9B7E6E;margin-bottom:6px}
  .ai-insight-text{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;line-height:1.6}
  @media(max-width:580px){
    .logo{font-size:30px}.meas-grid,.budget-grid{grid-template-columns:1fr}
    .main{padding:32px 18px}.photo-grid{grid-template-columns:repeat(3,1fr)}
    .radio-row{flex-direction:column}
  }
`;

type Photo = { id: string; file: File; url: string };
type Meas = { height: string; bust: string; waist: string; hips: string; inseam: string };
type AiAnalysis = { vibe: string; colorPalette: string[]; occasions: string[]; keywords: string[]; insights: string } | null;
type Result = {
  items: { category: string; items: string[] }[];
  retailers: string[];
  budgetBreakdown: ReturnType<typeof estimateBudget>;
  vibe: string;
  palette: string[];
  aiAnalysis: AiAnalysis;
} | null;

export default function CapsuleWardrobe() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [dragging, setDragging] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis>(null);
  const [aiError, setAiError] = useState(false);
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [styleDesc, setStyleDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState("");
  const [meas, setMeas] = useState<Meas>({ height: "", bust: "", waist: "", hips: "", inseam: "" });
  const [budget, setBudget] = useState("");
  const [flex, setFlex] = useState("strict");
  const [secondhand, setSecondhand] = useState(false);
  const [occasions, setOccasions] = useState<string[]>([]);

  const addPhotos = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 8 - photos.length);
    if (!valid.length) return;
    const newPhotos = valid.map(file => ({ id: Math.random().toString(36).slice(2), file, url: URL.createObjectURL(file) }));
    const updated = [...photos, ...newPhotos].slice(0, 8);
    setPhotos(updated);
    setAiAnalysis(null);
    setAiError(false);
    setAnalyzing(true);
    try {
      const analysis = await analyzePhotos(updated);
      if (analysis?.vibe) {
        setAiAnalysis(analysis);
        if (analysis.occasions?.length) setOccasions(analysis.occasions);
      } else { setAiError(true); }
    } catch { setAiError(true); }
    setAnalyzing(false);
  }, [photos]);

  const removePhoto = (id: string) => { setPhotos(prev => prev.filter(p => p.id !== id)); setAiAnalysis(null); setAiError(false); };
  const toggleOccasion = (o: string) => setOccasions(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const canProceed = () => {
    if (step === 0) return !analyzing;
    if (step === 1) return !!size;
    if (step === 2) return !!budget && occasions.length > 0;
    return false;
  };

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    const vibe = aiAnalysis?.vibe || "default";
    const items = CAPSULE_ITEMS[vibe] || CAPSULE_ITEMS.default;
    const retailers = secondhand
      ? [...(RETAILERS[vibe] || RETAILERS.default), "Depop", "ThredUp", "Poshmark"]
      : (RETAILERS[vibe] || RETAILERS.default);
    const budgetBreakdown = estimateBudget(parseInt(budget));
    const palette = aiAnalysis?.colorPalette?.length === 4
      ? aiAnalysis.colorPalette
      : ["#F5F0E8", "#C8B8A2", "#7D6B5E", "#2C2420"];
    setResult({ items, retailers, budgetBreakdown, vibe, palette, aiAnalysis });
    setLoading(false);
    setStep(3);
  };

  const reset = () => {
    setStep(0); setResult(null); setPhotos([]); setAiAnalysis(null); setAiError(false);
    setPinterestUrl(""); setStyleDesc(""); setSize("");
    setMeas({ height: "", bust: "", waist: "", hips: "", inseam: "" });
    setBudget(""); setFlex("strict"); setSecondhand(false); setOccasions([]);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="header">
          <div className="eyebrow">AI-Powered Styling</div>
          <div className="logo">Your Capsule <em>Wardrobe</em></div>
        </div>

        {step < 3 && (
          <div className="progress">
            {[0, 1, 2].map((s, i) => (
              <div key={s} style={{ display: "contents" }}>
                {i > 0 && <div className={`pline${s <= step ? " done" : ""}`} />}
                <div className={`pdot${s === step ? " active" : s < step ? " done" : ""}`}>
                  {s < step ? "✓" : s + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="main">
          {/* Step 0: Upload Photos */}
          {step === 0 && !loading && (
            <>
              <div className="step-title">Upload Your Style</div>
              <div className="step-sub">Share photos of your outfits or wardrobe</div>

              <div
                className="upload-zone"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addPhotos(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                style={dragging ? { borderColor: "#9B7E6E", background: "rgba(155,126,110,.1)" } : undefined}
              >
                <div className="upload-icon">↑</div>
                <div className="upload-title">Drop photos here</div>
                <div className="upload-hint">Up to 8 images · JPG, PNG, WEBP</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => addPhotos(e.target.files)}
                />
              </div>

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map(p => (
                    <div className="photo-thumb" key={p.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt="" />
                      <button
                        className="photo-remove"
                        onClick={(e) => { e.stopPropagation(); removePhoto(p.id); }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              {analyzing && (
                <div className="analyzing">
                  <div className="analyze-spinner" />
                  <div className="analyze-text">Analyzing your style...</div>
                </div>
              )}

              {aiAnalysis && (
                <div className="ai-result">
                  <div className="ai-result-label">AI Style Analysis</div>
                  <div className="ai-chips">
                    <span className="ai-chip">{VIBE_LABEL[aiAnalysis.vibe] || aiAnalysis.vibe}</span>
                    {aiAnalysis.keywords?.map((k) => <span className="ai-chip" key={k}>{k}</span>)}
                  </div>
                  {aiAnalysis.colorPalette?.length > 0 && (
                    <div className="ai-palette">
                      {aiAnalysis.colorPalette.map((c, i) => (
                        <div className="ai-swatch" key={i} style={{ background: c }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {aiError && (
                <div style={{ marginTop: 14, padding: "12px 16px", background: "rgba(155,126,110,.08)", fontSize: 11, color: "#9B7E6E" }}>
                  Could not analyze photos — you can still continue
                </div>
              )}

              <div className="field" style={{ marginTop: 28 }}>
                <label>Pinterest Board URL (optional)</label>
                <input value={pinterestUrl} onChange={e => setPinterestUrl(e.target.value)} placeholder="https://pinterest.com/yourboard" />
              </div>

              <div className="field">
                <label>Describe your style in your own words (optional)</label>
                <textarea value={styleDesc} onChange={e => setStyleDesc(e.target.value)} placeholder="e.g. I love clean lines but also want warmth and ease..." />
              </div>

              <button className="btn" disabled={!canProceed()} onClick={() => setStep(1)}>
                {photos.length ? "Continue" : "Skip Photos & Continue"}
              </button>
            </>
          )}

          {/* Step 1: Size & Measurements */}
          {step === 1 && (
            <>
              <div className="step-title">Your Measurements</div>
              <div className="step-sub">So we can recommend the right fits and silhouettes</div>

              <div className="field">
                <label>Clothing Size</label>
                <div className="tag-group">
                  {["XS", "S", "M", "L", "XL", "XXL", "0", "2", "4", "6", "8", "10", "12", "14", "16"].map(s => (
                    <button key={s} className={`tag${size === s ? " sel" : ""}`} onClick={() => setSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Measurements (optional)</label>
                <div className="meas-grid">
                  {(Object.keys(meas) as (keyof Meas)[]).map(k => (
                    <div key={k}>
                      <label style={{ marginBottom: 4 }}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                      <input
                        value={meas[k]}
                        onChange={e => setMeas(prev => ({ ...prev, [k]: e.target.value }))}
                        placeholder={k === "height" ? "5'6\"" : "36\""}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn-ghost" onClick={() => setStep(0)}>Back</button>
                <button className="btn" disabled={!canProceed()} onClick={() => setStep(2)}>Continue</button>
              </div>
            </>
          )}

          {/* Step 2: Budget & Occasions */}
          {step === 2 && (
            <>
              <div className="step-title">Budget & Lifestyle</div>
              <div className="step-sub">We&apos;ll curate items within your price range</div>

              <div className="field">
                <label>Total Wardrobe Budget</label>
                <div className="bwrap">
                  <span className="bsym">$</span>
                  <input
                    className="binput"
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="1500"
                  />
                </div>
              </div>

              <div className="field">
                <label>Budget Flexibility</label>
                <div className="radio-row">
                  {([["strict", "Strict"], ["flexible", "Flexible +20%"], ["investment", "Investment Pieces"]] as [string, string][]).map(([val, label]) => (
                    <div key={val} className={`ropt${flex === val ? " sel" : ""}`} onClick={() => setFlex(val)}>{label}</div>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Occasions to Dress For</label>
                <div className="tag-group">
                  {OCCASIONS.map(o => (
                    <button key={o} className={`tag${occasions.includes(o) ? " sel" : ""}`} onClick={() => toggleOccasion(o)}>{o}</button>
                  ))}
                </div>
              </div>

              <div className="field">
                <div className="toggle-row" onClick={() => setSecondhand(!secondhand)}>
                  <div className={`tog${secondhand ? " on" : ""}`} />
                  <div>
                    <div className="tog-label">Include Secondhand</div>
                    <div className="tog-sub">Add Depop, ThredUp & Poshmark as shopping options</div>
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button className="btn" disabled={!canProceed()} onClick={generate}>Build My Capsule</button>
              </div>
            </>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading">
              <div className="load-spinner" />
              <div className="load-text">Curating your capsule...</div>
              <div className="load-sub">Personalizing to your style</div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && !loading && (
            <>
              <div className="result-hero">
                <div className="rh-eye">Your Capsule Wardrobe</div>
                <div className="rh-title"><em>{VIBE_LABEL[result.vibe] || "Curated"}</em> Collection</div>
                <div className="palette-strip">
                  {result.palette.map((c, i) => <div key={i} className="pbar" style={{ background: c }} />)}
                </div>
              </div>

              {result.aiAnalysis?.insights && (
                <div className="ai-insight">
                  <div className="ai-insight-label">Style Insight</div>
                  <div className="ai-insight-text">{result.aiAnalysis.insights}</div>
                </div>
              )}

              <div className="sec-label">Budget Breakdown</div>
              <div className="budget-grid">
                {result.budgetBreakdown.map(b => (
                  <div className="bcard" key={b.category}>
                    <div className="bc-cat">{b.category}</div>
                    <div className="bc-amt">${b.budget}</div>
                    <div className="bc-per">~${b.perItem} per item</div>
                  </div>
                ))}
              </div>

              <div className="divider" />

              {result.items.map((cat, ci) => {
                const bd = result.budgetBreakdown.find(b => b.category === cat.category);
                return (
                  <div className="cat-block" key={ci}>
                    <div className="cat-head">
                      <div className="cat-name">{cat.category}</div>
                      {bd && <div className="cat-bud">${bd.budget} total</div>}
                    </div>
                    <div className="item-list">
                      {cat.items.map((item, ii) => (
                        <div className="item-row" key={ii}>
                          <div className="item-name">{item}</div>
                          <div className="shop-links">
                            {result.retailers.map(r => (
                              <a key={r} className="slink" href={buildShopUrl(r, item)} target="_blank" rel="noopener noreferrer">{r}</a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="tip-box">
                <div className="tip-t">Style Tip</div>
                <div className="tip-txt">{TIPS[result.vibe] || TIPS.default}</div>
              </div>

              <button className="btn-ghost" style={{ marginTop: 36 }} onClick={reset}>Start Over</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
