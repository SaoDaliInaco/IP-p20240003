<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { validateBooking } from "../validation";

const props = withDefaults(
  defineProps<{
    seatsLeft: number;
    pending?: boolean;
  }>(),
  {
    pending: false,
  }
);

const emit = defineEmits<{
  (e: "submit", payload: { name: string; email: string; seats: number }): void;
}>();

const form = reactive({
  name: "",
  email: "",
  seats: 1,
});

const submitted = ref(false);

const errors = computed(() => validateBooking(form, props.seatsLeft));

function onSubmit() {
  submitted.value = true;
  if (Object.keys(errors.value).length > 0) return;

  emit("submit", {
    name: form.name.trim(),
    email: form.email.trim(),
    seats: form.seats,
  });
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="name">Name</label>
      <input id="name" name="name" v-model="form.name" type="text" />
      <p v-if="submitted && errors.name" class="error">{{ errors.name }}</p>
    </div>

    <div>
      <label for="email">Email</label>
      <input id="email" name="email" v-model="form.email" type="email" />
      <p v-if="submitted && errors.email" class="error">{{ errors.email }}</p>
    </div>

    <div>
      <label for="seats">Seats</label>
      <input id="seats" name="seats" v-model.number="form.seats" type="number" />
      <p v-if="submitted && errors.seats" class="error">{{ errors.seats }}</p>
    </div>

    <button type="submit" :disabled="pending">
      {{ pending ? "Booking..." : "Book" }}
    </button>
  </form>
</template> 

<style scoped>
form { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
.error { color: #d73a49; margin: 0; font-size: 0.9rem; }
button { align-self: flex-start; margin-top: 8px; }
</style>
