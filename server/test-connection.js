import dotenv from 'dotenv';
import postgres from 'postgres';
import dns from 'dns';

dotenv.config({ path: '../.env' });

const connectionString = process.env.DATABASE_URL;
console.log('Testing Connection URL:', connectionString);

if (!connectionString) {
    console.error('ERROR: DATABASE_URL is undefined');
    process.exit(1);
}

// Extract hostname
try {
    const url = new URL(connectionString);
    const hostname = url.hostname;
    console.log('Hostname:', hostname);

    console.log('Attempting DNS lookup...');
    dns.lookup(hostname, (err, address, family) => {
        if (err) {
            console.error('DNS Lookup Failed:', err);
        } else {
            console.log('DNS Lookup Success:', address, 'Family:', family);
        }
    });

} catch (e) {
    console.error('Invalid URL format:', e.message);
}

const sql = postgres(connectionString, {
    ssl: 'require', // Enforce SSL for Supabase
    connect_timeout: 10,
});

async function test() {
    try {
        console.log('Connecting to database...');
        const result = await sql`SELECT version()`;
        console.log('Connection Successful!', result);
    } catch (err) {
        console.error('Connection Failed:', err);
    } finally {
        await sql.end();
    }
}

test();
