<template>
    <div class="flex-1">
        <!-- <NuxtLink to="/services">nihao</NuxtLink> -->
         <Header></Header>
            <section class="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f141a] to-black flex items-center">
                <div class="max-w-6xl mx-auto px-8">
                            <h1 class="text-white text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                                            精准农业数字模型 AI 服务平台
                            </h1>
                            <ul class="mt-10 space-y-4 text-lg text-gray-300">
                                <li class="flex items-center">
                                <span class="mr-3 text-white">•</span>
                                           分布式模型服务注册中心
                                </li>
                                <li class="flex items-center">
                                <span class="mr-3 text-white">•</span>
                                        精准农业数字模型
                                </li>
                                <li class="flex items-center">
                                <span class="mr-3 text-white">•</span>
                                         专业农艺知识图谱
                                </li>
                                <li class="flex items-center">
                                <span class="mr-3 text-white">•</span>
                                      AI 数字农艺专家
                                </li>
                                </ul>
                            <div class="mt-12 flex items-center gap-4">
                                <NuxtLink
                                   to="/iam/login"
                                   class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-500 transition"
                                >
                                🫐
                                开始体验
                                </NuxtLink>
                                <NuxtLink
                                 to="/doc"
                                 class="rounded-lg border border-gray-600 px-6 py-3 text-gray-200 hover:bg-white/5 transition"
                                >
                                API 文档 →
                                </NuxtLink>
                          </div>
            </div>
        </section>

    </div>
</template>
<script setup lang="ts"></script>
  