# AI Assistant for Wee Saviya Agricultural App

🌾 **Custom AI assistant to help unknowledgeable users navigate and understand agricultural app features**

## 🏗️ **Architecture Overview**

This AI assistant system uses n8n workflows to process natural language queries and provide intelligent responses for the Wee Saviya agricultural mobile app.

```
Flutter Mobile App ↔ API Gateway ↔ n8n Workflows ↔ AI Models & Agricultural Data
```

## 📁 **Project Structure**

```
AI---Assistant/
├── n8n-workflows/          # n8n workflow definitions
├── api-server/             # Express.js API gateway
├── knowledge-base/         # Agricultural knowledge and data
├── docker/                 # Docker configuration
├── scripts/               # Setup and deployment scripts
└── docs/                  # Documentation
```

## 🚀 **Features**

- **Multilingual Support**: Sinhala, Tamil, English
- **Context-Aware Help**: Knows which app screen user is on
- **Voice Input/Output**: Speech-to-text and text-to-speech
- **Agricultural Intelligence**: Market prices, weather, cultivation tips
- **Smart Onboarding**: Guided tours for new users
- **Real-time Assistance**: Instant help with app navigation

## 🛠️ **Tech Stack**

- **n8n**: Workflow automation and AI orchestration
- **Node.js/Express**: API gateway and middleware
- **OpenAI/Gemini**: Language models for natural language processing
- **Docker**: Containerization for easy deployment
- **PostgreSQL**: Knowledge base and conversation storage
