/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  CRITICAL = "CRITICAL",
}

export interface IndividualAnalysis {
  diseases: { name: string; probability: number; rationale: string }[];
  severity: Severity;
  recommendations: string[];
  confidence: number;
}

export interface Case {
  id: string;
  timestamp: string;
  symptoms: string[];
  description: string;
  location: { lat: number; lng: number; city: string };
  age: number;
  gender: string;
  imageUrl?: string;
  analysis?: IndividualAnalysis;
}

export interface Cluster {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  casesCount: number;
  symptoms: string[];
  riskScore: number;
  trend: "rising" | "stable" | "declining";
}

export interface EpidemicStatus {
  globalRiskScore: number;
  activeClusters: Cluster[];
  totalCases: number;
  temporalPrediction: { date: string; expectedCases: number }[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: string;
  location: string;
  riskLevel: Severity;
  justification: string;
  timestamp: string;
}
