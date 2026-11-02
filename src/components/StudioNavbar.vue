<script setup lang="ts">
import { currentLanguage, toggleLanguage } from '../composables/useLanguage';
import { agencyContent } from '../data/content';
import ParrotsLogo from './ParrotsLogo.vue';

const content = agencyContent;
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <!-- Logo + Brand -->
      <a href="#" class="flex items-center gap-3.5 group">
        <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner group-hover:border-slate-700 transition">
          <ParrotsLogo class="w-8 h-8" />
        </div>
        <div>
          <span class="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition">
            Parrot Super
          </span>
          <span class="block text-[11px] font-mono tracking-wider uppercase text-emerald-400/90 font-medium">
            Studio & AI Labs
          </span>
        </div>
      </a>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#services" class="hover:text-white transition">{{ content[currentLanguage].nav.services }}</a>
        <a href="#bots" class="hover:text-white transition flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {{ content[currentLanguage].nav.aiBots }}
        </a>
        <a href="#pricing" class="hover:text-white transition">{{ content[currentLanguage].nav.pricing }}</a>
        <a href="#contact" class="hover:text-white transition">{{ content[currentLanguage].nav.contact }}</a>
      </nav>

      <!-- Right Actions: Language Switcher + Bot Studio CTA -->
      <div class="flex items-center gap-3 sm:gap-4">
        <button
          @click="toggleLanguage"
          class="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          {{ currentLanguage.toUpperCase() }}
        </button>

        <a
          href="https://bots.parrotsuper.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform active:scale-95"
        >
          <span>{{ content[currentLanguage].nav.launchBotStudio }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>
