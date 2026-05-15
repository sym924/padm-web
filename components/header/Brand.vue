<template>
    <div class="flex items-center gap-2">
        <Sheet>
            <SheetTrigger as-child>
                <Button variant="outline" size="icon" class="sm:hidden">
                    <Icon name="mdi:table-of-contents" class="w-7 h-7" />
                </Button>
            </SheetTrigger> 
            <SheetContent side="left" class="p-0 w-2/3 z-50 bg-background">
                <!-- <div>我被渲染了</div> -->
                <div class="pt-14 flex flex-col gap-y-2">
                    <div v-if="route.path.includes('/doc')" class="flex-1 overflow-hidden"> 
                        <SimpleMobileSidebar />
                    </div>
                    <div v-else v-for="item in menuLoading" :key="item.id">
                        <NuxtLink :to="item.path" class="contents">
                            <Button variant="ghost" class="text-lg w-full font-extrabold justify-start pl-12"
                                :class="{ 'bg-[#E6F1FB] hover:bg-[#E6F1FB] dark:bg-[#1A2530] dark:text-blue-600 dark:hover:bg-[#1A2530] dark:hover:text-blue-600': isActive(item.path) }">
                                <span v-if="item.icon" class="mr-2">{{ item.icon }}</span>
                                {{ item.name }}
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
        <NuxtLink class="text-nowrap" to="/">
            <h1 class="text-3xl font-extrabold flex gap-4 items-center">
                <Icon name="fluent-emoji-flat:infinity" class=" h-10 w-10"></Icon>
                <span class="hidden sm:block">农业 AI 服务</span>
            </h1>
        </NuxtLink>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { menus, manage } from '@/utils/menus'
//import { SheetContent } from '#build/components';
import { SheetContent } from '@/components/ui/sheet'

import { useRoute } from "vue-router";
const route = useRoute();
const authStore = userAuthStore();
const { user } = storeToRefs(authStore);
//console.log("scope:", user.value?.scope);
console.log('当前的path:',route.path);

// const menuLoading = computed(() => {
//     if(menus.some(obj => route.path.includes(obj.id))){
//         const items = [...menus];
//         if (user.value?.scope === 'admin') {
//             items.push(
//               {
//                 id: "assistants",
//                 name: "数字专家",
//                 icon: "🧑‍🔬",
//                 group: "console",
//                 roles: ["admin"],
//                 path: "/assistants",
//               });
//         }
//         return items;
//     }
//     else
//     {
//         return manage;
//     }
//     //return menus.some(obj => route.path.includes(obj.id)) ? menus : manage;
// });
const menuLoading = computed(() => {
    console.log("user:", user.value);
    console.log("scope:", user.value?.scope);
    let baseMenus = [...menus];
    let manageMenus = [...manage];
    if (user.value?.scope === 'admin' || user.value?.scope === 'superadmin') {
        const hasAssistants = baseMenus.some(m => m.id === 'assistants');

        if (!hasAssistants) {
            baseMenus.push({
                id: "assistants",
                name: "数字专家",
                icon: "🧑‍🔬",
                group: "console",
                roles: ["admin"],
                path: "/assistants",
            });
        }
        if (user.value?.scope === 'superadmin') {
            manageMenus.push(
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

    }
    const inMenu = baseMenus.some(obj => 
        route.path.startsWith(obj.path)
    );

    return inMenu ? baseMenus : manageMenus;
});
const isActive = (path) => route.path.startsWith(path);

</script>
