import { sequelize } from './src/db/index.js';

async function runMigration() {
    try {
        console.log('Running migration: Add lunch columns to doctor_schedules...');
        
        await sequelize.query(`
            ALTER TABLE doctor_schedules 
            ADD COLUMN IF NOT EXISTS lunch_start_time TIME NULL AFTER end_time,
            ADD COLUMN IF NOT EXISTS lunch_end_time TIME NULL AFTER lunch_start_time
        `);
        
        console.log('✅ Migration completed successfully!');
        
        // Verify columns were added
        const [results] = await sequelize.query('DESCRIBE doctor_schedules');
        console.log('\nDoctor Schedules table structure:');
        console.table(results);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
