const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oohabvgbrzrewwrekkfy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE'
);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  const tablesToCheck = ['posts','post','slides','services','service','certificate','agent profile','transaction'];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table}: DOES NOT EXIST or inaccessible — ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTS — records: ${data.length}`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR — ${err.message}`);
    }
  }

  console.log('\n✨ Check complete!');
}

checkTables();
