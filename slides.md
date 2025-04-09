---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: MCP 智能体之间的万能接口

# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true

layout: cover
---

# MCP 大模型的万能接口

演讲人：陈江

---

# MCP 定义

<div v-click>
MCP（Model Context Protocol）2024年11月推出的<span v-mark.red="2">标准化协议</span>，它标准化了应用程序如何向大模型提供连接的方式。我们可以将MCP理解为AI应用的"USB-C"接口，USB-C为各种设备提供了标准化的连接方式，MCP为AI模型提供了与不同数据源和工具连接的标准方式，是一个<span v-mark.circle.orange="3">AI能力扩展协议</span>，正是因为有了MCP，大模型才能连接万物。
</div>

<div v-click="4" class="flex justify-center">
  <img src="/imgs/mcp.png" width="60%"/>
</div>

---

# MCP诞生的背景

<div v-click>

大模型本身是无法和外部工具直接通信的，连查询天气都做不到。于是OpenAI推出<code>Function Calling</code>的思路；通过创建一个外部函数作为中介，一边传递大模型的请求，另外一边调用外部工具，从而使大模型间接处理外部信息，相当于大模型具备外部工具调用能力。

</div>
