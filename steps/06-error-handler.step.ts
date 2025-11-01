import {EventConfig} from "motia";
import { z } from 'zod';

//send formatted email with video titles to user using resend

export const config: EventConfig = {
    name : "errorHandler",
    type : "event",
    subscribes: ["yt.channel.error", "yt.videos.error", "yt.titles.error"],
    emits : ["yt.error.notified"],

    input: z.object({
        jobId: z.string().optional(),
        email: z.string().optional(),
        channelId: z.string().optional(),
        channelName: z.string().optional(),
    })
};

export const handler = async (eventData: any, {emit , logger, state}: any) => {

    try {
        const data = eventData || {}
        const jobId = data.jobId;
        const email = data.email;
        const error = data.error;
        const channelName = data.channelName;
        logger.info('handling error notifications', {jobId, email, error});    
    
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
            const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
            if(!RESEND_API_KEY) {
                throw new Error("Missing RESEND api key  in environment variables");
            }
    
        const emailText = `we are facing some issue generating titles for your channel: ${channelName || 'unknown'}.
        error details: ${error || 'no details provided'}`;
    
                const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: RESEND_FROM_EMAIL,
                    to: [email],
                    subject : `Issue with your YouTube Title Generation Job ${channelName || ''}`,
                    text : emailText,
                }),
            });
    
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`resend api errors: ${response.status} - ${errorBody}`);
            }
    
            const emailResult = await response.json();
            await emit({
                topic: "yt.error.notified",
                data: {
                    jobId,
                    email,
                    emailId: emailResult.id,
                    
                }
            })
    } catch (error) {
        
        logger.error("Error sending error notification email", { error });
    }
}
