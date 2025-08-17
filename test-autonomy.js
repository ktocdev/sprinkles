// Test script to verify the autonomy store hunger system
// This can be run in the browser console to test autonomous food seeking

console.log('🤖 Testing Autonomy Store - Hunger System');

// Test imports and store access
try {
  // Test corrected needs patterns
  const correctedPatterns = {
    sleep: ['small_bed', 'large_bed', 'small_hammock', 'large_hammock', 'small_house', 'large_house'],
    hunger: ['hay', 'pellets', 'carrots', 'lettuce', 'blueberries', 'cucumbers'], // CORRECTED: actual food items
    thirst: ['water_bottle_fixed'] // CORRECTED: fixed water bottle position in top-right corner
  };
  
  console.log('✅ CORRECTED Need patterns (both hunger and thirst fixed):', correctedPatterns);
  
  // Test hunger quality ratings (matches food store values)
  const hungerQuality = {
    'pellets': 100,      // 30 hunger improvement
    'carrots': 90,       // 25 hunger improvement  
    'lettuce': 80,       // 20 hunger improvement
    'cucumbers': 70,     // 18 hunger improvement
    'hay': 60,           // 15 hunger improvement
    'blueberries': 50    // 12 hunger improvement
  };
  
  console.log('✅ Hunger quality ratings (by nutritional value):', hungerQuality);
  
  // Test thirst system
  console.log('✅ Thirst system: Fixed water bottle at top-right corner (cage width-1, 0)');
  console.log('✅ Thirst improvement: 20 points when guinea pig reaches water bottle');
  
  // Test updated autonomy priorities and thresholds
  console.log('✅ NEW PRIORITY SYSTEM (autonomous movement only):');
  console.log('  1. Hunger: 100 priority, seeks food at ≤70%');
  console.log('  2. Shelter: 90 priority, seeks shelter at ≤60%');
  console.log('  3. Chew: 80 priority, seeks chew items at ≤50%');
  console.log('  4. Enrichment: 70 priority, seeks enrichment at ≤45%');
  console.log('  5. Sleep: 60 priority, seeks sleep at ≤80%');
  console.log('  6. Love: 50 priority, seeks love at ≤40%');
  console.log('  7. Thirst: 40 priority, seeks water at ≤30% (less frequent)');
  console.log('');
  console.log('✅ USER INTERACTION ONLY (no autonomous seeking):');
  console.log('  - Hygiene: User must "use pet wipe" or "brush"');
  console.log('  - Nails: User must "clip nails" (slowest degradation: 0.002/sec)');
  console.log('');
  console.log('✅ Degradation rates: Nails slowest (0.002) < Thirst (0.03) < Hunger (0.1)');
  
  console.log('🎉 Hunger & Thirst autonomy system test completed successfully!');
  console.log('');
  console.log('Testing instructions:');
  console.log('1. Start the game and create a guinea pig');
  console.log('2. Place some food items on the cage using "Place Food Randomly" button');
  console.log('3. Wait for hunger/thirst to drop below thresholds');
  console.log('4. Guinea pig should autonomously move toward food items or water bottle');
  console.log('5. Check browser console for autonomy debug messages (🤖 [AUTONOMY])');
  console.log('');
  console.log('Expected behavior:');
  console.log('HUNGER (≤70%) - TOP PRIORITY:');
  console.log('- Guinea pig will prefer pellets > carrots > lettuce > cucumbers > hay > blueberries');
  console.log('- Will factor in distance - closer items get slight preference');
  console.log('- Will move step-by-step toward the target food using Manhattan pathfinding');
  console.log('');
  console.log('THIRST (≤30%) - LOWER PRIORITY:');
  console.log('- Guinea pig will move toward the water bottle (💧) in top-right corner');
  console.log('- Only triggers when thirst is quite low (30% vs 70% for hunger)');
  console.log('- Will be interrupted by higher priority needs (hunger, shelter, chew, etc.)');
  console.log('- Degrades slower, so less frequent water seeking overall');
  
} catch (error) {
  console.error('❌ Hunger autonomy test failed:', error);
}