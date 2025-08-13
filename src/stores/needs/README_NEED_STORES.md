# Guinea Pig Need Store System

This directory contains the standardized need store system for managing guinea pig needs like hunger, thirst, love, etc.

## 📁 File Structure

```
src/stores/needs/
├── needStoreInterface.js      # Standard interface definition and validation
├── needStoreMixin.js          # Shared methods for all need stores
├── needsFulfillmentPatterns.js # Fulfillment patterns for all needs
├── needStoreTemplate.js       # Template for creating new need stores
├── needsQueue.js             # Central orchestrator for all needs
├── hunger.js                 # Hunger need implementation (food-based)
├── thirst.js                 # Thirst need implementation (water-based)
├── love.js                   # Love need implementation (interaction-based)
└── README_NEED_STORES.md     # This documentation file
```

## 🏗️ Architecture Overview

### Central Components

1. **needsQueue.js** - Central orchestrator
   - Manages priority queue of all needs
   - Calculates overall wellness
   - Coordinates degradation timing
   - Pure orchestration (no message handling)

2. **needStoreMixin.js** - Shared functionality
   - Status change detection
   - Reaction handling with proper timing
   - Interface validation
   - Standard helper methods

3. **needStoreInterface.js** - Standard contract
   - Defines required properties, getters, actions
   - Validation functions for development
   - Documentation and examples

### Individual Need Stores

Each need (hunger, thirst, love, etc.) has its own store that follows the standard interface:

- **State**: Current value, degradation rate, messages, reactions
- **Getters**: Status thresholds, fulfillment methods
- **Actions**: degrade(), fulfill(), reset(), plus mixin methods

## 🎯 Creating a New Need Store

### Step 1: Copy the Template
```bash
cp needStoreTemplate.js yourNeed.js
```

### Step 2: Replace Placeholders
Find and replace all instances of `NEEDNAME` with your actual need name (lowercase):
- `NEEDNAME` → `thirst` (for example)
- Update file name, store name, imports

### Step 3: Customize Content
1. **Set the emoji** in `messageConfig.emoji`
2. **Customize messages** in `urgencyMessages` and `reactions`
3. **Set degradation rate** from `STANDARD_DEGRADATION_RATES`
4. **Implement fulfillment** pattern (see options below)

### Step 4: Choose Fulfillment Pattern

#### Option A: Use Predefined Patterns
```javascript
// Uses patterns from needsFulfillmentPatterns.js
fulfill(methodName) {
  const patterns = NEED_FULFILLMENT_PATTERNS.yourNeed
  const method = patterns.methods[methodName]
  // ... standard implementation
}
```

#### Option B: Use External Store
```javascript
// Integrates with another store (like hunger uses food store)
fulfill(methodName) {
  const externalStore = useYourExternalStore()
  return externalStore.fulfillNeed(methodName, this.needType)
}
```

#### Option C: Custom Implementation
```javascript
// Custom logic specific to your need
fulfill(methodName) {
  // Your custom fulfillment logic here
}
```

### Step 5: Register the Need
1. **Add to needsQueue.js**:
   ```javascript
   needs: {
     hunger: 'hunger',
     thirst: 'thirst',  // Add your need here
     // ...
   }
   ```

2. **Update getNeedStore() method**:
   ```javascript
   getNeedStore(storeName) {
     switch (storeName) {
       case 'hunger': return useHungerStore()
       case 'thirst': return useThirstStore()  // Add your store here
       // ...
     }
   }
   ```

### Step 6: Test Implementation
The system automatically validates your store on startup and shows any issues in the console.

## 🔧 Integration Points

### With needsQueue
- **Automatic registration**: Added to needs list and getNeedStore()
- **Degradation coordination**: needsQueue calls degrade() on schedule
- **Reaction handling**: Store handles its own reactions via mixin
- **Urgency calculation**: needsQueue calculates and sets urgency

### With Status System
- **Message display**: Uses urgencyMessages for automatic status messages
- **Reaction display**: Uses reactions for status change notifications
- **Temporary messages**: Can show temporary messages via mixin

### With Other Stores
- **Food store**: Hunger integrates for fulfillment methods
- **Inventory**: For consuming items during fulfillment
- **Statistics**: For tracking fulfillment actions
- **Cage store**: For pause state and position checking

## 📝 Naming Conventions

### File Names
- Use lowercase: `hunger.js`, `thirst.js`, `love.js`
- Match the need type exactly

### Store Names
- Use camelCase for store definition: `defineStore('thirst', ...)`
- Export as: `useThirstStore`

### Need Types
- Use lowercase strings: `'hunger'`, `'thirst'`, `'love'`
- Match the store name

### Method Names
- Use snake_case: `water_bottle`, `gentle_petting`
- Be descriptive and specific

### Console Log Prefixes
- Use uppercase store name: `[HUNGER]`, `[THIRST]`, `[LOVE]`
- Include appropriate emoji: `🍽️ [HUNGER]`, `💧 [THIRST]`, `💕 [LOVE]`

## 🎛️ Standard Configuration

### Degradation Rates (points per second)
```javascript
hunger: 0.1      // Most urgent (6 points/minute)
thirst: 0.08     // Very urgent (4.8 points/minute)  
love: 0.05       // Social need (3 points/minute)
hygiene: 0.03    // Slower (1.8 points/minute)
chew: 0.025      // Dental health (1.5 points/minute)
enrichment: 0.02 // Mental stimulation (1.2 points/minute)
shelter: 0.015   // Security need (0.9 points/minute)
sleep: 0.01      // Rest cycles (0.6 points/minute)
nails: 0.005     // Grooming need (0.3 points/minute)
```

### Status Thresholds
- **Fulfilled**: 90-100 (need is well satisfied)
- **Normal**: 70-89 (need is adequately met)
- **Urgent**: 50-69 (need requires attention)
- **Critical**: 0-49 (need is critical)

### Message Intervals
- **Normal**: 12+ seconds between messages
- **Urgent**: 6-10 seconds between messages
- **Critical**: 4-6 seconds between messages

## 🐛 Debugging

### Console Logs
All need stores use consistent logging with store prefixes:
```
🍽️ [HUNGER] FEED: Guinea pig consumed food, hunger improved by 15
💧 [THIRST] FULFILL: Water Bottle improved thirst by 25
💕 [LOVE] FULFILL: Gentle Petting improved love by 20
```

### Validation
Development mode automatically validates all need stores against the standard interface:
```
✅ Need store "hunger" follows standard interface
⚠️ Need store "thirst" does not follow standard interface:
  - Missing required state property: reactions
```

### Common Issues
1. **Missing validation**: Make sure to call `initialize()` in actions
2. **Wrong thresholds**: Use standard thresholds or document custom ones
3. **Missing mixin**: Always include `...needStoreMixin` in actions
4. **Invalid fulfillment**: Check that fulfillment methods exist and work

## 🔮 Future Considerations

### External Store Integration
Some needs may require dedicated external stores:
- **Water store**: For thirst (water quality, cleanliness)
- **Interaction store**: For love (bonding levels, interaction history)
- **Enrichment store**: For enrichment (toy rotation, activity tracking)

### Advanced Features
- **Time-based needs**: Sleep cycles, feeding schedules
- **Conditional needs**: Weather-dependent, age-dependent
- **Social needs**: Multi-guinea pig interactions
- **Health needs**: Veterinary care, medication

### Performance
- **Lazy loading**: Only load active need stores
- **Batch updates**: Optimize degradation calculations
- **Memory management**: Clean up unused reactions and messages

---

## 📋 Quick Reference Checklist

When creating a new need store:

- [ ] Copy `needStoreTemplate.js` to `yourNeed.js`
- [ ] Replace all `NEEDNAME` instances with your need name
- [ ] Set appropriate emoji in `messageConfig`
- [ ] Customize `urgencyMessages` for your need
- [ ] Customize `reactions` for your need
- [ ] Set `degradationRate` from standards or custom value
- [ ] Implement `fulfill()` method (predefined/external/custom)
- [ ] Update `fulfillmentMethods` getter to match
- [ ] Add need to `needsQueue.js` needs object
- [ ] Add store to `needsQueue.js` getNeedStore() method
- [ ] Test implementation and check console for validation
- [ ] Verify reactions and messages display correctly