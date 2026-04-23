/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Case, Severity } from "./types";

export const MOCK_CASES: Case[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    symptoms: ["Fièvre", "Toux sèche", "Fatigue"],
    description: "Je me sens très fatigué avec une toux persistante depuis deux jours.",
    location: { lat: 48.8566, lng: 2.3522, city: "Paris" },
    age: 34,
    gender: "M",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    symptoms: ["Eruption cutanée", "Démangeaisons"],
    description: "Des taches rouges sont apparues sur mes bras ce matin.",
    location: { lat: 45.7640, lng: 4.8357, city: "Lyon" },
    age: 12,
    gender: "F",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    symptoms: ["Fièvre", "Toux sèche", "Difficulté respiratoire"],
    description: "Essoufflement rapide et forte fièvre.",
    location: { lat: 48.8584, lng: 2.2945, city: "Paris" },
    age: 45,
    gender: "M",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    symptoms: ["Fièvre", "Frissons", "Douleurs musculaires"],
    description: "Grippe suspectée mais les frissons sont très intenses.",
    location: { lat: 43.6047, lng: 1.4442, city: "Toulouse" },
    age: 28,
    gender: "F",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    symptoms: ["Fièvre", "Toux sèche", "Perte d'odorat"],
    description: "Je ne sens plus rien et j'ai une légère fièvre.",
    location: { lat: 48.8647, lng: 2.3490, city: "Paris" },
    age: 52,
    gender: "F",
  }
];
