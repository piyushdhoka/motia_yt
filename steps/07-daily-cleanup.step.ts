import { CronConfig } from 'motia';

// Daily cleanup job - runs every day at midnight to clean up old job data

export const config: CronConfig = {
    name: 'DailyCleanup',
    type: 'cron',
    cron: '0 21 * * *', // Every day at 9 PM
    emits: ['cleanup.completed']
};

export const handler = async ({ logger, state, emit }: any) => {
    try {
        logger.info('Running daily cleanup job');

        // Define how old jobs should be before cleanup (e.g., 7 days)
        const RETENTION_DAYS = 7;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
        const cutoffTimestamp = cutoffDate.getTime();

        // Get all jobs from state store
        const allJobs = await state.getGroup('job') || [];
        
        let deletedCount = 0;
        let errorCount = 0;

        // Iterate through jobs and delete old ones
        for (const job of allJobs) {
            try {
                // Check if job has a createdAt timestamp
                if (job.createdAt) {
                    const jobDate = new Date(job.createdAt);
                    const jobTimestamp = jobDate.getTime();

                    // If job is older than retention period, delete it
                    if (jobTimestamp < cutoffTimestamp) {
                        await state.delete('job', job.jobId);
                        deletedCount++;
                        logger.info('Deleted old job', { 
                            jobId: job.jobId, 
                            createdAt: job.createdAt,
                            age: Math.floor((Date.now() - jobTimestamp) / (1000 * 60 * 60 * 24)) + ' days'
                        });
                    }
                }
            } catch (err) {
                errorCount++;
                const errMsg = err instanceof Error ? err.message : String(err);
                logger.error('Error deleting job', { jobId: job.jobId, error: errMsg });
            }
        }

        logger.info('Cleanup job completed', {
            retentionDays: RETENTION_DAYS,
            cutoffDate: cutoffDate.toISOString(),
            totalJobs: allJobs.length,
            deletedCount,
            errorCount
        });

        await emit({
            topic: 'cleanup.completed',
            data: {
                timestamp: new Date().toISOString(),
                retentionDays: RETENTION_DAYS,
                deletedCount,
                errorCount
            }
        });

    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error('Error during daily cleanup', { error: errMsg });
    }
};
