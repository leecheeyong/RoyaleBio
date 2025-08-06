<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <router-link
        to="/"
        class="btn-secondary mb-6 flex items-center space-x-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back</span>
      </router-link>
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 min-h-[200px]">
        <div class="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-base text-gray-500 font-medium">Loading player data...</span>
      </div>
      <div
        v-else-if="error"
        class="bg-white border border-gray-200 rounded p-8 text-center"
      >
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link
          to="/"
          class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Search Another Player
    </router-link>
      </div>
      <div v-else-if="playerData" class="space-y-8">
        <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-2 flex flex-col gap-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div class="flex flex-col items-start min-w-0">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">{{ playerData.name }}</h2>
              <p class="text-blue-600 font-mono mb-2 break-all text-sm sm:text-base">{{ formatTag(playerData.tag) }}</p>
              <div v-if="playerData.clan" class="flex flex-wrap items-center gap-2">
                <router-link
                  :to="'/clan/' + playerData.clan.tag.slice(1)"
                  class="text-base font-semibold text-blue-700 hover:underline focus:underline transition-colors truncate"
                >
                  {{ playerData.clan.name }}
                </router-link>
                <router-link
                  :to="'/clan/' + playerData.clan.tag.slice(1)"
                  class="text-xs text-blue-500 font-mono hover:underline focus:underline transition-colors truncate"
                >
                  {{ formatTag(playerData.clan.tag) }}
                </router-link>
              </div>
            </div>
            <div class="text-right flex flex-col items-end">
              <div class="text-2xl sm:text-3xl font-bold text-yellow-400">{{ playerData.trophies }}</div>
              <div class="text-xs sm:text-sm text-gray-600">Trophies</div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-blue-400">{{ playerData.expLevel }}</div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">Level</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-green-400">{{ formatNumber(playerData.wins || 0) }}</div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">Wins</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-red-400">{{ formatNumber(playerData.losses || 0) }}</div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">Losses</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-purple-400">{{ playerData.bestTrophies }}</div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">Best</div>
            </div>
          </div>
          <div v-if="playerData.currentDeck" class="border-t border-gray-200 pt-4">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Current Deck</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-items-center items-center">
              <div v-for="card in playerData.currentDeck" :key="card.id" class="relative group flex flex-col items-center min-w-[64px] min-h-[64px] sm:min-w-[80px] sm:min-h-[80px] md:min-w-[96px] md:min-h-[96px]">
                <img
                  :src="getCardImageUrl(card.id, false)"
                  :alt="card.name"
                  class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 transition-transform group-hover:scale-110 object-contain"
                  loading="lazy"
                />
                <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
                  {{ card.level }}
                </div>
                <span class="mt-2 text-xs text-gray-700 text-center font-medium truncate w-full">{{ card.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Recent Battles</h2>
            <button
              @click="loadBattleLog"
              :disabled="loadingBattles"
              class="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span v-if="!loadingBattles">Refresh</span>
              <span v-else class="flex items-center">
                <div
                  class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
                ></div>
                Loading...
              </span>
            </button>
          </div>
          <div
            v-if="loadingBattles && !battles.length"
            class="flex items-center justify-center py-8"
          >
            <div class="relative">
              <div
                class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
              ></div>
            </div>
            <span class="ml-3 text-gray-300 animate-pulse"
              >Loading battles...</span
            >
          </div>
          <div v-else-if="battles.length > 0" class="grid gap-4">
            <div
              v-for="(battle, index) in battles.slice(0, 10)"
              :key="index"
              class="bg-white border border-gray-200 rounded-md p-4 card-hover animate-slide-up shadow-sm"
            >
              <div
                class="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2"
              >
                <div class="flex items-center space-x-3 w-full sm:w-auto">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="
                      battle.team[0].crowns >
                      (battle.opponent?.[0]?.crowns || 0)
                        ? 'bg-green-500'
                        : battle.team[0].crowns ===
                            (battle.opponent?.[0]?.crowns || 0)
                          ? 'bg-gray-400'
                          : 'bg-red-500'
                    "
                  ></div>
                  <div>
                    <div
                      class="font-semibold text-gray-900 text-base sm:text-lg"
                    >
                      {{ formatBattleType(battle.gameMode?.name, battle.type) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ timeAgo(battle.battleTime) }}
                    </div>
                  </div>
                </div>
                <div class="text-right w-full sm:w-auto">
                  <div
                    class="text-lg font-bold"
                    :class="
                      battle.team[0].crowns >
                      (battle.opponent?.[0]?.crowns || 0)
                        ? 'text-green-600'
                        : battle.team[0].crowns ===
                            (battle.opponent?.[0]?.crowns || 0)
                          ? 'text-gray-600'
                          : 'text-red-600'
                    "
                  >
                    {{ battle.team[0].crowns }} -
                    {{ battle.opponent?.[0]?.crowns || 0 }}
                  </div>
                  <div class="text-xs text-gray-500">Crowns</div>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div class="flex items-center mb-1">
                    <span class="font-semibold text-gray-900 mr-2">{{
                      battle.team[0].name
                    }}</span>
                    <span
                      v-if="battle.team[0].clan && battle.team[0].clan.name"
                      class="text-xs text-blue-600 font-mono"
                      >{{ battle.team[0].clan.name }}</span
                    >
                  </div>
                  <div class="text-xs text-gray-500 mb-1">
                    Trophy Change:
                    <span
                      :class="
                        battle.team[0].trophyChange > 0
                          ? 'text-green-600'
                          : battle.team[0].trophyChange < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                      "
                      >{{ battle.team[0].trophyChange > 0 ? "+" : ""
                      }}{{ battle.team[0].trophyChange }}</span
                    >
                  </div>
                  <div class="grid grid-cols-4 gap-1 sm:gap-2">
                    <img
                      v-for="card in battle.team[0].cards || []"
                      :key="card.id"
                      :src="getCardImageUrl(card.id)"
                      :alt="card.name"
                      class="w-full h-auto rounded transition-transform hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <div class="flex items-center mb-1">
                    <span class="font-semibold text-gray-900 mr-2">{{
                      battle.opponent?.[0]?.name || "Unknown"
                    }}</span>
                    <span
                      v-if="
                        battle.opponent?.[0]?.clan &&
                        battle.opponent[0].clan.name
                      "
                      class="text-xs text-blue-600 font-mono"
                      >{{ battle.opponent[0].clan.name }}</span
                    >
                  </div>
                  <div class="text-xs text-gray-500 mb-1">
                    Trophy Change:
                    <span
                      :class="
                        battle.opponent?.[0]?.trophyChange > 0
                          ? 'text-green-600'
                          : battle.opponent?.[0]?.trophyChange < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                      "
                      >{{ battle.opponent?.[0]?.trophyChange > 0 ? "+" : ""
                      }}{{ battle.opponent?.[0]?.trophyChange || 0 }}</span
                    >
                  </div>
                  <div class="grid grid-cols-4 gap-1 sm:gap-2">
                    <img
                      v-for="card in battle.opponent?.[0]?.cards || []"
                      :key="card.id"
                      :src="getCardImageUrl(card.id)"
                      :alt="card.name"
                      class="w-full h-auto rounded transition-transform hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-400 text-4xl mb-4">🏆</div>
            <p class="text-gray-500">No recent battles found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const loading = ref(false);
const loadingBattles = ref(false);
const error = ref("");
const playerData = ref(null);
const battles = ref([]);

async function fetchPlayerProfile(tag) {
  if (!tag) return;
  loading.value = true;
  error.value = "";
  try {
    const encodedTag = encodeTag(tag);
    const player = await fetch(
      `https://leecheeyong.vercel.app/supercell?type=cr&endpoint=players/${encodedTag}`,
    ).then((r) => r.json());
    if (player && player.tag) {
      playerData.value = player;
      await loadBattleLog();
    } else {
      error.value = "Player not found.";
      playerData.value = null;
      battles.value = [];
    }
  } catch (err) {
    error.value = err.message || "An unexpected error occurred.";
    playerData.value = null;
    battles.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchPlayerProfile(route.params.tag);
});

watch(
  () => route.params.tag,
  (newTag) => {
    fetchPlayerProfile(newTag);
  },
);

function encodeTag(tag) {
  let cleanTag = tag.trim();
  if (cleanTag.startsWith("#")) cleanTag = cleanTag.replace("#", "");
  if (cleanTag.startsWith("%23")) cleanTag = decodeURIComponent(cleanTag);
  return `%23${cleanTag}`;
}

async function loadBattleLog() {
  if (!playerData.value || !playerData.value.tag) return;
  loadingBattles.value = true;
  try {
    const encodedTag = encodeTag(playerData.value.tag);
    battles.value = await fetch(
      `https://leecheeyong.vercel.app/supercell?type=cr&endpoint=players/${encodedTag}/battlelog`,
    ).then((r) => r.json());
  } catch (err) {
  } finally {
    loadingBattles.value = false;
  }
}

function formatTag(tag) {
  return tag.startsWith("#") ? tag : `#${tag}`;
}
function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
function getCardImageUrl(cardId, active = false) {
  const suffix = active ? "_active.webp" : ".webp";
  return `https://cdn.statsroyale.com/v6/cards/small/${cardId}${suffix}`;
}
function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  return "Recently";
}
function formatBattleType(gameModeName, type) {
  if (!gameModeName && !type) return "Battle";
  if (!gameModeName) return type;
  let formatted = gameModeName.replace(/_/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");
  const parts = formatted.split(" ");
  if (parts.length > 1) {
    return (
      parts[0] +
      " " +
      parts[1] +
      (parts.slice(2).length ? " (" + parts.slice(2).join(" ") + ")" : "")
    );
  }
  return formatted;
}
</script>
