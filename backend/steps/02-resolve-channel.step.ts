import {EventConfig} from "motia";
import { z } from 'zod';

// convert yt name into  channel id using yt data api

export const config: EventConfig = {
    name : "ResolveChannel",
    type : "event",
    subscribes: ["yt.submit"],
    emits : ["yt.channel.resolved", "yt.channel.error"],
    input: z.object({
        jobId: z.string().optional(),
        email: z.string().optional(),
        channel: z.string().optional(),
    })
};

export const handler = async (eventData: any, {emit , logger, state}: any) => {

    let jobId: string | undefined 
    let email: string | undefined
    
    try{
        const data = eventData || {}
        jobId = data.jobId;
        email = data.email;
        const channel = data.channel;

        logger.info('resolving yt channel', {jobId, channel});
        
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        if(!YOUTUBE_API_KEY) {
            throw new Error("Missing YOUTUBE_API_KEY in environment variables");
        }
        const jobData = await state.get('job', jobId)
        await state.set('job', jobId, {
            ...jobData,
            status : 'resolving_channel'
        })

        let channelId: string | null = null
        let channelName: string = ""

        if (channel.startsWith('@')) {
            const handle = channel.substring(1);
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            if (searchData.items && searchData.items.length > 0){
                channelId = searchData.items[0].snippet.channelId;
                channelName = searchData.items[0].snippet.title;
            }
        }
        else {
                const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channel)}&key=${YOUTUBE_API_KEY}`;
                const searchResponse = await fetch(searchUrl);
                const searchData = await searchResponse.json();
                if (searchData.items && searchData.items.length > 0){
                    channelId = searchData.items[0].snippet.channelId;
                    channelName = searchData.items[0].snippet.title;
                }
            }
        
        if(!channelId) {
            logger.error("channel not found", {channel});
            await state.set('job', jobId, {
                ...jobData,
                status : 'failed',
                error: 'channel not found'
            });
            await emit({
            topic : "yt.channel.error",
            data : {
                jobId,
                email,
            },
        });
        return;
        }

        await emit({
            topic : "yt.channel.resolved",
            data : {
                jobId,
                channelId,
                channelName,
                email,
            },
        });
        return;

    } catch (error: any ) {
        logger.error("Error in ResolveChannel handler", {error: error.message})
        if(!jobId || !email) {
            logger.error("Missing jobID or email, cannot emit error event");
            return
        }
        const jobData = await state.get('job', jobId)
        await state.set('job', jobId, {
            ...jobData,
            status : 'failed',
            error: error.message
        })
        await emit({
            topic: "yt.channel.error",
            data: {
                jobId,
                email,
                error: "failed to resolve channel please try again"
            }
        })
            }
        

    }