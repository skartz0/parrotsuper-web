<script setup lang="ts">
import StudioNavbar from './components/StudioNavbar.vue';
import HeroSection from './components/HeroSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import BotBridgeSection from './components/BotBridgeSection.vue';
import PricingSection from './components/PricingSection.vue';
import ContactSection from './components/ContactSection.vue';
import FooterSection from './components/FooterSection.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
    <StudioNavbar />
    <main class="flex-1">
      <HeroSection />
      <ServicesSection />
      <BotBridgeSection />
      <PricingSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>
