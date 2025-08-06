<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="text-center max-w-md mx-auto">
      <div class="bg-white border border-gray-200 rounded p-8 animate-fade-in">
        <div
          class="text-8xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-4 animate-bounce-subtle"
        >
          404
        </div>
        <div class="text-6xl mb-6">👑</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist in the arena. Let's get you
          back to safety!
        </p>
        <button
          @click="$emit('goHome')"
          class="bg-blue-600 text-white rounded px-4 py-2 w-full hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  </div>
</template>
