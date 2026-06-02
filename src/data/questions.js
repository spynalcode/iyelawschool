import { CIVIL_Q } from "./q_civil.js";
import { CRIMINAL_Q } from "./q_criminal.js";
import { ETHICS_Q } from "./q_ethics.js";
import { PROPERTY_Q } from "./q_property.js";
import { CORPORATE_Q } from "./q_corporate.js";

// Merged map: topicId -> array of raw questions { q, correct, wrong[] }
export const QUESTIONS = {
  ...CIVIL_Q,
  ...CRIMINAL_Q,
  ...ETHICS_Q,
  ...PROPERTY_Q,
  ...CORPORATE_Q,
};
