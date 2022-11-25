<script setup >
// import pinia store and instantiate
import { useDataStore } from '../stores/data'
const storeData = useDataStore()
</script>

<template>

<!-- Default switch -->
<div class="d-flex flex-row bd-highlight mb-3">
<div class="form-check form-switch ">
   <label class="form-check-label" for="flexSwitchCheckDefault">Log scale</label>
   <input v-model="storeData.logscale" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
</div>
</div>
</template>

<style scoped>
.form-check-input:checked {
    background-color: red;
    border-color: pink;
}

.form-switch .form-check-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='red'/%3e%3c/svg%3e");
}
.form-switch .form-check-input:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='pink'/%3e%3c/svg%3e");
}
</style>