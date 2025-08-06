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
        <span class="text-base text-gray-500 font-medium">Loading clan data...</span>
      </div>
      <div
        v-else-if="error"
        class="bg-white border border-gray-200 rounded p-8 text-center"
      >
        <div class="text-red-400 text-6xl mb-4">🏰</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Clan Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="$emit('goHome')"
          class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
      <div v-else-if="clanData" class="space-y-8">
        <div
          class="bg-white border border-gray-200 rounded-md p-6 animate-fade-in"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {{ clanData.name }}
              </h1>
              <p class="text-blue-600 font-mono text-base sm:text-lg">
                {{ formatTag(clanData.tag) }}
              </p>
              <p
                v-if="clanData.description"
                class="text-gray-700 mt-2 max-w-2xl"
              >
                {{ clanData.description }}
              </p>
            </div>
            <div class="flex flex-col items-end w-full sm:w-auto">
              <div class="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl px-4 sm:px-5 py-2 sm:py-3 shadow text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 w-full sm:w-auto text-center">
                {{ formatNumber(clanData.clanScore || 0) }}
              </div>
              <div class="text-sm text-gray-700 font-semibold tracking-wide text-center sm:text-right">Clan Score</div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-blue-400">
                {{ clanData.members || 0 }}/50
              </div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">
                Members
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-green-400">
                {{ formatNumber(clanData.clanWarTrophies || 0) }}
              </div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">
                War Trophies
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-purple-400">
                {{ clanData.requiredTrophies || 0 }}
              </div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">
                Required
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-xl font-bold text-orange-400">
                {{ clanData.donationsPerWeek || 0 }}
              </div>
              <div class="text-xs text-gray-600 uppercase tracking-wide">
                Weekly Donations
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Members ({{ clanData.memberList?.length || 0 }})
          </h2>
          <div v-if="clanData.memberList?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <router-link
              v-for="(member, index) in sortedMembers"
              :key="member.tag"
              class="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg hover:bg-blue-50 transition-all duration-200 card-hover cursor-pointer min-w-0"
              :class="{ 'border-2 border-yellow-400': index < 3 }"
              :to="'/player/' + member.tag.slice(1)"
            >
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow"
                    :class="getRankColor(index + 1)"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-lg font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                    {{ member.name }}
                  </div>
                  <div class="text-gray-600 text-xs font-mono truncate">{{ formatTag(member.tag) }}</div>
                  <div class="text-xs text-blue-600 capitalize mt-1">{{ member.role }}</div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-extrabold text-yellow-400">{{ member.trophies }}</div>
                  <div class="text-xs text-gray-600">Trophies</div>
                </div>
              </div>
            </router-link>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-400 text-4xl mb-4">👥</div>
            <p class="text-gray-500">No members found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const loading = ref(false);
const error = ref("");
const clanData = ref(null);
const sortedMembers = computed(() => {
  if (!clanData.value?.memberList) return [];
  return [...clanData.value.memberList].sort((a, b) => b.trophies - a.trophies);
});

function encodeTag(tag) {
  let cleanTag = tag.trim();
  if (cleanTag.startsWith("#")) cleanTag = cleanTag.replace("#", "");
  if (cleanTag.startsWith("%23")) cleanTag = decodeURIComponent(cleanTag);
  return `%23${cleanTag}`;
}

async function fetchClanProfile(tag) {
  if (!tag) return;
  loading.value = true;
  error.value = "";
  try {
    const encodedTag = encodeTag(tag);
    const clan = await fetch(
      `https://leecheeyong.vercel.app/supercell?type=cr&endpoint=clans/${encodedTag}`,
    ).then((r) => r.json());
    if (clan && clan.tag) {
      clanData.value = clan;
    } else {
      error.value = "Clan not found.";
      clanData.value = null;
    }
  } catch (err) {
    error.value = err.message || "An unexpected error occurred.";
    clanData.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchClanProfile(route.params.tag);
});

watch(
  () => route.params.tag,
  (newTag) => {
    fetchClanProfile(newTag);
  },
);

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
function getRankColor(rank) {
  if (rank === 1) return "bg-yellow-500 text-black";
  if (rank === 2) return "bg-gray-400 text-black";
  if (rank === 3) return "bg-orange-600 text-white";
  return "bg-gray-600 text-white";
}
</script>
