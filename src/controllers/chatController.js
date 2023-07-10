import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

// import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// ffmpeg.setFfmpegPath(ffmpegPath);


// Transcribe audio
async function transcribeAudio(filename) {
    const transcript = await openai.createTranscription(
        fs.createReadStream(filename),
        "whisper-1"
    );
    return transcript.data.text;
    }

// Main function
// async function mainTemp(audioFile) {
//   const transcription = await transcribeAudio(audioFile);
//   console.log("Transcription:", transcription);
// }



async function chatResponse( req, res, next) {
    try {
        console.log('here')
        console.log(req.file)
        let audioTranscription = await transcribeAudio(req.file.path)

        res.send('ok')
    } catch (error) {
        console.log(error)
        res.status(500)
    }
 
}

export default {
    chatResponse
}; 
    