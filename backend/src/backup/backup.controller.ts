import { Controller, Post, Get } from '@nestjs/common';
import { AtlasBackupService } from '../atlas-backup/atlas-backup.service'; 

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: AtlasBackupService) {}

// ... (previous imports and constructor)

@Post('create') // The route will be /backup/create
async triggerBackup() {
  try {
    await this.backupService.createBackup();  // Call the service method
    return { message: 'Backup initiated successfully' }; // Or any appropriate response
  } catch (error) {
    // Handle errors appropriately (e.g., logging, returning an error response)
    console.error("Backup failed:", error);
    return { error: 'Backup failed' }; // Or a more detailed error message
  }
}


// // A GET route to list backups (if you have a listBackups() method in the service)
//  @Get('list')
//  async listBackups(){
//      try{
//          return await this.backupService.listBackups()
//      }catch(e){
//          console.log(e)
//          return {
//              error:"Failed to retrieve backups"
//          }
//      }
//  }
}

