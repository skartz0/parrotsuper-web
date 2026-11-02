<script setup lang="ts">
import { currentLanguage } from '../composables/useLanguage';
import { agencyContent } from '../data/content';
import ParrotsLogo from './ParrotsLogo.vue';

const content = agencyContent;
</script>

<template>
  <section id="bots" class="py-20 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
        <!-- Glow Orbs -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div class="absolute -left-20 -top-20 w-80 h-80 bg-teal-500/20 blur-3xl rounded-full pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              {{ content[currentLanguage].botBridge.badge }}
            </div>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
              {{ content[currentLanguage].botBridge.title }}
            </h2>

            <p class="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed max-w-2xl">
              {{ content[currentLanguage].botBridge.description }}
            </p>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://bots.parrotsuper.com"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
              >
                <span>{{ content[currentLanguage].botBridge.cta }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <span class="text-xs text-slate-400 font-mono">
                {{ content[currentLanguage].botBridge.note }}
              </span>
            </div>
          </div>

          <div class="lg:col-span-4 flex justify-center">
            <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-slate-900/90 border border-emerald-500/30 p-6 flex items-center justify-center shadow-xl">
              <ParrotsLogo class="w-28 h-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
