const API_KEY = 'UhFh6M55gJrvqjgZqUyk-3iETD77Bnwx';
const API_URL = 'https://corsproxy.io/?https://csfloat.com/api/v1/listings';

const TIER_1 = [661, 151, 955, 321, 387, 670, 179];
const TIER_2 = [592, 4, 905, 13, 168, 429];
const TIER_3 = [555, 442, 978, 139, 828, 969, 750, 695, 103, 112, 733, 844, 228, 868, 434, 698, 74, 996, 760, 375, 708, 823, 690, 791, 278, 917, 463, 711, 849, 92, 82, 450, 512, 310, 713, 11, 721, 236, 172, 950, 147, 782, 322, 363, 189, 961, 497, 430, 887, 426, 862];

const MAX_PRICE = {
  TIER_1: 60000,
  TIER_2: 60000,
  TIER_3: 38000,
};

function getWearName(floatVal) {
  if (floatVal <= 0.07) return 'Factory New';
  if (floatVal <= 0.15) return 'Minimal Wear';
  if (floatVal <= 0.38) return 'Field-Tested';
  return 'Too Worn';
}

function getTier(seed) {
  if (TIER_1.includes(seed)) return 'Tier 1';
  if (TIER_2.includes(seed)) return 'Tier 2';
  if (TIER_3.includes(seed)) return 'Tier 3';
  return null;
}

async function fetchListings() {
  const res = await fetch(`${API_URL}?paint_index=44&min_float=0.01&max_float=0.38&limit=50`, {
    headers: { 'Authorization': API_KEY }
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

function showAlert(item, tier, wear, price) {
  const alertsDiv = document.getElementById('alerts');
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.innerHTML = `
    <strong>${tier} - ${wear}</strong><br>
    Prix: €${(price / 100).toFixed(2)}<br>
    <button onclick="window.open('https://csfloat.com/item/${item.id}', '_blank')">Voir sur CSFloat</button>
  `;
  alertsDiv.prepend(alert);
  document.getElementById('alert-sound').play();
}

async function checkForDeals() {
  document.getElementById('status').innerText = 'Checking listings...';
  try {
    const listings = await fetchListings();
    for (const item of listings) {
      const seed = item.item.paint_seed;
      const price = item.price;
      const float = item.item.float_value;

      const tier = getTier(seed);
      if (!tier) continue;

      const wear = getWearName(float);
      const isMWOrBetter = float <= 0.15;

      const maxPrice = MAX_PRICE[tier.replace(' ', '_').toUpperCase()];

      if (tier === 'Tier 3' && !isMWOrBetter) continue;

      if (price <= maxPrice) {
        showAlert(item, tier, wear, price);
      }
    }
    document.getElementById('status').innerText = 'Scan completed';
  } catch (err) {
    console.error(err);
    document.getElementById('status').innerText = 'Erreur lors du scan';
  }
}

setInterval(checkForDeals, 30000);
checkForDeals();
