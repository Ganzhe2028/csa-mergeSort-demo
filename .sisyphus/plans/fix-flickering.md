# Plan: Fix Split Animation Flickering

## Problem
The user reported a "flickering" effect during the split phase of the Merge Sort visualization.
- **Observation**: Nodes flash or blink when moving from one row (depth) to the next.
- **Cause**: The `SortingStage.tsx` component wraps each depth row in a `<motion.div>` inside `<AnimatePresence>`. These rows have `initial={{ opacity: 0 }}` and `exit={{ opacity: 0 }}` animations.
- **Conflict**: When nodes move to a new depth, the new depth row "fades in". This opacity transition interferes with the `layoutId` shared element transition of the nodes themselves. The nodes are "moving" smoothly via `layoutId`, but their *container* is invisible (opacity 0) at the start of the frame, causing them to disappear and reappear (flicker).

## Solution
Remove the entry/exit animations from the depth row containers. The containers should simply appear/disappear instantly so that the `layoutId` transition of the `NumberBlock` children (which is continuous) remains visible at all times.

## Proposed Changes

### 1. Modify `src/components/SortingStage.tsx`
- **Target**: The `<motion.div key={depth} ...>` element inside the `depths.map`.
- **Action**:
    - Remove `initial={{ opacity: 0, y: 20 }}`.
    - Remove `animate={{ opacity: 1, y: 0 }}`.
    - Remove `exit={{ opacity: 0 }}`.
    - Keep `layout` or `layoutId` if present on the container, or just make it a static `div` (or `motion.div` without variants) to let the children handle the movement.
    - Since `AnimatePresence` is wrapping it, we should likely keep it as `motion.div` but remove the interfering visual styles. Actually, if we remove `exit`, `AnimatePresence` might not be needed for the rows themselves, but it might be useful for other effects. For now, removing the props is the safest minimal change.

## Verification
1. **Manual Test**: Run the app (`npm run dev`), click "Play".
2. **Observe**: Watch the split phase (nodes moving down).
3. **Success Criteria**: Nodes glide smoothly to the next row without blinking or fading in.

