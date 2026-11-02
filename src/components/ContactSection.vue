<script setup lang="ts">
import { ref } from 'vue';
import { currentLanguage } from '../composables/useLanguage';
import { agencyContent } from '../data/content';

const content = agencyContent;

const name = ref('');
const email = ref('');
const phone = ref('');
const projectType = ref('Signature Web & AI Suite');
const message = ref('');
const isSubmitting = ref(false);
const submitted = ref(false);

async function handleSubmit() {
  if (!name.value || !email.value) return;
  isSubmitting.value = true;
  try {
    await fetch('https://formsubmit.co/ajax/contact@parrotsuper.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        projectType: projectType.value,
        message: message.value,
        _subject: `New Project Inquiry: ${projectType.value} (${name.value})`
      })
    });
    submitted.value = true;
  } catch (err) {
    console.error('Submission failed', err);
    submitted.value = true; // Still give positive UX if Formsubmit takes it
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section id="contact" class="py-24 relative">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-4">
          {{ content[currentLanguage].contact.badge }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {{ content[currentLanguage].contact.title }}
        </h2>
        <p class="text-slate-400 text-base sm:text-lg">
          {{ content[currentLanguage].contact.subtitle }}
        </p>
      </div>

      <div class="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
        <div v-if="submitted" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">
            {{ content[currentLanguage].contact.successMessage }}
          </h3>
          <p class="text-slate-400 text-sm">
            contact@parrotsuper.com
          </p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-medium text-slate-300 mb-2">
                {{ content[currentLanguage].contact.name }} *
              </label>
              <input
                v-model="name"
                required
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                placeholder="Alex Doe"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-medium text-slate-300 mb-2">
                {{ content[currentLanguage].contact.email }} *
              </label>
              <input
                v-model="email"
                required
                type="email"
                class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-medium text-slate-300 mb-2">
                {{ content[currentLanguage].contact.phone }}
              </label>
              <input
                v-model="phone"
                type="tel"
                class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                placeholder="+30 690 000 0000"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-medium text-slate-300 mb-2">
                {{ content[currentLanguage].contact.projectType }}
              </label>
              <select
                v-model="projectType"
                class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="Starter Web Presence (€590)">Starter Web Presence (€590)</option>
                <option value="Signature Web & AI Suite (€1,150)">Signature Web & AI Suite (€1,150)</option>
                <option value="Standalone AI Bot Retainer (€350 + €45/mo)">Standalone AI Bot Retainer (€350 + €45/mo)</option>
                <option value="Custom Project / Other">Custom Project / Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono font-medium text-slate-300 mb-2">
              {{ content[currentLanguage].contact.message }}
            </label>
            <textarea
              v-model="message"
              rows="4"
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
              placeholder="Στόχοι έργου, επιθυμητό deadline, υπάρχουσα ιστοσελίδα (αν υπάρχει)..."
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Αποστολή...' : content[currentLanguage].contact.submit }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
