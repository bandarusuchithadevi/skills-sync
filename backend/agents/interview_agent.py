from typing import List, Dict, Any
from backend.models.schemas import InterviewQuestion, InterviewFeedbackResponse

class InterviewAgent:
    """Agent 8: Interview Preparation Agent generating interactive questions and evaluating user responses."""

    @classmethod
    def generate_questions(
        cls,
        job_title: str,
        matched_skills: List[str],
        projects: List[str]
    ) -> List[InterviewQuestion]:
        top_skill = matched_skills[0] if matched_skills else "Python"
        second_skill = matched_skills[1] if len(matched_skills) > 1 else "SQL"
        top_proj = projects[0] if projects else "Data Analysis Project"

        return [
            InterviewQuestion(
                id="iq_1",
                category="Technical",
                question=f"Can you explain your core experience using {top_skill} in real-world applications?",
                context=f"Target role ({job_title}) heavily requires strong {top_skill} proficiency.",
                sample_answer_tips=f"Focus on practical project examples where you used {top_skill}. Highlight libraries used, challenges solved, and clean code principles.",
                difficulty="Medium"
            ),
            InterviewQuestion(
                id="iq_2",
                category="Project",
                question=f"Tell me about your experience with '{top_proj}'. What was your specific technical contribution?",
                context="Recruiters test if candidates truly understand their listed projects.",
                sample_answer_tips="Use the STAR method (Situation, Task, Action, Result). State your exact role, technologies used, and final result.",
                difficulty="Medium"
            ),
            InterviewQuestion(
                id="iq_3",
                category="Resume",
                question=f"How did you use {second_skill} in your recent work or academic projects?",
                context="Validates resume evidence listed in your technical skills section.",
                sample_answer_tips=f"Mention database queries written, schema design, or API integration involving {second_skill}.",
                difficulty="Easy"
            ),
            InterviewQuestion(
                id="iq_4",
                category="JD",
                question=f"How would you approach the responsibilities outlined in this {job_title} role during your first 30 days?",
                context="Evaluates role alignment and initiative.",
                sample_answer_tips="Break down into 3 phases: 1) Onboarding & codebase learning, 2) First minor feature/bug fix, 3) Full sprint delivery.",
                difficulty="Hard"
            ),
            InterviewQuestion(
                id="iq_5",
                category="HR",
                question="Describe a complex technical challenge you faced during a project and how you resolved it.",
                context="Assesses problem-solving mindset and perseverance.",
                sample_answer_tips="Describe a bug or performance bottleneck, how you debugged it step-by-step, and what you learned.",
                difficulty="Medium"
            )
        ]

    @classmethod
    def evaluate_answer(cls, question: str, user_answer: str) -> InterviewFeedbackResponse:
        ans_len = len(user_answer.strip().split())
        
        if ans_len < 10:
            return InterviewFeedbackResponse(
                rating="Needs Improvement",
                feedback="Your response is too brief. Interviewers expect detailed examples using technical context.",
                strengths=["Started addressing the topic."],
                improvement_tips=[
                    "Use the STAR method (Situation, Task, Action, Result).",
                    "Mention specific tools, libraries, and measurable outcomes."
                ],
                suggested_rewrite=f"In response to '{question}', elaborate on your specific technical actions and concrete results achieved."
            )
        
        return InterviewFeedbackResponse(
            rating="Excellent",
            feedback="Strong, articulate answer with technical context and clear structure!",
            strengths=[
                "Good technical detail and terminology",
                "Clear structure and direct response to the interviewer's prompt"
            ],
            improvement_tips=[
                "Mention a metric or quantifiable outcome to make your answer even more compelling."
            ],
            suggested_rewrite=user_answer + " This experience strengthened my engineering approach."
        )
