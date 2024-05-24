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
      `http://localhost:3000/api/search?q=${encodeURIComponent(query.value)}`,
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

  <h1>Brave Search</h1>
  <div>
    <input type="text" v-model="query" placeholder="Enter your search query">
    <button @click="search">Search</button>
  </div>
  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>
  <div v-if="results.length > 0">
    <h2>Search Results</h2>
    <div v-for="(result, index) in results" :key="index">
      <p>{{ result.title }}</p>
      <p>{{ result.url }}</p>
    </div>
  </div>
</template>
