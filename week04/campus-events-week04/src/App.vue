<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EventList from "./components/EventList.vue";
import { initialEvents } from "./data/events";
import { seatsLeft } from "./format";
import type { CampusEvent } from "./types";

const events = ref<CampusEvent[]>(initialEvents.map(e => ({ ...e })));

const STORAGE_KEY = "myBookings";
const myBookings = ref<number[]>([]);
const bookingCount = computed(() => myBookings.value.length);

function onBook(id: number) {
  const ev = events.value.find(e => e.id === id);
  if (ev && seatsLeft(ev) > 0) {
    ev.booked++;
    myBookings.value.push(id);
  }
}

// Bonus: read saved bookings back at startup (text may not be valid JSON)
try {
  const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  if (Array.isArray(saved)) {
    for (const id of saved) {
      const ev = events.value.find(e => e.id === id);
      if (ev && seatsLeft(ev) > 0) {
        ev.booked++;
        myBookings.value.push(id);
      }
    }
  }
} catch {
  // ignore invalid stored data
}

watch(myBookings, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true });
</script>

<template>
  <main>
    <header>
      <h1>Campus Events</h1>
      <p class="mine">You have booked {{ bookingCount === 1 ? "1 seat" : `${bookingCount} seats` }}.</p>
    </header>
    <EventList :events="events" @book="onBook" />
  </main>
</template>

<style scoped>
header { margin-bottom: 16px; }
.mine { color: #6b7280; margin: 0; }
</style>