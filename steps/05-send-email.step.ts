import {EventConfig} from "motia";
import { z } from 'zod';

//send formatted email with video titles to user using resend

export const config: EventConfig = {
    name : "sendEmail",
    type : "event",
    subscribes: ["yt.titles.ready"],
    emits : ["yt.email.sent"],

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
    try {
        const data = eventData || {}
        jobId = data.jobId;
        const email = data.email;
        const channelName = data.channelName;
        const improvedTitles = data.improvedTitles

        logger.info('sending email', {jobId, email, titlecount: improvedTitles.length});

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
        if(!RESEND_API_KEY) {
            throw new Error("Missing RESEND api key  in environment variables");
        }
        const jobData = await state.get(`job: ${jobId}`)
        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'sending email',
        })
        const emailText = generateEmailText( channelName, improvedTitles);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: RESEND_FROM_EMAIL,
                to: [email],
                subject : `Improved Video Titles for Your Channel "${channelName}"`,
                text : emailText,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`resend api errors: ${response.status} - ${errorBody}`);
        }

        const emailResult = await response.json();
        logger.info('email sent successfully', {jobId, emailId: emailResult.id});


        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'completed',
            emailId: emailResult.id,
            completedAt: new Date().toISOString(),
        })
        await emit({
            topic: "yt.email.sent",
            data: {
                jobId,
                email,
                emailId: emailResult.id,
                
            }
        })

    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error("Error sending emails", { error: errMsg });

        if(!jobId) {
            logger.error("cannot send error notification missing jobId");
            return
        }
        const jobData = await state.get(`job: ${jobId}`)
        await state.set(`job: ${jobId}`,{
            ...jobData,
            status : 'failed',
            error: errMsg
        })
    }

}

function  generateEmailText(channelName: string, titles: ImprovedTitle[]):  string {

    let text = `Here are the improved video titles for your channel "${channelName}":\n\n`;
    text += `${"=".repeat(50)}\n\n`;

    titles.forEach((title, index) => { 
    text += `Video ${index + 1}:\n`;
    text  += `Original Title: ${title.original}\n`;
    text  += `Improved Title: ${title.improved}\n`;
    text  += `Rationale: ${title.rationale}\n`;
    text += `URL: ${title.url}\n`;
    });

    text += `\n${"=".repeat(50)}\n\n`;

    text += `Powered by motia\n`;
    return text;
}

