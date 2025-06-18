import { Job } from 'bullmq';
import { QUEUE_NAMES, createWorker } from '../queue.config';
import { User } from '@/core/entities/user.entity';

createWorker(QUEUE_NAMES.USER_CREATED, async (job: Job<User>) => {
  console.log('Processing user creation:', job.data);
  
  try {
    console.log(`User ${job.data.email} created successfully!`);    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('User creation processing completed');
  } catch (error) {
    console.error('Error processing user creation:', error);
    throw error; 
  }
});


createWorker(QUEUE_NAMES.USER_UPDATED, async (job: Job<User>) => {
  console.log('Processing user update:', job.data);
  
  try {
    console.log(`User ${job.data.email} updated successfully!`);    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User update processing completed');
  } catch (error) {
    console.error('Error processing user update:', error);
    throw error;
  }
});

createWorker(QUEUE_NAMES.USER_DELETED, async (job: Job<User>) => {
  console.log('Processing user deletion:', job.data);
  
  try {
    console.log(`User ${job.data.email} deleted successfully!`);    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User deletion processing completed');
  } catch (error) {
    console.error('Error processing user deletion:', error);
    throw error;
  }
});