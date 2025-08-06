<template>
  <div
    id="app"
    class="min-h-screen bg-gray-50 text-gray-800 font-sans text-[17px]"
  >
    <nav
      class="bg-white border-b border-gray-100 mx-0 mt-0 mb-8 sticky top-0 z-50"
    >
      <div
        class="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between"
      >
        <router-link
          to="/"
          class="flex items-center space-x-2 focus:outline-none"
        >
          <img src="/logo.png" alt="RoyaleBio Logo" class="w-8 h-8 rounded" />
          <span class="text-xl font-semibold text-gray-800 tracking-tight"
            >RoyaleBio</span
          >
        </router-link>
        <div class="hidden md:flex items-center space-x-2">
          <router-link
            to="/"
            class="px-3 py-1 rounded text-base font-medium focus:outline-none transition-colors"
            :class="{
              'text-blue-600 font-semibold bg-blue-50': route.path === '/',
              'text-gray-600 hover:bg-gray-100': route.path !== '/',
            }"
          >
            Home
          </router-link>
          <router-link
            to="/cards"
            class="px-3 py-1 rounded text-base font-medium focus:outline-none transition-colors"
            :class="{
              'text-blue-600 font-semibold bg-blue-50': route.path === '/cards',
              'text-gray-600 hover:bg-gray-100': route.path !== '/cards',
            }"
          >
            Cards
          </router-link>
        </div>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded bg-gray-100 focus:outline-none"
        >
          <svg
            class="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="
                mobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              "
            />
          </svg>
        </button>
      </div>
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-100 bg-white animate-fade-in px-6 py-2"
      >
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="block w-full text-left py-2 px-2 text-gray-800 hover:bg-gray-100 rounded"
        >
          Home
        </router-link>
        <router-link
          to="/cards"
          @click="mobileMenuOpen = false"
          class="block w-full text-left py-2 px-2 text-gray-800 hover:bg-gray-100 rounded"
        >
          Cards
        </router-link>
      </div>
    </nav>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <KeepAlive>
          <Suspense timeout="0">
            <component :is="Component"></component>

            <template #fallback>
              <div class="flex justify-center items-center h-screen">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="animate-spin text-5xl text-primary-100"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  style="fill: rgba(0, 0, 0, 1)"
                >
                  <path
                    d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                  ></path>
                </svg>
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </template>
    </RouterView>
    <footer class="py-8 text-center text-gray-500 text-sm">
      <p>
        Made with <span class="text-red-500">❤️</span> by
        <a
          href="https://github.com/leecheeyong"
          target="_blank"
          class="text-gray-700 hover:underline"
        >
          Chee Yong Lee
        </a>
      </p>
      <p class="mt-1">
        Project available as open source under the terms of
        <a
          href="https://github.com/leecheeyong/RoyaleBio/blob/main/LICENSE"
          target="_blank"
          class="text-gray-700 hover:underline"
          >MIT License</a
        >
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const mobileMenuOpen = ref(false);

const searchTag = ref("");
const searchError = ref("");
const loading = ref(false);
const loadingBattles = ref(false);
const error = ref("");

const playerData = ref(null);
const battles = ref([]);
const clanData = ref(null);

const cardSearchQuery = ref("");
const selectedRarity = ref(null);
const rarities = ["Common", "Rare", "Epic", "Legendary", "Champion"];

const sampleTags = ["#8CP0VUQ", "#2LJUULCJJ", "#LQ8YCQ0G"];

const cards = ref([]);

onMounted(async () => {
  try {
    const result = await apiRequest("cards");
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

const sortedMembers = computed(() => {
  if (!clanData.value?.memberList) return [];
  return [...clanData.value.memberList].sort((a, b) => b.trophies - a.trophies);
});

const encodeTag = (tag) => {
  if (!tag) return "";
  let cleanTag = tag.trim();
  if (cleanTag.startsWith("#")) cleanTag = cleanTag.replace("#", "");
  if (cleanTag.startsWith("%23")) cleanTag = decodeURIComponent(cleanTag);
  return `%23${cleanTag}`;
};

async function apiRequest(endpoint) {
  let attempts = 0;
  const maxAttempts = 3;
  let lastError;
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://leecheeyong.vercel.app/supercell?type=cr&endpoint=${endpoint}`,
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      attempts++;
      if (attempts >= maxAttempts) {
        console.error("API Request failed after retries:", error);
        throw error;
      }
    }
  }
}
</script>
