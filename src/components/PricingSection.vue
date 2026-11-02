<script setup lang="ts">
import { currentLanguage } from '../composables/useLanguage';
import { agencyContent } from '../data/content';

const content = agencyContent;
</script>

<template>
  <section id="pricing" class="py-24 bg-slate-900/40 border-y border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-4">
          {{ content[currentLanguage].pricing.badge }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {{ content[currentLanguage].pricing.title }}
        </h2>
        <p class="text-slate-400 text-base sm:text-lg">
          {{ content[currentLanguage].pricing.subtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="(plan, idx) in content[currentLanguage].pricing.plans"
          :key="idx"
          class="flex flex-col justify-between p-8 rounded-2xl border transition relative"
          :class="[
            plan.popular
              ? 'bg-slate-900/90 border-emerald-500/60 shadow-2xl shadow-emerald-500/10'
              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
          ]"
        >
          <!-- Popular Ribbon -->
          <div
            v-if="plan.popular"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider font-mono shadow-md"
          >
            Recommended
          </div>

          <div>
            <h3 class="text-xl font-bold text-white mb-2">{{ plan.name }}</h3>
            <p class="text-slate-400 text-xs mb-6 min-h-[32px]">{{ plan.description }}</p>

            <div class="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-800">
              <span class="text-4xl font-extrabold text-white tracking-tight">{{ plan.price }}</span>
              <span class="text-xs text-slate-400 font-mono">/ {{ plan.period }}</span>
            </div>

            <ul class="space-y-3 mb-8 text-sm text-slate-300">
              <li v-for="(feature, fIdx) in plan.features" :key="fIdx" class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <a
            href="#contact"
            class="w-full py-3 px-4 rounded-xl font-semibold text-center text-sm transition transform active:scale-95"
            :class="[
              plan.popular
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
            ]"
          >
            Επιλογή Πακέτου
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
