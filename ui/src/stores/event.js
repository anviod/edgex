import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const filter = ref('all')

  function addEvent(event) {
    const newEvent = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...event
    }
    events.value.unshift(newEvent)
    if (events.value.length > 1000) {
      events.value = events.value.slice(0, 1000)
    }
  }

  function setFilter(filterType) {
    filter.value = filterType
  }

  function filteredEvents() {
    if (filter.value === 'all') {
      return events.value
    }
    return events.value.filter(e => e.type === filter.value)
  }

  function clearEvents() {
    events.value = []
  }

  return {
    events,
    filter,
    addEvent,
    setFilter,
    filteredEvents,
    clearEvents
  }
})