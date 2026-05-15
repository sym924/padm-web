<template>
    <div class="grid gap-4">
        <div class="w-full overflow-x-auto">
            <header
                class="flex justify-between items-center rounded-t-lg border p-1.5 pl-2 bg-alpha-500 bg-opacity-10 bg-[#0d80f2]">
                <div class="text-sm font-semibold">代码示例</div>
                <div class="gap-2 flex">
                    <Select v-model="selectedLanguage">
                        <SelectTrigger class="max-w-40 h-8 text-center">
                            <SelectValue placeholder="application/json" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="curl" class="!h-6">
                                    Shell / cURL
                                </SelectItem>
                                <SelectItem value="javascript" class="!h-6">
                                    JavaScript / Fetch
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost">
                        <Icon name="solar:copy-line-duotone"
                            class="cursor-pointer w-5 h-5 transition-colors bg-green-600 ">
                        </Icon>
                    </Button>
                </div>
            </header>
            <div class="p-2 text-[13px] font-[18px] overflow-x-auto sb-none rounded-b-md border">
                <!-- <ContainerMarkdown
                    :content="formattedCode">
                </ContainerMarkdown> -->
                 <pre><code class="language-javascript" v-html="highlightedCode"></code></pre>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '@/stores/sidebardoc'

// Using ES6 import syntax
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
const props = defineProps<{
  serviceId: string
}>()
hljs.registerLanguage('bash', bash)
const apiStore = useApiStore()
const selectedLanguage = ref('javascript') 
const formattedCode = computed(() => {
  const currentApi = apiStore.currentApi
  
  if (!currentApi?.path) {
    return '# 请选择 API 接口查看代码示例'
  }
  
  const method = currentApi.method || 'GET'
  const serviceid = props.serviceId
  const path=currentApi.path
  const baseUrl = 'https://api.newpadm.archivemodel.cn/services/'

  //if(method=='POST'||'PUT'){
          const bodyInline =  parseRequestBodyInlineObject(currentApi?.requestBody);
          console.log(bodyInline);
  //}

   function parseRequestBodyInlineObject(requestBody: any): string {
  if (!requestBody?.content?.length) return '{}'

  const schema = requestBody.content[0]?.schema
  if (!schema?.properties) return '{}'

  const parts: string[] = []

  Object.entries(schema.properties).forEach(([key, prop]: any) => {
    let value = 'null'
    switch (prop.type) {
      case 'string':
        value = '""'
        break
      case 'array':
        value = '[]'
        break
      case 'number':
      case 'integer':
        value = '0'
        break
      case 'boolean':
        value = 'false'
        break
      case 'object':
        value = '{}'
        break
    }
    parts.push(`"${key}":${value}`)
  })

  // ⚠️ 一行返回
  return `{${parts.join(',')}}`
}
  
  if (selectedLanguage.value === 'curl'){
    const rawCode = `curl --request ${method} --url ${baseUrl}${serviceid}/fetch${path} --header 'X-API-Key: Your API Key' --data '${bodyInline}'`
    return formatCurlCommand(rawCode)
  }else{
     const rawCode=`const options = {
   method: "${method}",
   headers: {
     "X-API-Key": "Your API Key",
     "Content-Type": "application/json"
   },
   body: ${bodyInline}
 };
 fetch("${baseUrl}${serviceid}/fetch${path}", options);`
 return formatCode(rawCode)
  } 
function formatCode(code) {
   if (!code) return '' 
  const bodyRegex = /body\s*:\s*(JSON\.stringify\([\s\S]*?\)|\{[\s\S]*?\})/
  const bodyMatch = code.match(bodyRegex)

  let bodyPlaceholder = ''
  let safeCode = code

  if (bodyMatch) {
    bodyPlaceholder = '__BODY__PLACEHOLDER__'
    safeCode = code.replace(bodyMatch[1], bodyPlaceholder)
  }
  // 分离 fetch 语句和其他代码
  const fetchMatch = safeCode.match(/(fetch\([^)]+\);?)/)
  const otherCode = safeCode.replace(/(fetch\([^)]+\);?)/, '')
  if (!fetchMatch) return safeCode
  // 格式化其他代码
  let formatted = otherCode
    .replace(/{/g, '{\n  ')
    .replace(/}/g, '\n}')
    .replace(/,/g, ',\n  ')
    .replace(/;\s*/g, ';\n')
    .replace(/\n\s*\n/g, '\n')
  // 添加 fetch 语句（保持在一行）
  const fetchStatement = fetchMatch[0].replace(/\s+/g, ' ').trim()
  formatted += '\n' + fetchStatement 
  if (bodyMatch) {
    formatted = formatted.replace(bodyPlaceholder, bodyMatch[1])
  }
  return formatted
}
// function formatCurlCommand(command) {
//   if (!command) return ''
//   return command
//     .replace(/--request\s+(\w+)/, '--request $1 \\\n  ')
//     .replace(/--url\s+([^\s]+)/, '--url $1 \\\n  ')
//     .replace(/--header\s+'([^']+)'/, "--header '$1'")
//     .trim()
// }
function formatCurlCommand(command) {
  if (!command) return ''

  const indent = ' '.repeat(5) // 对齐到 curl 后

  let formatted = command
    .replace(/--request\s+(\w+)/, `--request $1 \\\n${indent}`)
    .replace(/--url\s+([^\s]+)/, `--url $1 \\\n${indent}`)
    // header 后面是否加 \，取决于后面是不是还有 --data
    .replace(/--header\s+'([^']+)'(?=\s+--data)/g, `--header '$1' \\\n${indent}`)
    .replace(/--header\s+'([^']+)'/g, `--header '$1'`)
    // data 永远是最后一行
    .replace(/--data\s+(.+)$/, `--data $1`)
    .trim()

  return formatted
}
})
const highlightedCode = computed(() => {
  hljs.registerLanguage('javascript', javascript)
  const result = hljs.highlight(formattedCode.value, { language: 'javascript' })
  return result.value
})
</script>