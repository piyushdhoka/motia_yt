import {EventConfig} from "motia";
import { z } from 'zod';

//uses openai to generate video titles based on video metadata

export const config: EventConfig = {
    name : "generateTitles",
    type : "event",
    subscribes: ["yt.videos.fetched"],
    emits : ["yt.titles.ready", "yt.titles.error"],

    input: z.object({
        jobId: z.string().optional(),
        email: z.string().optional(),
        channelId: z.string().optional(),
        channelName: z.string().optional(),
    })
};

interface Video {
    videoId: string;
    title: string;
    url: string;
    publishedAt: string;
    thumbnail: string;
}
interface ImprovedTitle {
    original: string;
    improved: string;
    rationale: string;
    url: string;  
}


export const handler = async (eventData: any, {emit , logger, state}: any) => {

    let jobId: string | undefined; 
    let email: string | undefined;

    try {
        const data = eventData || {}
        jobId = data.jobId;
        email = data.email;
        const videos = Array.isArray(data.videos) ? data.videos : Object.values(data.videos || {});
        const channelName = data.channelName;

        logger.info('generating titles', {jobId, videoCount: videos.length});

        if (!Array.isArray(videos) || videos.length === 0) {
            logger.warn('No videos found in event data, nothing to generate', { jobId });
            // update job to failed and emit error so callers know
            const jobData = await state.get('job', jobId)
            await state.set('job', jobId, {
                ...jobData,
                status: 'failed',
                error: 'no videos provided to generate titles'
            })
            await emit({
                topic: "yt.titles.error",
                data: {
                    jobId,
                    email,
                    error: 'no videos provided to generate titles'
                }
            })
            return;
        }
        
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if(!GEMINI_API_KEY) {
            throw new Error("Missing gemini api key  in environment variables");
        }
        const jobData = await state.get('job', jobId)
        await state.set('job', jobId, {
            ...jobData,
            status : 'generating titles',
            videos
        })
        const videoTitles = videos.map((v: Video, idx: number) => `Video ${idx + 1}: ${v.title}`).join('\n');
        const prompt = `You are a YouTube title optimization expert. 
Below are ${videos.length} video titles from the channel "${channelName}".

For each title, provide:
1. An improved version that is more engaging, SEO-friendly, and likely to get more clicks.
2. A brief rationale (1 - 2 sentences) explaining why the improved title is better.

Guidelines:
Keep the core topic and authenticity.
Use action verbs, numbers, and specific value propositions.
Make it curiosity-inducing without being clickbait.
Optimize for searchability and clarity.

Video Titles:
${videoTitles}

Respond in JSON format:
{
  "titles": [
    {
      "original": "...",
      "improved": "...",
      "rationale": "..."
    }
  ]
}`;

        const requestPayload = {
            systemInstruction: {
                role: "system",
                parts: [{
                    text: "You are a youtube SEO and engagemenr expert who helps creators write better titles for their videos to increase click through rates and views. You understand the importance of using keywords, emotional triggers, and curiosity to craft compelling titles that attract viewers."
                }]
            },
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
            }
        };

        // do the request
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        // helpful debug logging when things go wrong
        if(!response.ok) {
            const text = await response.text();
            logger.error('Gemini API returned non-OK', { status: response.status, body: text });
            // try parse JSON error if possible
            try {
                const errorData = JSON.parse(text);
                const msg = errorData.error?.message || JSON.stringify(errorData);
                throw new Error(`Gemini API error: ${msg}`);
            } catch (parseErr) {
                throw new Error(`Gemini API error: status ${response.status} body: ${text}`);
            }
        }

        const aiResponse = await response.json();

        // validate shape
        if(!aiResponse || !Array.isArray(aiResponse.candidates) || aiResponse.candidates.length === 0) {
            logger.error('Unexpected Gemini response shape', { aiResponse });
            throw new Error('Unexpected Gemini response: missing candidates');
        }
        const candidate = aiResponse.candidates[0];
        const aiContent = candidate?.content?.parts?.[0]?.text;
        if(!aiContent || typeof aiContent !== 'string') {
            logger.error('Missing content in Gemini candidate', { aiResponse });
            throw new Error('Gemini response missing message content');
        }

        let parsedResponse: any;
        try {
            parsedResponse = JSON.parse(aiContent);
        } catch (parseErr) {
            logger.error('Failed to parse AI content as JSON', { aiContent });
            throw new Error('Failed to parse AI response JSON');
        }

        if(!parsedResponse.titles || !Array.isArray(parsedResponse.titles)){
            logger.error('Parsed response does not contain titles array', { parsedResponse });
            throw new Error('AI response missing titles array');
        }

        const improvedTitles: ImprovedTitle[] = parsedResponse.titles.map((t: any, idx: number) => ({
            original: t.original,
            improved: t.improved,
            rationale: t.rationale,
            url: videos[idx]?.url,
        }));
        console.log(' titles generated successfully', {jobId, improvedCount: improvedTitles.length});

        await state.set('job', jobId, {
            ...jobData,
            status : 'titles ready',
            improvedTitles
        })
        await emit({
            topic: "yt.titles.ready",
            data: {
                jobId,
                email,
                channelName,
                improvedTitles
            }
        })
            

    }catch (error: unknown) {

        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error("Error generating titles", { error: errMsg });

        if(!jobId || !email) {
            logger.ercror("cannot send error notification missing jobId or email");
            return
        }
        const jobData = await state.get('job', jobId)
        await state.set('job', jobId, {
            ...jobData,
            status : 'failed',
            error: errMsg
        })
        await emit({
            topic: "yt.titles.error",
            data: {
                jobId,
                email,
                error: "failed to generate titles please try again later"
            }
        })
    }
}