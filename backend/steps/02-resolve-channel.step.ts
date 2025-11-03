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

        // Helper to try searching YouTube for a given query and return first match
        const trySearch = async (query: string) => {
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            if (searchData && Array.isArray(searchData.items) && searchData.items.length > 0) {
                return {
                    id: searchData.items[0].snippet.channelId,
                    name: searchData.items[0].snippet.title,
                };
            }
            return null;
        };

        if (typeof channel === 'string') {
            const raw = channel.trim();

            // Build candidate queries to handle handles and names with spaces.
            const candidates: string[] = [];
            if (raw.startsWith('@')) {
                const afterAt = raw.substring(1).trim();
                // common variations: no spaces (handles typically have no spaces), original, hyphenated
                candidates.push(afterAt.replace(/\s+/g, ''));
                candidates.push(afterAt);
                candidates.push(afterAt.replace(/\s+/g, '-'));
            } else {
                candidates.push(raw);
                candidates.push(raw.replace(/\s+/g, ''));
                candidates.push(raw.replace(/\s+/g, '-'));
            }

            // Deduplicate candidates while preserving order
            const seen = new Set<string>();
            const uniqCandidates = candidates.filter((c) => {
                const key = c.toLowerCase();
                if (seen.has(key) || !c) return false;
                seen.add(key);
                return true;
            });

            for (const q of uniqCandidates) {
                try {
                    logger.info('trying channel search', { jobId, q });
                    const found = await trySearch(q);
                    if (found) {
                        channelId = found.id;
                        channelName = found.name;
                        break;
                    }
                } catch (err: any) {
                    logger.warn('youtube search attempt failed', { jobId, q, err: err?.message });
                }
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