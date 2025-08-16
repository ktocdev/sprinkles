# Missing Need Store Implementations

## Current Status

The needsQueue.js currently references 9 need types, but only 4 have been implemented:

### ✅ **Implemented Stores** (4/9)
- `hunger` - Uses food store integration
- `love` - Uses NEED_FULFILLMENT_PATTERNS  
- `thirst` - Uses NEED_FULFILLMENT_PATTERNS
- `wellness` - Calculated from other needs (special case)

### ❌ **Missing Stores** (5/9)
The following stores are referenced in needsQueue but not implemented:

1. **`sleep`** - Rest and sleep cycles
2. **`chew`** - Dental health through chewing
3. **`nails`** - Nail trimming and maintenance  
4. **`shelter`** - Safe hiding places and comfort
5. **`hygiene`** - Cleanliness and grooming
6. **`enrichment`** - Mental stimulation and activities

## Implementation Guide

Each missing store should be created using the `needStoreTemplate.js` as a base:

### Template Usage
1. Copy `src/stores/needs/needStoreTemplate.js` to `src/stores/needs/{needType}.js`
2. Replace all instances of `NEEDNAME` with the actual need name
3. Customize messages, emoji, and fulfillment methods
4. Add the store to `needsQueue.js` imports and `getNeedStore()` method

### Fulfillment Patterns Available
All missing stores have predefined patterns in `needsFulfillmentPatterns.js`:
- **`sleep`**: quiet_time, dim_lighting, comfortable_bedding, undisturbed_rest  
- **`chew`**: hay_cubes, wooden_chews, willow_sticks, cardboard_tubes
- **`nails`**: nail_trim, scratching_surface, regular_handling
- **`shelter`**: hideout, tunnel, soft_bedding, covered_area
- **`hygiene`**: cage_cleaning, bedding_change, spot_cleaning, grooming
- **`enrichment`**: foraging_mat, puzzle_feeder, climbing_ramp, toy_rotation, exploration_time

### Implementation Priority
Suggested order based on guinea pig care importance:
1. **`hygiene`** - Critical for health
2. **`chew`** - Critical for dental health  
3. **`shelter`** - Important for stress reduction
4. **`sleep`** - Important for well-being
5. **`enrichment`** - Important for mental health
6. **`nails`** - Periodic grooming need

## Code Integration Required

After creating stores, update these files:

### `src/stores/needs/needsQueue.js`
```javascript
// Add import
import { useNewNeedStore } from './newNeed.js'

// Update getNeedStore method
case 'newNeed':
  return useNewNeedStore()
```

### Update degradation rates in `needsFulfillmentPatterns.js`
All degradation rates are already defined in `STANDARD_DEGRADATION_RATES`.

## Testing
Each new store should be tested for:
- Proper degradation over time
- Fulfillment methods work correctly  
- Message display in StatusMarquee
- Integration with needsQueue system
- Status change reactions

## Notes
- All stores must follow the `needStoreInterface.js` specification
- Use `needStoreMixin` for common functionality
- Follow existing patterns from `hunger`, `love`, `thirst` stores
- Test thoroughly before deployment