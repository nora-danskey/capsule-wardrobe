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

const NATURAL_FIBER_BRANDS = ["Quince", "Everlane", "Eileen Fisher", "Pact", "Thought Clothing", "Patagonia"];

const ETHICAL_BRANDS_LIST = [
  "Quince", "Pact", "Thought Clothing", "Eileen Fisher", "Reformation",
  "Tradlands", "Taylor Stitch", "Amour Vert", "Able", "Kotn",
  "Everlane", "Christy Dawn", "Hackwith Design House",
];

function getFiberNote(item: string): string {
  const s = item.toLowerCase();
  if (s.includes("cashmere")) return "cashmere";
  if (s.includes("silk")) return "silk";
  if (s.includes("linen")) return "linen";
  if (s.includes("merino") || s.includes("wool") || s.includes("turtleneck") || s.includes("fine-knit") || s.includes("sweater") || s.includes("cardigan") || s.includes("pullover")) return "wool or cashmere";
  if (s.includes("blouse") || s.includes("cami") || s.includes("shell")) return "silk or cotton";
  if (s.includes("denim") || s.includes("jean")) return "cotton denim";
  if (s.includes("hoodie") || s.includes("shirt") || s.includes("oxford") || s.includes("button-down") || s.includes("tee") || s.includes("tank") || s.includes("polo") || s.includes("henley")) return "cotton";
  if (s.includes("trouser") || s.includes("pant") || s.includes("slack") || s.includes("chino")) return "wool or cotton";
  if (s.includes("skirt")) return "cotton, linen, or silk";
  if (s.includes("dress")) return "cotton, linen, or silk";
  if (s.includes("trench") || s.includes("coat")) return "wool or cotton";
  if (s.includes("blazer") || s.includes("jacket") || s.includes("kimono")) return "wool, linen, or cotton";
  if (s.includes("boot") || s.includes("loafer") || s.includes("pump") || s.includes("flat") || s.includes("mule") || s.includes("sandal") || s.includes("sneaker")) return "leather or canvas";
  if (s.includes("bag") || s.includes("tote") || s.includes("clutch") || s.includes("crossbody") || s.includes("satchel") || s.includes("backpack")) return "leather or cotton canvas";
  return "natural fibers";
}

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
    "Eileen Fisher": `https://www.eileenfisher.com/search?q=${q}`,
    "Pact": `https://wearpact.com/search?q=${q}`,
    "Thought Clothing": `https://www.wearethought.com/search?q=${q}`,
    "Tradlands": `https://tradlands.com/search?q=${q}`,
    "Taylor Stitch": `https://www.taylorstitch.com/search?q=${q}`,
    "Amour Vert": `https://amourvert.com/search?q=${q}`,
    "Able": `https://www.livefashionable.com/search?q=${q}`,
    "Kotn": `https://kotn.com/search?q=${q}`,
    "Christy Dawn": `https://christydawn.com/search?q=${q}`,
    "Hackwith Design House": `https://hackwithdesignhouse.com/search?q=${q}`,
    "Patagonia": `https://www.patagonia.com/search/?q=${q}`,
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

function compressImage(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1500;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Could not get canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function analyzePhotos(photos: { id: string; file: File; url: string }[]) {
  const images = await Promise.all(photos.map((photo) => compressImage(photo.file)));

  const response = await fetch("/wardrobe/api/analyze", {
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
  naturalFibers: boolean;
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
  const [naturalFibers, setNaturalFibers] = useState(false);
  const [ethicalBrands, setEthicalBrands] = useState(false);
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
    let retailers: string[];
    if (ethicalBrands && naturalFibers) {
      const both = ETHICAL_BRANDS_LIST.filter(b => NATURAL_FIBER_BRANDS.includes(b));
      const ethicalOnly = ETHICAL_BRANDS_LIST.filter(b => !NATURAL_FIBER_BRANDS.includes(b));
      retailers = [...both, ...ethicalOnly];
    } else if (ethicalBrands) {
      retailers = [...ETHICAL_BRANDS_LIST];
    } else if (naturalFibers) {
      const vibeRetailers = RETAILERS[vibe] || RETAILERS.default;
      const remaining = vibeRetailers.filter(r => !NATURAL_FIBER_BRANDS.includes(r));
      retailers = [...NATURAL_FIBER_BRANDS, ...remaining];
    } else {
      retailers = RETAILERS[vibe] || RETAILERS.default;
    }
    if (secondhand) retailers = [...retailers, "Depop", "ThredUp", "Poshmark"];
    const budgetBreakdown = estimateBudget(parseInt(budget));
    const palette = aiAnalysis?.colorPalette?.length === 4
      ? aiAnalysis.colorPalette
      : ["#F5F0E8", "#C8B8A2", "#7D6B5E", "#2C2420"];
    setResult({ items, retailers, budgetBreakdown, vibe, palette, aiAnalysis, naturalFibers });
    setLoading(false);
    setStep(3);
  };

  const reset = () => {
    setStep(0); setResult(null); setPhotos([]); setAiAnalysis(null); setAiError(false);
    setPinterestUrl(""); setStyleDesc(""); setSize("");
    setMeas({ height: "", bust: "", waist: "", hips: "", inseam: "" });
    setBudget(""); setFlex("strict"); setSecondhand(false); setNaturalFibers(false); setEthicalBrands(false); setOccasions([]);
  };

  return (
    <>
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

              <label
                htmlFor="photo-upload"
                className="upload-zone"
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); addPhotos(e.dataTransfer.files); }}
                style={dragging ? { borderColor: "#9B7E6E", background: "rgba(155,126,110,.1)" } : undefined}
              >
                <div className="upload-icon">↑</div>
                <div className="upload-title">Drop photos here</div>
                <div className="upload-hint">Up to 8 images · JPG, PNG, WEBP</div>
              </label>
              <input
                id="photo-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => addPhotos(e.target.files)}
              />

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

              <div className="field">
                <div className="toggle-row" onClick={() => setNaturalFibers(!naturalFibers)}>
                  <div className={`tog${naturalFibers ? " on" : ""}`} />
                  <div>
                    <div className="tog-label">Natural fibers only</div>
                    <div className="tog-sub">Cotton, linen, wool, silk, cashmere — no synthetics</div>
                  </div>
                </div>
              </div>

              <div className="field">
                <div className="toggle-row" onClick={() => setEthicalBrands(!ethicalBrands)}>
                  <div className={`tog${ethicalBrands ? " on" : ""}`} />
                  <div>
                    <div className="tog-label">Small or ethical brands only</div>
                    <div className="tog-sub">B-corps, independent designers, sustainability-certified</div>
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
                          <div className="item-name">
                            {item}
                            {result.naturalFibers && (
                              <div className="fiber-note">look for: {getFiberNote(item)}</div>
                            )}
                          </div>
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
