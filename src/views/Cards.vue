<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Card Explorer
        </h1>
        <p class="text-gray-700 text-lg font-medium">
          Explore all Clash Royale cards and their rarities
        </p>
      </div>
      <div
        class="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-lg"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="rarity in rarities"
              :key="rarity"
              @click="
                selectedRarity = selectedRarity === rarity ? null : rarity
              "
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 hover:bg-blue-100"
              :class="
                selectedRarity === rarity
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-700 hover:bg-white/20 border border-gray-300'
              "
            >
              {{ rarity }}
            </button>
          </div>
          <div class="relative w-full sm:w-auto">
            <input
              v-model="cardSearchQuery"
              type="text"
              placeholder="Search cards..."
              class="input-primary pl-10 w-full sm:w-64 font-semibold text-gray-900 border border-gray-300 bg-white rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <transition-group
        name="card-fade"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      >
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="bg-white border border-gray-200 rounded-xl p-6 group flex flex-col items-center hover:bg-blue-50 transition-all duration-300 shadow-md transform hover:scale-105 min-w-0"
        >
          <div class="relative w-full flex flex-col items-center">
            <div class="aspect-square w-full flex items-center justify-center">
              <img
                :src="getCardImageUrl(card.id, false)"
                :alt="card.name"
                class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain transition-all duration-300"
                loading="lazy"
              />
            </div>
            <div
              class="absolute top-2 right-2 px-2 py-1 rounded-xl text-xs font-bold shadow-md"
              :class="getRarityBg(card.rarity)"
            >
              {{ card.rarity }}
            </div>
          </div>
          <h3
            class="mt-3 text-base font-bold text-gray-900 text-center w-full break-words whitespace-normal tracking-tight"
          >
            {{ card.name || card.Name }}
          </h3>
        </div>
      </transition-group>
      <div v-if="filteredCards.length === 0" class="text-center py-16">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-extrabold text-gray-900 mb-2">
          No cards found
        </h3>
        <p class="text-gray-700 font-medium">
          Try adjusting your search or filters
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
const cards = ref([]);
const cardSearchQuery = ref("");
const selectedRarity = ref(null);
const rarities = ["Common", "Rare", "Epic", "Legendary", "Champion"];

onMounted(async () => {
  try {
    const result = await fetch(
      "https://leecheeyong.vercel.app/supercell?type=cr&endpoint=cards",
    ).then((r) => r.json());
    if (result && Array.isArray(result)) {
      cards.value = result;
    } else if (result && result.items) {
      cards.value = result.items;
    }
  } catch (err) {
    console.error("Error fetching cards:", err);
  }
});

const filteredCards = computed(() => {
  let filtered = cards.value;
  if (cardSearchQuery.value) {
    filtered = filtered.filter((card) =>
      card.name.toLowerCase().includes(cardSearchQuery.value.toLowerCase()),
    );
  }
  if (selectedRarity.value) {
    filtered = filtered.filter((card) => {
      const rarity = card.rarity || card.Rarity || "";
      return rarity.toLowerCase() === selectedRarity.value.toLowerCase();
    });
  }
  return filtered;
});

function getCardImageUrl(cardId, active = false) {
  const suffix = active ? "_active.webp" : ".webp";
  return `https://cdn.statsroyale.com/v6/cards/small/${cardId}${suffix}`;
}

function getRarityBg(rarity) {
  const colors = {
    Common: "bg-gray-800 text-white border border-gray-400",
    Rare: "bg-orange-600 text-white border border-orange-300",
    Epic: "bg-purple-700 text-white border border-purple-300",
    Legendary: "bg-yellow-500 text-black border border-yellow-300",
    Champion: "bg-red-600 text-white border border-red-300",
  };
  return colors[rarity] || "bg-gray-800 text-white border border-gray-400";
}
</script>
<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.card-fade-enter-to,
.card-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
