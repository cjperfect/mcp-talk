---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: /imgs/banner.jpg
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
MCP（Model Context Protocol）2024年11月推出的<b>标准化协议</b>，它标准化了应用程序如何向大模型提供连接的方式。我们可以将MCP理解为AI应用的"USB-C"接口，USB-C为各种设备提供了标准化的连接方式，MCP为AI模型提供了与不同数据源和工具连接的标准方式，是一个<b>AI能力扩展协议</b>，正是因为有了MCP，大模型才能连接万物。
</div>

<div v-click class="flex justify-center">
  <img src="/imgs/mcp.png" width="60%"/>
</div>

---

# MCP诞生的背景

<div v-click>

大模型本身是无法和外部工具直接通信的，连查询天气都做不到。于是OpenAI推出<code>Function Calling</code>的思路；通过创建一个外部函数作为中介，一边传递大模型的请求，另外一边调用外部工具，从而使大模型间接处理外部信息，相当于大模型具备外部工具调用能力。

</div>

<div v-click >
  <h4 class="color-orange mb-2"> Function Calling 运行流程</h4>

  <img class="m-auto" src="/public/imgs/function-calling.png" width="80%"/>

  <div style="font-size: 14px">
  
    1. 用户输入
    2. 大模型分析用户请求，并发送给指定外部函数
    3. 调用外部函数，请求对应的外部工具
    4. 响应数据给大模型，整理后发送给用户
  
  </div>

</div>



--- 

# 机器中的描述

<div class="flex flex-between gap-5 h-[65%]">
  <div  class="flex-1 h-[100%] overflow-y-auto">

  ```json
  {
    "tool_choice": "auto",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "我想知道现在北京的天气状况"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "Get_Weather_For_City",
          "description": "获取指定城市的天气",
          "parameters": {
            "type": "object",
            "properties": {
              "cityName": {
                "type": "string",
                "description": "城市名"
              }
            }
          }
        }
      }
    ]
  }

  ```

  </div>

<div class="flex-1 h-[100%] overflow-y-auto">

  ```js
  async function Get_Weather_For_City({ city }) {
    const apiKey = 'YOUR_API_KEY' // 从 OpenWeatherMap 或其他天气服务申请
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        return {
          city: data.name,
          temperature: data.main.temp,
          weather: data.weather[0].description,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed
        }
      } else {
        return {
          error: data.message || "Failed to fetch weather data."
        }
      }
    } catch (err) {
      return {
        error: err.message
      }
    }
  }

  ```

  </div>
</div>

<div v-click class="mt-4">
  <h4 style="color: red">缺陷</h4>
  <span style="font-size: 14px">

  每实现一个功能都要编写一个外部函数，另外为了让大模型认识这些函数，还需要额外的为每个外部函数`JSON Schema`格式说明，此外还需要为函数设计一个提示词`description`，才能提高`Function Calling`相应的准确率。

  </span>
</div>

---

# MCP的诞生

它不是一种特定的技术，而是一种约定好的协议，一种规范。

> MCP统一采用分布式架构，分为客户端Client和服务端Server两部分。
> - 客户端：用于基于大模型编写
> - 服务端：暴露扩展大模型功能的相关函数。
>
> 通常来说用户只需要编写一套客户端的代码，就可以接入符合MCP开发规范的所有服务端（不管是自己编写的 ，还是别人编写的）。


<div v-click class="mt-10">
  <h4 class="mb-2 color-orange">MCP 运行流程</h4>
  <img src="/public/imgs/mcp-theory.png" />
</div>

--- 

# MCP 对比于 Function Calling 

