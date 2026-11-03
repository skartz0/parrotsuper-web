<script setup lang="ts">
import { currentLanguage } from '../composables/useLanguage';
import { agencyContent } from '../data/content';
import InteractiveHeroGrid from './InteractiveHeroGrid.vue';

const content = agencyContent;
</script>

<template>
  <section class="relative isolate pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
    <!-- Interactive 40x40 3D Squares Background -->
    <InteractiveHeroGrid :cell-size="40" :influence-radius="120" :max-depth="14" />

    <!-- Atmospheric Background Glows -->
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
    <div class="absolute top-60 right-10 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-8">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          {{ content[currentLanguage].hero.badge }}
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            {{ content[currentLanguage].hero.titleHighlight }}
          </span>
          <br class="hidden sm:inline" />
          {{ content[currentLanguage].hero.titleTail }}
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg lg:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
          {{ content[currentLanguage].hero.subtitle }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-950 bg-white hover:bg-slate-100 shadow-xl shadow-white/10 transition transform active:scale-95"
          >
            {{ content[currentLanguage].hero.ctaPrimary }}
          </a>
          <a
            href="https://bots.parrotsuper.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-2 group"
          >
            <span>{{ content[currentLanguage].hero.ctaSecondary }}</span>
            <span class="text-emerald-400 group-hover:translate-x-0.5 transition">→</span>
          </a>
        </div>

        <!-- 3D Element Anchor Container (Ready for Spline, Three.js or GLTF model) -->
        <div id="hero-3d-scene" class="w-full max-w-2xl mx-auto empty:hidden my-6" aria-label="3D Hero Asset">
          <slot name="hero-3d" />
        </div>

        <!-- Metrics Row -->
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-800/80">
          <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div class="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {{ content[currentLanguage].hero.stat1 }}
            </div>
            <div class="text-xs text-slate-400 font-mono">
              {{ content[currentLanguage].hero.stat1Sub }}
            </div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
              {{ content[currentLanguage].hero.stat2 }}
            </div>
            <div class="text-xs text-slate-400 font-mono">
              {{ content[currentLanguage].hero.stat2Sub }}
            </div>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div class="text-2xl sm:text-3xl font-extrabold text-sky-400 mb-1">
              {{ content[currentLanguage].hero.stat3 }}
            </div>
            <div class="text-xs text-slate-400 font-mono">
              {{ content[currentLanguage].hero.stat3Sub }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
