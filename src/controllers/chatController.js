import fs from 'fs'
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import { unlink } from "fs/promises";



console.log('--------------',  process.env.SECRET)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

const ROLES  = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user',
}


let chatHistory = [
        {
            "role": ROLES.SYSTEM, 
            "content": "Can you act as a rubber duck debugging or as a friend that helps you understand the problem This character has a few main things:1. Don't give the solution. 2. Only ask one question at a time and don't tell me where to look 3. ask the right question that eventually will help me understand where is the problem by telling you step by step what I changed4. Don't thank me and act like this is a regular conversation between two programmers. Thanks!"
        },
    ];

async function transcribeAudio(filename) {
    const transcript = await openai.createTranscription(
        fs.createReadStream(filename),
        "whisper-1"
    );
    return transcript.data.text;
    }

async function handleVoiceInput( req, res, next) {
    try {
        let audioTranscription = await transcribeAudio(req.file.path);
        await unlink(req.file.path)
       await chatGptMsg(audioTranscription)
        res.send(chatHistory).status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

async function handleTextInput(req, res, next){
    try {
        await chatGptMsg(req.body.text)
        res.send(chatHistory).status(200);

    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

async function chatGptMsg (userPrompt){
    chatHistory.push({
        "role": ROLES.USER,
        "content": userPrompt
    })
    let response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory
    })
    chatHistory.push(response.data.choices[0].message);
}

async function handleClearChat(req, res, next){
    try {
        chatHistory = [
            {
                "role": ROLES.SYSTEM, 
                "content": "Can you act as a rubber duck debugging or as a friend that helps you understand the problem This character has a few main things:1. Don't give the solution. 2. Only ask one question at a time and don't tell me where to look 3. ask the right question that eventually will help me understand where is the problem by telling you step by step what I changed4. Don't thank me and act like this is a regular conversation between two programmers. Thanks!"
            },
        ];
        res.send(chatHistory).status(200);

    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

export default {
    handleVoiceInput,
    handleTextInput,
    handleClearChat
}; 
    