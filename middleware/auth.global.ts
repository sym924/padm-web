export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = userAuthStore();
    const token = useCookie('hz_token').value;
    const { user } = storeToRefs(authStore);

    if (!token && !authStore.isAuthenticated && to.path !== '/iam/login' && to.path !== '/iam/register') {
        return navigateTo('/iam/login');
    }
    // 如果token存在但状态未同步，同步用户状态
    if (token && !authStore.isAuthenticated) {
        await authStore.fetchUser();
    }
const isAssistantSetting =
  /^\/assistants\/[^/]+\/setting$/.test(to.path);

const isServiceSetting =
  /^\/services\/[^/]+\/setting$/.test(to.path);

if (isAssistantSetting && user.value?.scope === 'user') {
  return navigateTo('/assistants');
}

if (isServiceSetting && user.value?.scope === 'user') {
  return navigateTo('/services');
}
if(to.path.includes('/users') && user.value?.scope==='user'){
  return navigateTo('/setting');
}
if(to.path.includes('/monitor') && (user.value?.scope === 'user' || user.value?.scope === 'admin')){
  return navigateTo('/setting');
}
if(to.path.includes('/assistants') && user.value?.scope==='user'){
  return navigateTo('/services');
}
});

// if (token && ['/iam/login', '/iam/register'].includes(to.path)) {
//     return navigateTo('/');
// }
// if (!token && to.meta.requiresAuth) {
//     return navigateTo('/iam/login');
// }