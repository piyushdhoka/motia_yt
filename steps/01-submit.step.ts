import {ApiRouteConfig} from "motia";

export const config: ApiRouteConfig = {
    name : "SubmitChannel",
    type : "api",
    path : "/submit",
    method : "POST",
    emits : ["yt.submit"]

};

interface SubmitRequest {
    channel : string;
    email: string;  
}

export const handler = async (req: any, {emit , logger, state}: any) => {
    try {
        logger.info("Received request in Submission request", {body: req.body});
        const {channel , email} : SubmitRequest = req.body;
        if(!channel || !email) {
            return {
                status: 400,
                body: { error: "missing required fields" },
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                status: 400,
                body: { error: "Invalid email format" },
            };
        }
        
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await state.set(`job: ${jobId}`,{
            jobId,
            channel,
            email,
            status: "QUEUED",
            createdAt: new Date().toISOString()

        })
        logger.info("job created", {jobId, channel, email});
        await emit({
            topic: "yt.submit",
            data: {
                jobId,
                channel,
                email
            }
            });
            return {
                status: 201,
                body: { 
                    success: true,
                    jobId,
                    message: "Submission received and is being processed. you will get email soon with improved suggestions for your youtube videos."
                 },
            };

    } catch (error:any) {
        logger.error("Error in SubmitChannel handler:", {error: error.message});
        return {
            status: 400,
            body: { error: "Internal Server Error" },
        };
    }
}