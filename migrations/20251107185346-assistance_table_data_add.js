'use strict';
require("dotenv").config();
module.exports = {
  async up(queryInterface, Sequelize) {


    const assiArr = [
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Nonprofit & Fundraising Helper",
        category: "Business",
        assistantId: "asst_P8h48AYW5QHjonp0h6b9f8H5",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Sales Pitch Writer",
        category: "Business",
        assistantId: "asst_e1KBUbun9eGdoRmmzNZ1akdh",
        question: "{\"Q1\":\"Write a 30-second elevator pitch for our mobile app that reduces ad ops workload.\",\"Q2\":\"Draft a cold email and 1 follow-up targeting growth leaders at D2C brands.\",\"Q3\":\"Give me SPIN discovery questions for a first call with a VP of Sales.\",\"Q4\":\"Outline 7 slides for a CFO deck focused on cost avoidance and ROI.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Small Business Consultant",
        category: "Business",
        assistantId: "asst_O87q2lO3JOgbrkTQf8T9LB50",
        question: "{\"Q1\":\"Create a one-page plan and 8-week GTM for my new local service.\",\"Q2\":\"Recommend pricing tiers and calculate break-even and payback.\",\"Q3\":\"Build a 12-month cash flow with levers to extend runway.\",\"Q4\":\"Draft SOPs and KPIs to cut fulfillment time by 30%.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Resume & Job Coach",
        category: "Career",
        assistantId: "asst_mZAkakcD6n6ysGNfc8ci6AZK",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Career Path Explorer",
        category: "Career",
        assistantId: "asst_qcP7vlQflDViqdEhjF1yVs6X",
        question: "{\"Q1\":\"Map my interests to 3 career options and recommend one to test first.\",\"Q2\":\"Give me a role snapshot and 8-week skills plan for UX Researcher.\",\"Q3\":\"Turn my goal into a SMART plan with weekly milestones and metrics.\",\"Q4\":\"Compare Data Analyst vs. Business Analyst for my strengths and time constraints.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Public Speaking Coach",
        category: "Career",
        assistantId: "asst_Q1f6RPhvwtz3KPZVnEMG2n49",
        question: "{\"Q1\":\"Turn my topic into a Monroe outline with opener, proof, visualization, and CTA.\",\"Q2\":\"Scan this deck for 10-20-30 issues and suggest simplifications slide-by-slide.\",\"Q3\":\"Improve my talk with ethos-pathos-logos edits and a stronger closer.\",\"Q4\":\"Build a 7-day rehearsal plan with checkpoints and a Q&A pack.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Idea Generator",
        category: "Creativity",
        assistantId: "asst_yNaDCLaINBCEMtCjgXDBA2Nm",
        question: "{\"Q1\":\"Give me 20 feature ideas for a productivity app for remote teams\",\"Q2\":\"Use SCAMPER to reimagine my online course concept\",\"Q3\":\"Generate 30 YouTube video ideas for small business marketing\",\"Q4\":\"How might we reduce customer onboarding time by 50%?\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Social Media Planner",
        category: "Creativity",
        assistantId: "asst_XEJcNlorii4ICNZuFsjZLnb5",
        question: "{\"Q1\":\"Set SMART goals and a 30-day calendar for LinkedIn and Instagram.\",\"Q2\":\"Define 5 content pillars with sub-themes and example posts for my brand.\",\"Q3\":\"Build a webinar campaign brief and post briefs for LinkedIn, Instagram, and X.\",\"Q4\":\"Create a weekly analytics review template and next-month test plan.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Ad & Copy Writer",
        category: "Creativity",
        assistantId: "asst_VClI4GFRcZUFc8iTaXZB1Hht",
        question: "{\"Q1\":\"RSA test: 15 headlines (≤30) + 4 descriptions (≤90) for “AI meeting notes” to sales managers?\",\"Q2\":\"Meta set: 3 primary texts (short/standard/long), 3 headlines (≤40), 2 CTAs for automated dashboards?\",\"Q3\":\"Rewrite in PAS + AIDA (≤80 words each): “Teams waste weekends fixing reports. Connect sources once. Ship dashboards daily. Try it free.”\",\"Q4\":\"Compliance check this claim and draft matching LP hero + 3 bullets: “Guaranteed 3x revenue in 30 days.”\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Script Writer",
        category: "Creativity",
        assistantId: "asst_2OqfRPgtmJLnptKKQMJeoJJA",
        question: "{\"Q1\":\"Write a 60-second UGC ad script for our AI notes app with two hook options.\",\"Q2\":\"Outline a 7-minute YouTube tutorial with timecodes and B-roll notes.\",\"Q3\":\"Turn this 800-word blog into a 45-second Reel with overlays and captions.\",\"Q4\":\"Create a webinar script (20 minutes) with engagement prompts and a single CTA.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Image Caption Assistant",
        category: "Creativity",
        assistantId: "asst_mKzDiGT95Znl4LguZyiPGirm",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Study Coach",
        category: "Education",
        assistantId: "asst_Tnhgknrdn0v5K4DRWhu50nXN",
        question: "{\"Q1\":\"Build a 7-day plan for calculus with 10 hours available and an exam in 4 weeks.\",\"Q2\":\"Turn these notes into 30 recall questions and schedule spaced reviews.\",\"Q3\":\"Interleave biology and chemistry topics for next week with 90-minute sessions.\",\"Q4\":\"Create a mock-test kit and a last-week plan for my certification exam.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Language Tutor",
        category: "Education",
        assistantId: "asst_dUQcmkKA1H2uz4EFbtUEdSYY",
        question: "{\"Q1\":\"Build a weekly plan to reach A2 in 8 weeks; 5 hours/week, focus on speaking.\",\"Q2\":\"Give me 10 essential travel phrases with pronunciation and a 10-minute drill.\",\"Q3\":\"Explain past vs. near future with 6 examples and a role-play.\",\"Q4\":\"Make 20 flashcards from my notes and schedule spaced reviews.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Homework Solver",
        category: "Education",
        assistantId: "asst_bvgEBuPOVXFsaTHzvgQhDLUU",
        question: "{\"Q1\":\"Plan an outline and sources for this history prompt; I’ll write the paragraphs.\",\"Q2\":\"Give me 4 practice variants of this algebra question with answers only.\",\"Q3\":\"Check my physics solution, find the exact error, and show how to fix it.\",\"Q4\":\"Show me a hint ladder (3 levels) for this calculus problem before the full solution.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Exam Prep",
        category: "Education",
        assistantId: "asst_cxxemAOirHzo7JCNn4CsGw2R",
        question: "{\"Q1\":\"Make a last-week plan and exam-day checklist with anxiety reset steps.\",\"Q2\":\"Create a timed mock kit for [section], with pacing checkpoints, debrief, and error log.\",\"Q3\":\"Turn these notes into 20 recall questions with spaced review dates: [paste notes].\",\"Q4\":\"Build a 4-week plan for [exam] on [date], 8 hrs/week, focus on [weak topics].\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Essay & Citation Helper",
        category: "Education",
        assistantId: "asst_iAIcAm5Z86XFuvB4nLeEjKWl",
        question: "{\"Q1\":\"Run a reverse outline and style pass on this draft; list 5 concrete edits.\",\"Q2\":\"Format these sources in MLA Works Cited and show matching in-text citations.\",\"Q3\":\"Turn these notes into 2 PEEL paragraphs with quotes and APA in-text citations.\",\"Q4\":\"Decode this prompt and propose 3 thesis options with a brief outline.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Debate & Argument Coach",
        category: "Education",
        assistantId: "asst_ALY0e9a1hhL9qrkGEv3CNbHN",
        question: "{\"Q1\":\"Crystallize into two voters for summary/final focus with concise extensions.\",\"Q2\":\"Build a CX funnel to test their causal link between ad exposure and voter manipulation.\",\"Q3\":\"Steelman the opponent’s privacy argument, then give me a 30-second rebuttal and a weighing line.\",\"Q4\":\"Write an affirmative case for “This House would ban targeted political ads” for Public Forum, with two contentions and weighing.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Quiz & Trivia Master",
        category: "Entertainment",
        assistantId: "asst_tShh82XKM56MXl6RelrMfKj2",
        question: "{\"Q1\":\"Run item analysis on last night’s quiz results and flag items to revise or retire.\",\"Q2\":\"Improve these stems by removing clueing and writing stronger distractors: [paste items].\",\"Q3\":\"Create a 10-question science quiz (MCQ + short answer), Bloom-tagged and mixed difficulty.\",\"Q4\":\"Build a 12-question pub-trivia round (mixed categories), 20s per question, with a numeric tie-breaker.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Book & Movie Recommender",
        category: "Entertainment",
        assistantId: "asst_oVybPuGgqSiN3X9r3Q6B7S7S",
        question: "{\"Q1\":\"Family movie night: PG or equivalent, ≤100 min, upbeat ending; include content notes, 1 classic and 1 recent title, plus streaming availability if known.\",\"Q2\":\"Cozy mystery books 280–350 pages with found-family vibe; exclude graphic violence; give 5 picks with one-line reasons and 1 novella option.\",\"Q3\":\"Watch-alikes: I loved “Interstellar” for quiet, emotional sci-fi—recommend 7 films ≤140 min with age ratings, 1 stretch pick, and brief “why this fits.”\",\"Q4\":\"Build my taste profile: favorites “Arrival” and “The Night Circus”; dislikes grimdark and jump scares; prefer slow-burn, hopeful tone; 50% discovery.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Gaming Strategy Assistant",
        category: "Entertainment",
        assistantId: "asst_RgMtliRiLwdw7HxnFtRsy7rN",
        question: "{\"Q1\":\"Make a map plan for [map/mode]: default setups, executes/retakes, rotates, and utility/vision routes.\",\"Q2\":\"I have 5 hours/week. Create a practice plan with aim/combo drills and one scrim block.\",\"Q3\":\"Here’s a VOD: [link]. Time-stamp key mistakes and give “better lines,” top 3 fixes, and drills.\",\"Q4\":\"Build my playbook for [game], [role], [rank]; give macro rules, power spikes, and 3 KPIs.\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Parenting Assistant",
        category: "Family",
        assistantId: "asst_po4nAKk6jf2koMArk4nf7e4X",
        question: "{\"Q1\":\"Age playbook for a 4-year-old: common challenges, tantrum plan, transition scripts, and a 5-step bedtime routine with visuals.\",\"Q2\":\"Behavior plan for homework refusal (age 8): ABC analysis, replacement skills, reinforcement menu, and a consequence ladder with sample scripts.\",\"Q3\":\"Screen/media plan for preteens: weekday/weekend limits, device-free zones, curfew, co-view prompts, and a simple family agreement.\",\"Q4\":\"Sibling conflict toolkit (ages 6 and 9): 3 problem-solving scripts, a trade-timer routine, and how to reinforce first attempts to solve it themselves.\",\"Q5\":\"Teacher meeting prep (age 10): short note template, meeting agenda, accommodations to discuss (non-medical), and a follow-up plan.\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Fitness Coach",
        category: "Lifestyle",
        assistantId: "asst_K7oQfvJ7umdBeiJJdssXOWej",
        question: "{\"Q1\":\"Build my plan: 3 days/week, home dumbbells, goal = lose fat + keep muscle; include RIR, warm-ups, and a 10-minute finisher.\",\"Q2\":\"Form check: Dumbbell RDL, list 5 common mistakes, 3 cues, and one drill to fix my hinge.\",\"Q3\":\"20-min hotel workout: no equipment, low impact, scale for knee-friendly options.\",\"Q4\":\"Run-walk 5K in 10 weeks: week-by-week schedule with warm-ups, paces by effort, and one cross-training day.\",\"Q5\":\"Nutrition basics: plate-method ideas for 3 quick, protein-forward weekday dinners; no supplements.\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Budget & Expense Tracker",
        category: "Lifestyle",
        assistantId: "asst_2xVCbjyo7sulf0Xqq4S46tjH",
        question: "{\"Q1\":\"Build my budget: monthly vs paycheck plan; recommend 50/30/20, zero-based, or envelopes and set targets.\",\"Q2\":\"Categorize my last 90 days: propose 15 clean categories, 10 auto-rules, and splits for mixed transactions.\",\"Q3\":\"Cash-flow calendar: map paydays and bills for the next 60 days; flag risk days and fixes.\",\"Q4\":\"Quick start: Build my plan for [goal] with [time/tools/level]; include [deliverables].\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Personal Stylist",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Habit Tracker",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Gift Finder",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Pet Care Advisor",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Meal Planner",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Travel Planner",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Home Improvement Planner",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Real Estate Assistant",
        category: "Lifestyle",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Task Planner Assistant",
        category: "Productivity",
        assistantId: "asst_ckaA5BHLvcw1d1pgFbLETsdg",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Email Drafting Assistant",
        category: "Productivity",
        assistantId: "asst_NOVwcezV8H2V49B0YFawSAQ6",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Meeting & Notes Assistant",
        category: "Productivity",
        assistantId: "asst_jbhOWnwzQsB0DG6hI6lwSpCg",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Project Manager Assistant",
        category: "Productivity",
        assistantId: "asst_TSTqLhXPs3KmLsxypnPVCLvu",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Document Analyzer",
        category: "Research",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Code Helper & Debugger",
        category: "Tech / Developer",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Tech Troubleshooter",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Shopping & Deals Finder",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Customer Service Writer",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Daily News Briefing",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Legal Doc Drafter (Basic)",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Event Planner",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Voice-to-Text Summarizer",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Contract & Agreement Reviewer",
        category: "Utility",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Wellness & Journal Coach",
        category: "Wellbeing",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Daily Reflection Bot",
        category: "Wellbeing",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Relationship Advice Bot",
        category: "Wellbeing",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Free",
        nameAssistant: "Mindfulness & Meditation Guide",
        category: "Wellbeing",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "Health Symptom Checker (Basic)",
        category: "Wellbeing",
        assistantId: "",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      },
      {
        isLatestFeatures: 0,
        isMostFavorite: 0,
        tier: "Pro",
        nameAssistant: "AI Assistants Creator",
        category: "Tech / Developer",
        assistantId: "asst_lfdp2xHha3qy2HNb5h2L7sFS",
        question: "{\"Q1\":\"\",\"Q2\":\"\",\"Q3\":\"\",\"Q4\":\"\",\"Q5\":\"\"}"
      }
    ]
    await queryInterface.bulkInsert('assistant', assiArr, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE assistant');
  }

};

