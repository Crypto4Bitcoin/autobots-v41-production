import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { useEconomyStore } from './economyStore';

export interface CarAsset {
  id: string;
  model: string;
  type: 'collector' | 'fleet' | 'prototype';
  value: number;
  utilityIndex: number; // 0-100
  depreciationRate: number; // %/year
  status: 'active' | 'stored' | 'repair';
}

interface CarState {
  fleet: CarAsset[];
  totalFleetValue: number;
  operationalEfficiency: number;
}

interface CarActions {
  addCar: (car: CarAsset) => void;
  retireCar: (id: string) => void;
  calculateEfficiency: () => void;
  syncFleet: () => void;
}

export const useCarStore = create<CarState & CarActions>((set, get) => ({
  fleet: [
    { id: 'car-01', model: 'Aethel-Voyager V1', type: 'fleet', value: 85000, utilityIndex: 94, depreciationRate: 12, status: 'active' },
    { id: 'car-02', model: 'Legacy Interceptor', type: 'collector', value: 240000, utilityIndex: 20, depreciationRate: -2, status: 'stored' }
  ],
  totalFleetValue: 325000,
  operationalEfficiency: 92.4,

  addCar: (car) => {
    set((state) => ({
      fleet: [...state.fleet, car],
      totalFleetValue: state.totalFleetValue + car.value
    }));
    useEconomyStore.getState().recordPulse('CAR_ACQ', -car.value);
    GlobalMemory.record('CAR', `New vehicle added to fleet: ${car.model}.`, 100);
  },

  retireCar: (id) => {
    const car = get().fleet.find(c => c.id === id);
    if (car) {
       set((state) => ({
           fleet: state.fleet.filter(c => c.id !== id),
           totalFleetValue: state.totalFleetValue - car.value
       }));
       useEconomyStore.getState().purchaseCredits(car.value * 0.4); // Scrappage value
       GlobalMemory.record('CAR', `Vehicle retired: ${car.model}. Scrappage credits injected.`, 100);
    }
  },

  calculateEfficiency: () => {
    const efficiency = get().fleet.reduce((acc, c) => acc + (c.status === 'active' ? c.utilityIndex : 0), 0) / get().fleet.length;
    set({ operationalEfficiency: efficiency });
  },

  syncFleet: () => {
    GlobalMemory.record('CAR', 'Fleet intelligence synchronized. Logistics mesh online.', 100);
  }
}));