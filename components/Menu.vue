<template>
    <nav class="hidden border-r  border-opacity-15 sm:flex sm:flex-col md:w-64">
        <ul class="space-y-2 py-8 ">
            <li v-for="item in computedMenuItems" :key="item.path" class="px-4 ">
                <NuxtLink :to="item.path" class="contents">
                    <Button variant="ghost" class="text-lg w-full font-extrabold justify-start pl-12"
                        :class="{ 'bg-[#E6F1FB] hover:bg-[#E6F1FB] dark:bg-[#1A2530] dark:text-blue-600 dark:hover:bg-[#1A2530] dark:hover:text-blue-600': isActive(item.path) }">
                        <span v-if="item.icon" class="mr-2">{{ item.icon }}</span>
                        {{ item.name }}
                    </Button>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>
<script setup>
import { useRoute } from "vue-router";
const authStore = userAuthStore();
const { user } = storeToRefs(authStore);

const props = defineProps({
    //menuItems: Array,
    menuItems: {
    type: Array,
    required: true
  }
});
const computedMenuItems = computed(() => {
  const items = [...props.menuItems];

  if (user.value?.scope === 'superadmin' && items[0].id==='setting') {
    items.push(
      {
        id: "users",
        name: "用户管理",
        icon: "🙂",
        path: "/users",
      },
      {
        id: "monitor",
        name: "控制中心",
        icon: "🕵️",
        path: "/monitor",
      }
    );
  }
  if ((user.value?.scope === 'admin' || user.value?.scope === 'superadmin') && items[0].id==='services') {
    items.push(
        {
        id: "assistants",
        name: "数字专家",
        icon: "🧑‍🔬",
        group: "console",
        roles: ["admin"],
        path: "/assistants",
      }
    );
  }
  return items;

});
const route = useRoute();

const isActive = (path) => route.path.startsWith(path);

</script>