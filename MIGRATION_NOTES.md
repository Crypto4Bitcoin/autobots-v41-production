# Migration Notes

## Quarantined Legacy Routes
- app/api/market
- app/api/tasks
- app/api/irs
- app/academy/computer-jobs

## Goal
Restore routes one at a time after build stability is confirmed.

## Restore Order
1. app/api/market
2. app/api/tasks
3. app/api/irs
4. app/academy/computer-jobs

## Temporary Strategy
- stub broken routes with 501
- replace missing imports with current Zustand stores and shared types
- avoid deleting legacy code until replacement passes build
