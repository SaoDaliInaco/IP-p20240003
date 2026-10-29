import { ref, computed, type Ref } from "vue";
import type { CampusEvent } from "../types";

export function useEventFilters(events: Ref<CampusEvent[]>) {
  const search = ref("");
  const category = ref("");

  const visible = computed(() => {
    const query = search.value.toLowerCase().trim();

    return events.value.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      const matchesCategory = category.value
        ? event.category === category.value
        : true;

      return matchesSearch && matchesCategory;
    });
  });

  return {
    search,
    category,
    visible,
  };
}