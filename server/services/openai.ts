import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface MeditationGenerationParams {
  type: string;
  duration: number;
  customization?: {
    goals?: string;
    timeline?: string;
    category?: string;
    currentSituation?: string;
  };
  userPreferences?: any;
}

export async function generateMeditationScript(params: MeditationGenerationParams): Promise<string> {
  const { type, duration, customization, userPreferences } = params;
  
  let prompt = `Create a ${duration}-minute ${type} meditation script.
  
Structure the meditation with:
1. Opening/grounding (1-2 minutes)
2. Main practice (${duration - 3} minutes)
3. Closing/integration (1-2 minutes)

Use calming language, include proper pacing markers [PAUSE 3], [BREATHE], and natural transitions.
Write in second person (you) and present tense.
Include specific timing guidance for the narrator.
Make the language gentle, supportive, and encouraging.
`;

  // Add type-specific guidance
  switch (type) {
    case 'manifestation':
      prompt += `
Focus on manifestation techniques:
- Visualization of goals being achieved
- Positive affirmations about success
- Feeling emotions of already having what you desire
- Clear mental imagery of the desired outcome
${customization?.goals ? `- Specific focus on: ${customization.goals}` : ''}
${customization?.timeline ? `- Timeline context: ${customization.timeline}` : ''}
${customization?.category ? `- Category: ${customization.category}` : ''}
      `;
      break;
    
    case 'relaxation':
      prompt += `
Focus on relaxation techniques:
- Progressive muscle relaxation
- Deep breathing exercises
- Release of tension and stress
- Calming imagery of peaceful places
- Body scan for complete relaxation
      `;
      break;
    
    case 'sleep':
      prompt += `
Focus on sleep preparation:
- Gentle body relaxation from head to toe
- Slow, rhythmic breathing patterns
- Peaceful, dreamy imagery
- Letting go of the day's concerns
- Transition to restful sleep
      `;
      break;
    
    case 'visualization':
      prompt += `
Focus on guided imagery:
- Vivid sensory descriptions
- Engaging all five senses
- Journey through beautiful, peaceful environments
- Clear, detailed visual scenes
- Immersive experience
      `;
      break;
    
    case 'affirmations':
      prompt += `
Focus on positive affirmations:
- Self-empowering statements
- Building confidence and self-worth
- Reinforcing positive beliefs
- Personal strength and capability
- Overcoming limiting beliefs
      `;
      break;
    
    case 'mindfulness':
      prompt += `
Focus on present moment awareness:
- Attention to breath and body sensations
- Observing thoughts without judgment
- Awareness of the present moment
- Gentle return to focus when mind wanders
- Cultivation of inner peace
      `;
      break;
  }

  prompt += `

Please respond with ONLY the meditation script text, no additional formatting or explanations.
The script should be natural and flowing, suitable for text-to-speech conversion.
Include pause markers like [PAUSE 3] for 3-second pauses, [BREATHE] for breathing cues.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert meditation guide who creates personalized, calming meditation scripts. Your scripts are gentle, supportive, and designed to help people find inner peace and achieve their goals."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const script = response.choices[0].message.content;
    if (!script) {
      throw new Error("No script generated from OpenAI");
    }

    return script;
  } catch (error) {
    console.error("OpenAI generation error:", error);
    throw new Error(`Failed to generate meditation script: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
