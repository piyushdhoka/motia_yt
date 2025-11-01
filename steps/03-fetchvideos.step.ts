import {EventConfig} from "motia";
import { z } from 'zod';

// convert yt name into  channel id using yt data api

export const config: EventConfig = {
    name : "fetchVideos",
    type : "event",
    subscribes: ["yt.channel.resolved"],
    emits : ["yt.videos.fetched", "yt.videos.error"],
    // input schema describing the event payload this handler expects
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

export const handler = async (eventData: any, {emit , logger, state}: any) => {

    let jobId: string | undefined; 
    let email: string | undefined;

    try{
        const data = eventData || {}
        jobId = data.jobId;
        email = data.email;
        const channelId = data.channelId;
        const channelName = data.channelName;
         logger.info('resolving yt channel', {jobId, channelId});
        
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        if(!YOUTUBE_API_KEY) {
            throw new Error("Missing YOUTUBE_API_KEY in environment variables");
        }
        const jobData = await state.get(`job: ${jobId}`)
        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'fetching videos'
        })
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&maxResults=5&order=date&type=video&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(searchUrl);
        const youtubeData = await response.json();

        if(!youtubeData.items || youtubeData.items.length === 0) {
        logger.warn("no videos found for channel", {jobId, channelId});

        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'failed',
            error : "no videos found for this channel"
        })
        await emit({    
            topic: "yt.videos.error",
            data: {
                jobId,
                email,
                error: "no videos found for this channel"
            }
        })
        return;
    }

    const videos: Video[] = youtubeData.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.default.url,
    }));
    logger.info("fetched videos", {jobId, videoCount: videos.length});

    await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'videos fetched ',
            videos
        })
    await emit({    
            topic: "yt.videos.fetched",
            data: {
                jobId,
                channelName,
                videos,
                email
            }
        })

    } catch (error: unknown) {
        // narrow unknown error safely
        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error("Error fetching videos", { error: errMsg });

        if(!jobId || !email) {
            logger.error("cannot send error notification missing jobId or email");
            return
        }
        const jobData = await state.get(`job: ${jobId}`)
        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'failed',
            error: errMsg
        })
        await emit({
            topic: "yt.videos.error",
            data: {
                jobId,
                email,
                error: "failed to fetch videos please try again later"
            }
        })
    }

}
