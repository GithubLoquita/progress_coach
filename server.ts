/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini client on server with appropriate configuration
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for schedule generation
  app.post("/api/generate-schedule", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY is not defined. Please enter your Gemini API Key in the AI Studio environment secrets panel (under Settings or Secrets) to enable real-time schedules generation using the Gemini AI model!" 
        });
      }

      const { subjects, chapters, mocks, userPreferences } = req.body;

      if (!subjects || !chapters) {
        return res.status(400).json({ error: "Subjects and chapters data are required." });
      }

      // Filter to find the backlog/incomplete chapters
      const incompleteChapters = chapters.filter((c: any) => c.status !== 'COMPLETED');
      
      const prompt = `You are an elite academic coach specializing in West Bengal Civil Service (WBCS) exam preparation. 
Aspirant details:
- Backlog size (uncompleted chapters): ${incompleteChapters.length} chapters
- Focus preference: ${userPreferences?.focusStyle || 'balanced'} style
- Available daily hours for studying: ${userPreferences?.hoursPerDay || 6} hours

Please analyze the syllabus status and mock test parameters to produce an adaptive daily study schedule.

=== SYLLABUS BACKGROUND SUBJECTS ===
${JSON.stringify(subjects.map((s: any) => ({ title: s.title, coverage: `${s.completedChapters}/${s.chaptersCount}` })), null, 2)}

=== BACKLOG CHAPTER DETAILS ===
${JSON.stringify(incompleteChapters.slice(0, 15).map((c: any) => ({
  title: c.title,
  subject: subjects.find((s: any) => s.id === c.subjectId)?.title || "General studies",
  status: c.status
})), null, 2)}

=== HISTORICAL MOCK TEST SCORES AND ANALYSIS ===
${JSON.stringify(mocks || [], null, 2)}

Instructions:
Generate a highly precise daily study routine of ${userPreferences?.hoursPerDay || 6} hours. 
Adjust for the requested Focus Style:
- 'aggressive': target backlog chapters with intensity, dividing blocks between high-weightage Prelims/Mains papers.
- 'balanced': partition time between core backlog reading, mock analysis, and daily revisions.
- 'test-centric': structure active sessions around solving MCQs/Mains questions for weak areas identified in mocks, with rapid reviews.

Keep descriptions highly professional, motivational, and tailored to WBCS papers (Polity, History of India, Bengal/Geography, Arithmetic & Reasoning).
Output strictly as a valid JSON object matching the requested Schema. Do not wrap with other wrappers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rationale: {
                type: Type.STRING,
                description: "A professional and encouraging rationale explaining the dynamic adjustments made."
              },
              dailyBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeSlot: { type: Type.STRING, description: "e.g., 07:00 AM - 09:00 AM" },
                    title: { type: Type.STRING, description: "Session title" },
                    duration: { type: Type.INTEGER, description: "Duration in minutes" },
                    subject: { type: Type.STRING, description: "Subject name mapped from system" },
                    chapterSuggestion: { type: Type.STRING, description: "Backlog topic recommendation or weak area focus" },
                    type: { type: Type.STRING, description: "Must be: REVISION, NEW_TOPIC, PRACTICE, or BREAK" },
                    guidance: { type: Type.STRING, description: "Tactical tips tailored to West Bengal Civil Service context" }
                  },
                  required: ["timeSlot", "title", "duration", "subject", "chapterSuggestion", "type", "guidance"]
                }
              },
              weeklyFocusAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly prioritized recommendations to align with this week."
              },
              mockTestStrategy: {
                type: Type.STRING,
                description: "Actionable strategy advising how to overcome weak areas in subsequent mock exams."
              }
            },
            required: ["rationale", "dailyBreakdown", "weeklyFocusAreas", "mockTestStrategy"]
          }
        }
      });

      const responseText = response.text?.trim() || "{}";
      const scheduleResult = JSON.parse(responseText);
      res.json(scheduleResult);
    } catch (err: any) {
      console.error("Gemini server API error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI study schedule." });
    }
  });

  // Serve static assets in production, otherwise pass to Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
