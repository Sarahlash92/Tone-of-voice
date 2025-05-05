# Tone Of Voice

project for deriving a consistent tone of voice from existing corporate communications that serves as the "signature" of the brand

the approch of this project was to create a text analysis service, that takes from a provided doc, extracts company name, then injects the outcomes in the tone analysis to create a prompt for the tone signature, websearch is also used just to exand the knowledge of the code base

## TechStack & Libraries 

- nodeJs
- Typescript 
- OpenAI key 
- Langchain Library 
- Cheerio 
- axios 
    DuckDuckGo for searched

## Setup 

1. **Clone the repository**


2. **install dependencies and run project**:
    npm i 
    npm run start 

3.**env variables**: 
    OPENAI_API_KEY=xxx
    PORT = 3000 

4. **place your file inside the data dir**

5. GET request : 
    http://localhost:3000/analyze
