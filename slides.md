---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: /imgs/banner.jpg
# some information about your slides (markdown enabled)
title: MCP AI世界的万能连接器

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

hideInToc: true
---

# MCP AI世界的万能连接器

演讲人：陈江

---
layout: cover
---

<Toc/>

---

# 聊天式AI


<ApiDemo apiName="OpenAI Chat API" :autoPlay="false" />

<div v-click  class="mt-4 font-size-[14px] color-gray-500">

  功能很单一，它只能处理训练数据中包含的信息，假如问它关于今天的天气、股票等实时信息，是无法办到的，为了能够实现这些功能，各大模型厂商引入了`Function Calling`，提供了对外的接口，因此开发人员可以接入新的功能。
</div>

---
transition: slide-up
---

# Function Calling(函数调用)

<div v-click>

大模型本身是无法和外部工具直接通信的，连查询天气都做不到。<code>Function Calling</code>是某些大模型专有能力，允许AI通过结构化请求调用外部数据（例如：查询天气、执行计算）。<b>其核心就是模型厂商内部的功能扩展接口，无统一标准，实现依赖特定的厂商。</b>

</div>

<div v-click >
  <h4 class="color-orange mb-2"> Function Calling 运行流程</h4>

  <img class="m-auto" src="/public/imgs/function-calling.png" width="80%"/>

  <div class="mt-8 font-size-[14px]">

  通过创建一个外部函数作为中介，一边传递大模型的请求，另外一边调用外部工具，从而使大模型间接处理外部信息，相当于大模型具备外部工具调用能力。
  
  </div>
</div>

--- 

# Function Calling 代码中描述

<div class="grid grid-cols-2 gap-5 h-[70%]">

  ```json {maxHeight:500}
  {
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

  ```js {maxHeight:500}
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
      } 
    } 
  }

  ```
</div>

<div v-click class="mt-4">
  <span style="font-size: 14px">

  每实现一个功能都要编写一个外部函数，另外为了让大模型认识这些函数，还需要额外的为每个外部函数`JSON Schema`格式说明，此外还需要为函数设计一个提示词`description`，才能提高`Function Calling`相应的准确率。

  </span>
</div>

---

# MCP的定义
<div v-click>
MCP（Model Context Protocol）2024年11月推出的<b>标准化协议</b>，它旨在标准化语言模型与外部数据源和工具之间的交互方式。简单来说，它就像AI世界的“USB-C”接口，提供了一个统一的连接的标准，让AI模型能够更轻松地访问实时数据、执行操作或与各种系统集成。
</div>


<div v-click class="mt-10 flex justify-center">
  <img src="/imgs/mcp.png" width="60%"/>
</div>


---

# MCP到底是什么

本质上，MCP解决了AI模型的一大痛点：**它们通常只知道训练时学到的东西，很难获取到实时信息或者执行实际操作。**

<div v-click class="font-size-[14px]">
假设你是老板，AI是你的新员工。这位员工刚刚毕业，经验不足，知识有限，你交代的任务，他可能缺乏完成任务所需的工具或者信息。这时，MCP就像是一个工具箱或者仓库。
<div v-click class="mt-2">
  <img class="m-auto" src="/public/imgs/ai-mcp.png" width='80%' />
</div>

</div>


<div class="grid grid-cols-2 gap-2" v-click>

<div class="font-size-[14px]">

  <span><b class="color-blue mb-2">举例：</b>假设你想让AI帮你管理github项目:</span>

  1. 你设置了一个MCP服务器，连接到`github API`
  2. 当你用MCP客户端等工具去访问“最近有哪些issue”
  3. MCP客户端通过`MCP Server`从`github`获取最新的数据
  4. 然后基于实时信息给你分析报告

</div>

<img src="/imgs/mcp-github.png" width="80%" class="mt-2"/>

</div>

---

# MCP代码中描述

<div class="grid grid-cols-1 h-[90%]"> 

```js {maxHeight:500}
 import {CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
 
     this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [{
         {
          name: 'Get_Weather_For_City',
          description: '获取指定城市的天气',
          inputSchema: {
            type: 'object',
            properties: {
              cityName: {
                type: 'string',
                description: '城市名称',
              },
            },
            required: ['cityName'],
          },
        },
      }]
     })


    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        // ...
        case 'Get_Weather_For_City':
          return await this.handleGetWeather(request.params.arguments);
      }
    });


   private async handleGetWeather(args: any) {
    if (!args.cityName) {
      throw new McpError(ErrorCode.InvalidParams, '城市名称不能为空');
    }
 
      const response = await fetch(url)
      const data = await response.json()

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
```

</div>

---

# MCP工作流程演示

<div class="flex justify-center">
  <MCPCallFlowExplainer />
</div>

---

# MCP总体架构

MCP统一采用分布式架构，分为客户端Client和服务端Server两部分，一个MCP host应用可以链接多个MCP Server。

<div class="grid grid-cols-2 gap-10">
  <img  v-click src="/imgs/mcp-theory.jpg"/>
  <img v-click src="/imgs/mcp-app.gif" width="80%"/>
</div>


---

# MCP核心优势

<div>

  MCP 的核心优势在于统一了各家大模型原本差异化的 `Function Calling` 标准，形成通用协议。能兼容市面上几乎所有主流大模型，堪称 AI 领域的“USB-C 接口”。
  <p v-mark="{ at: 1, color: 'red', type: 'underline' }">MCP 解决了模型与外部工具、数据源间的兼容性问题，开发者只需按协议开发一次接口，即可被多模型调用。</p>
  避免了开发者为不同的平台重复开发逻辑，避免重复造轮子。

</div>


<div v-click="2" class="font-size-[14px] mt-8">
  相关网址:

- [MCP Client (Cherry Studio)客户端](https://cherry-ai.com/)
- [Cursor](https://www.cursor.com/cn)
- [MCP Server](https://mcp.so/servers)
- [smithery](https://smithery.ai/)

</div> 

---
layout: cover
background: /imgs/banner.jpg
hideInToc: true
---

# 谢谢