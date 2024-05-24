<script setup>
import { ref } from "vue";

const query = ref("");
const loading = ref(false);
const error = ref("");
const results = ref([]);

const search = async () => {
  if (query.value.trim() === "") {
    return;
  }

  loading.value = true;
  error.value = "";
  results.value = [];

  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query.value)}`,
    );
    const data = await response.json();
    results.value = data.web.results;
  } catch (e) {
    console.error("There was a problem with your request:", e);
    error.value = "Internal server error";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-4">Brave Search</h1>
    <div class="flex items-center mb-4">
      <input
        type="text"
        class="input input-bordered w-full max-w-lg"
        v-model="query"
        placeholder="Enter your search query"
      >
      <button
        class="btn btn-primary ml-2"
        @click="search"
      >
        Search
      </button>
    </div>
    <div v-if="loading" class="mb-4">
      Loading...
    </div>
    <div v-if="error" class="mb-4">
      {{ error }}
    </div>
    <div v-if="results.length > 0">
      <h2 class="text-2xl font-bold mb-4">Search Results</h2>
      <ul class="list-none">
        <li v-for="(result, index) in results" :key="index" class="mb-4">
          <h3 class="text-lg font-bold">{{ result.title }}</h3>
          <p><a :href="result.url" target="_blank">{{ result.url }}</a></p>
        </li>
      </ul>
    </div>
  </div>
</template>
