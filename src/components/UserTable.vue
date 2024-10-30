<template>
  <div class="table-container">
    <div class="table">
      <div class="filter-section">
        <input v-model="filters.name" placeholder="Filter by Name" />
        <input v-model="filters.phone" placeholder="Filter by Phone" />
        <input v-model="filters.address" placeholder="Filter by Address" />
      </div>
      <table>
        <thead>
          <tr>
            <th @click="sort('id')">User ID</th>
            <th @click="sort('name')">Name</th>
            <th @click="sort('date')">Date of Registration</th>
            <th @click="sort('address')">Address</th>
            <th @click="sort('phone')">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.date }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-controls">
      <button class="btn-primary" @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button class="btn-primary" @click="nextPage" :disabled="currentPage === maxPage">
        Next
      </button>
      <span>Page {{ currentPage }} of {{ maxPage }}</span>
      <label>
        Items per page:
        <select v-model="itemsPerPage">
          <option v-for="option in [5, 10, 20]" :value="option">{{ option }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const users = ref([]);
const route = useRoute();
const router = useRouter();

const filters = ref({ name: '', phone: '', address: '' });
const currentPage = ref(Number(route.query.page) || 1);
const itemsPerPage = ref(Number(route.query.itemsPerPage) || 10);
const sortKey = ref(route.query.sortKey || '');
const sortOrder = ref(route.query.sortOrder ? Number(route.query.sortOrder) : 1);

onMounted(async () => {
  try {
    const response = await fetch('/assets/data/records.json');
    users.value = await response.json();
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
});

const filteredUsers = computed(() => {
  currentPage.value = 1;

  return users.value.filter((user) => {
    return (
      (!filters.value.name || user.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.phone || user.phone.includes(filters.value.phone)) &&
      (!filters.value.address ||
        user.address.toLowerCase().includes(filters.value.address.toLowerCase()))
    );
  });
});

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    if (!sortKey.value) return 0;
    if (a[sortKey.value] > b[sortKey.value]) return sortOrder.value;
    if (a[sortKey.value] < b[sortKey.value]) return -sortOrder.value;
    return 0;
  });
});

const maxPage = computed(() => Math.ceil(sortedUsers.value.length / itemsPerPage.value));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedUsers.value.slice(start, start + itemsPerPage.value);
});

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
  updateURL();
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
  updateURL();
};

const nextPage = () => {
  if (currentPage.value < maxPage.value) currentPage.value++;
  updateURL();
};

const updateURL = () => {
  router.replace({
    query: {
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
      ...filters.value,
    },
  });
};

watch([filters, itemsPerPage], updateURL, { deep: true });
</script>

<style lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  & > .table {
    height: 100%;
    overflow: auto;
    padding-inline: param(space-2);
  }
}

thead {
  position: sticky;
  top: 55px;
  border-bottom: 2px solid get-color(primary);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: param(space-5);
}
th {
  text-align: center;
  cursor: pointer;
  padding: param(space-2);
  background-color: get-color(secondary);
}
td {
  text-align: center;
  padding: param(space-4);
  border: 1px solid get-color(secondary);
}
.filter-section {
  display: flex;
  gap: param(space-4);
  margin-bottom: param(space-4);
  position: sticky;
  top: 0;
  background-color: get-color(secondary);
  height: 55px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: param(space-4);
  border-top: 2px solid get-color(primary);
}
</style>
