import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class AtlasBackupService {
  @Cron('0 3 * * *') // Run daily at 3 AM
  async createBackup() {
    const uri = "mongodb+srv://Yabany:0000@cluster0.5vcpt.mongodb.net/Ytest?retryWrites=true&w=majority&appName=Cluster0";
    const backupDir = '/backup/mongodb'; // <--- Corrected path
    const collections = ['users', 'Progress'];

    try {
      for (const collection of collections) {
        const command = `mongodump --uri="${uri}" --db=Ytest --collection=${collection} --out="${backupDir}" --gzip`;

        const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              resolve({ stdout, stderr });
            }
          });
        });

        console.log(`Backup created for ${collection}:`, stdout);
        if (stderr) console.error(`Backup Error for ${collection}:`, stderr);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }
}