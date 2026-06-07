/* =========================================================================
   OPTIONAL - multi-item cart checkout (Cloudflare Worker)
   Only needed if you want ONE combined checkout for a multi-item cart.
   For a single-product-at-a-time store you can skip this entirely and just
   use per-product Stripe Payment Links (products.js → stripe).

   DEPLOY (free):
   1. Create a Cloudflare account → Workers & Pages → Create Worker.
   2. Paste this file in. Add a secret: STRIPE_SECRET_KEY = sk_live_...
   3. In Stripe, create a Price for each product and map id → priceId below.
   4. Deploy, copy the worker URL, and set CHECKOUT_ENDPOINT in store.js
      to  https://<your-worker>.workers.dev
   ========================================================================= */

// Map each product id (from products.js) to its Stripe Price ID.
const PRICE_MAP = {
  "translator-earbuds": "price_xxx",
  "clip-earbuds":       "price_xxx",
  "levitating-speaker": "price_xxx",
  "laser-keyboard":     "price_xxx",
  "fingerprint-padlock":"price_xxx",
  "item-tracker":       "price_xxx",
  "massage-gun":        "price_xxx",
  "recorder-pen":       "price_xxx",
  "sleep-mask":         "price_xxx",
  "laser-measure":      "price_xxx"
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

    try {
      const { items } = await request.json();
      const params = new URLSearchParams();
      params.append("mode", "payment");
      params.append("success_url", "https://YOUR-DOMAIN/success.html");
      params.append("cancel_url", "https://YOUR-DOMAIN/index.html");
      params.append("shipping_address_collection[allowed_countries][0]", "GB");

      let i = 0;
      for (const line of items) {
        const price = PRICE_MAP[line.id];
        if (!price) continue;
        params.append(`line_items[${i}][price]`, price);
        params.append(`line_items[${i}][quantity]`, String(line.qty || 1));
        i++;
      }

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      const session = await res.json();
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...CORS, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }
  }
};
