# Week 4 Answers

## 1. Array index as `:key`

If the key is the array index, the key belongs to a position in the list, not to an event. When the list is filtered, a different event moves into that position, so Vue reuses the existing card there and keeps its local state. An open details panel would then stay open on the wrong event. With `:key="e.id"`, each card keeps its own state because the key identifies the event.

## 2. `visible` as a computed, not a function in the template

A computed value is cached: it recalculates only when something it reads (`search`, `category`, `events`) changes. A function called from the template runs again on every re-render, even when the change has nothing to do with the filter, such as a booking changing the header. When you type in the search box, `search` changes and both would recompute, but the computed avoids all the other needless recalculations and also tracks its dependencies automatically.

## 3. Why `EventCard` emits `book` instead of changing `event.booked`

First, props are read-only and data flows one way, down. If the card changed `event.booked` itself, the data would be changed from a place that doesn't own it, and Vue warns about it. Second, the card stays reusable and simple: it only reports "the user wants to book event 7", and the parent decides what that means, such as checking seats, updating `myBookings` and saving to localStorage.

## 4. `const { booked } = reactive(event); booked++`

Destructuring copies the current value of `booked` into a plain number. That variable has no link to the reactive object, so `booked++` changes only the local copy. Vue never sees a change on the reactive object, so the page doesn't update. To keep the connection, write `event.booked++` directly or use `toRefs`.

## 5. Where `myBookings` lives

`myBookings` lives in `App.vue`, which owns the events and is the only component that changes data. Several things depend on it: the header count, `onBook`, and saving to localStorage. State should sit in the closest common parent of everything that uses it. `EventCard` and `EventList` only display and report events, so putting it in either would make the state hard to share and break the "props down, events up" pattern.
