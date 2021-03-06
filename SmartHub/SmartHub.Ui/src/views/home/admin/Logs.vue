<template>
  <div class="w-full">
    <h1 class="text-3xl text-gray-500 font-bold mb-6">Logs</h1>
    <div class="flex justify-between items-center mb-4">
      <Search :data="logsArray" :search-keys="searchKeys" @search-result="getSearchResult" @toggle-table="toggleTable" />
      <div class="w-1/3 flex justify-end">
        <span v-if="connectionEstablished" class="w-1/3 text-xs font-semibold inline-block py-2 px-2 uppercase rounded text-indigo-600 bg-indigo-200 uppercase ml-3">
          Connected
        </span>
        <span v-if="!connectionEstablished" class="w-1/3 text-xs font-semibold inline-block py-2 px-2 uppercase rounded text-red-600 bg-red-200 uppercase ml-3">
          Not connected
        </span>
      </div>
    </div>

    <template v-if="!showSearchTable">
      <Table :headers="headers">
        <tr v-for="log in logsArray" :key="log.id" class="hover:bg-indigo-200">
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.timestamp"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.level"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.message"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.exception"></span>
          </td>
        </tr>
      </Table>
    </template>
    <template v-else>
      <Table :headers="headers">
        <tr v-for="log in searchResultArray" :key="log.id" class="hover:bg-indigo-200">
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.item.timestamp"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.item.level"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.item.message"></span>
          </td>
          <td>
            <span class="text-gray-700 flex items-center" v-text="log.item.exception"></span>
          </td>
        </tr>
      </Table>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, reactive } from 'vue';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { ServerLog } from '@/types/types';
import Search from '@/components/widgets/Search.vue';
import Table from '@/components/widgets/Table.vue';

export default defineComponent({
  name: 'Logs',
  components: {
    Search,
    Table
  },
  setup() {
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl('/api/hub/logs')
      .configureLogging(LogLevel.Information)
      .build();
    const showSearchTable = ref(false);
    const logsArray = reactive<ServerLog[]>([]);
    const searchResultArray = ref<ServerLog[]>([]);
    const connectionEstablished = ref(false);
    const headers = [
      { text: 'Timestamp', value: 'timestamp' },
      { text: 'Level', value: 'level' },
      { text: 'Message', value: 'message' },
      { text: 'Exception', value: 'exception' }
    ];
    const searchKeys = ['timestamp', 'level', 'message', 'exception'];

    connection.onclose(() => {
      connectionEstablished.value = false;
    });

    connection
      .start()
      .then(() => {
        connectionEstablished.value = true;
        connection.on('SendLogAsObject', (data: ServerLog) => {
          logsArray.push(data);
        });
      })
      .catch((err) => console.error(err));

    onUnmounted(() => {
      connection.stop();
    });

    const getSearchResult = (result: ServerLog[]) => {
      searchResultArray.value = [];
      searchResultArray.value.push(...result);
    };

    const toggleTable = (value: boolean) => {
      showSearchTable.value = value;
      searchResultArray.value = [];
    };

    return {
      logsArray,
      connectionEstablished,
      headers,
      searchKeys,
      showSearchTable,
      searchResultArray,
      getSearchResult,
      toggleTable
    };
  }
});
</script>

<style scoped>
.tableContainer {
  height: 600px;
  @apply overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative;
}
</style>
