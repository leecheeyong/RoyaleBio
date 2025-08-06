<template>
  <div class="min-h-screen py-16 px-4">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
        RoyaleBio
      </h1>
      <p class="text-lg text-gray-600 mb-10">
        Discover your Clash Royale progress and stats
      </p>
      <div class="w-full max-w-md mx-auto mb-10">
        <input
          v-model="searchTag"
          @keyup.enter="searchPlayer"
          type="text"
          placeholder="Enter player tag (e.g., #2PP)"
          class="w-full border border-gray-200 rounded px-5 py-3 text-base focus:ring-1 focus:ring-blue-200 focus:outline-none bg-white text-gray-800 shadow-sm transition-all"
          :class="{ 'border-red-400': searchError }"
        />
        <button
          @click="searchPlayer"
          class="w-full mt-3 py-3 rounded bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors disabled:opacity-50"
          :disabled="!searchTag.trim() || loading"
        >
          <span v-if="!loading">Search Player</span>
          <span v-else>Searching...</span>
        </button>
        <p v-if="searchError" class="text-red-500 text-sm mt-2">
          {{ searchError }}
        </p>
        <div class="mt-5">
          <p class="text-gray-500 text-xs mb-2">Try these example tags:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="tag in sampleTags"
              :key="tag"
              @click="
                searchTag = tag;
                searchPlayer();
              "
              class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors border border-gray-200"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-8 mb-14">
        <div
          class="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-1">Player Stats</h3>
          <p class="text-gray-600 text-sm">
            Detailed player statistics and progress 
          </p>
        </div>
        <div
          class="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Battle History
          </h3>
          <p class="text-gray-600 text-sm">
            Detailed player statistics and cards progress
          </p>
        </div>
        <div
          class="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Clan Analytics
          </h3>
          <p class="text-gray-600 text-sm">
            Explore clan details and member rankings 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const searchTag = ref("");
const searchError = ref("");
const loading = ref(false);
const sampleTags = ["#8CP0VUQ", "#2LJUULCJJ", "#LQ8YCQ0G"];
function searchPlayer() {
  if (!searchTag.value.trim()) {
    searchError.value = "Please enter a player tag";
    return;
  }
  searchError.value = "";
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    const tag = searchTag.value.trim().replace("#", "");
    router.push(`/player/${tag}`);
  }, 500);
}
</script>
