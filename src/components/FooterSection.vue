<script setup lang="ts">
import ParrotsLogo from './ParrotsLogo.vue';
</script>

<template>
  <footer class="py-12 border-t border-slate-900 bg-slate-950 text-slate-400 text-xs font-mono">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <ParrotsLogo class="w-6 h-6" />
        <span class="text-slate-300 font-bold">Parrot Super</span>
        <span>— Web Development & AI Labs</span>
      </div>

      <div class="flex items-center gap-6">
        <a href="https://bots.parrotsuper.com" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition">
          bots.parrotsuper.com
        </a>
        <a href="mailto:contact@parrotsuper.com" class="hover:text-emerald-400 transition">
          contact@parrotsuper.com
        </a>
      </div>

      <div>
        © {{ new Date().getFullYear() }} Parrot Super. All rights reserved.
      </div>
    </div>
  </footer>
</template>
