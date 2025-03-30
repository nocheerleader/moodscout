
import { serve } from "https://deno.land/std/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to derive tone from emotions and sentiment if tone is missing
function deriveToneFromEmotions(emotions: string[], sentiment: string): string {
  // Map common emotions to tones
  const emotionToTone: Record<string, string> = {
    // Excited tone emotions
    'happy': 'excited', 
    'joy': 'excited',
    'enthusiasm': 'excited',
    'excitement': 'excited',
    'energetic': 'excited',
    'optimistic': 'excited',
    
    // Friendly tone emotions
    'grateful': 'friendly',
    'relief': 'friendly',
    'empathy': 'friendly',
    'compassion': 'friendly',
    'warmth': 'friendly',
    
    // Calm tone emotions
    'calm': 'calm',
    'peaceful': 'calm',
    'relaxed': 'calm',
    'thoughtful': 'calm',
    'serene': 'calm',
    'satisfied': 'calm',
    
    // Formal tone emotions
    'confident': 'formal',
    'serious': 'formal',
    'professional': 'formal',
    'determined': 'formal',
    
    // Negative emotions (often formal or calm)
    'frustrated': 'formal',
    'irritation': 'formal',
    'annoyance': 'formal',
    'disappointment': 'calm',
    'sadness': 'calm',
    'concern': 'calm',
    
    // Additional mappings for common negative emotions
    'anger': 'formal',
    'stress': 'formal',
    'anxiety': 'calm',
    'worry': 'calm',
    'rage': 'formal',
    'impatience': 'formal'
  };
  
  // Check if any emotions match our mapping
  for (const emotion of emotions) {
    const lowerEmotion = emotion.toLowerCase();
    if (emotionToTone[lowerEmotion]) {
      return emotionToTone[lowerEmotion];
    }
  }
  
  // Default based on sentiment
  if (sentiment === 'positive') {
    return 'friendly';
  } else if (sentiment === 'negative') {
    return 'formal';
  } else {
    return 'calm';
  }
}

// Function to extract tone from analysis text
function extractToneFromAnalysis(analysis: string): string | null {
  // Look for specific tone descriptions in the analysis
  const toneDescriptions = [
    { pattern: /tone is (friendly|warm|kind|casual|conversational)/i, tone: 'friendly' },
    { pattern: /tone is (formal|professional|serious|businesslike|assertive)/i, tone: 'formal' },
    { pattern: /tone is (excited|enthusiastic|energetic|passionate|upbeat)/i, tone: 'excited' },
    { pattern: /tone is (calm|peaceful|relaxed|soothing|tranquil)/i, tone: 'calm' },
    { pattern: /(friendly|warm|kind|casual|conversational) tone/i, tone: 'friendly' },
    { pattern: /(formal|professional|serious|businesslike|assertive) tone/i, tone: 'formal' },
    { pattern: /(excited|enthusiastic|energetic|passionate|upbeat) tone/i, tone: 'excited' },
    { pattern: /(calm|peaceful|relaxed|soothing|tranquil) tone/i, tone: 'calm' },
    { pattern: /tone is (aggressive|angry|impatient)/i, tone: 'formal' },
    { pattern: /tone is (sad|melancholic|depressed)/i, tone: 'calm' }
  ];
  
  for (const { pattern, tone } of toneDescriptions) {
    if (pattern.test(analysis)) {
      return tone;
    }
  }
  
  return null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Analyzing text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Analyze the sentiment, tone, and emotional content of the following text for neurodiverse users. 
    Be detailed and specific about the emotions detected, and specify whether the overall sentiment is positive, negative, or neutral.
    Provide a confidence score from 0-100 for your analysis.
    Also, highlight any parts that might be confusing or ambiguous for neurodiverse individuals. 
It is crucial for neurodiverse users to understand if potential underlying social cues, subtext, or possible misinterpretations (e.g., "This phrasing seems polite but could be interpreted as dismissive," or "The use of '...' might indicate unspoken thoughts or hesitation," or "This appears to be using sarcasm."). When creating your detailed explanation analysis this context is relevant to the user as they might miss these nuances.
    
    IMPORTANT: For the tone field in your JSON response, you MUST choose exactly one of these options: friendly, formal, excited, calm.
    
    Format the response EXACTLY as JSON with the following structure:
    {
      "sentiment": "positive|negative|neutral",
      "confidence": number from 0-100,
      "emotions": ["emotion1", "emotion2", ...],
      "tone": "friendly|formal|excited|calm",
      "analysis": "detailed explanation",
      "potentially_confusing_elements": ["element1", "element2", ...]
    }
    
    You MUST include the tone field with one of the specified values.
    
    Text to analyze: ${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Error from Anthropic API' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const responseData = await response.json();
    console.log('Response received from Anthropic');
    
    // Extract the content from Anthropic's response
    const content = responseData.content[0].text;
    console.log('Raw content:', content);
    
    try {
      // Find JSON object in the response using regex with a better approach
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        // Try to safely parse the extracted JSON
        try {
          const parsedResult = JSON.parse(jsonMatch[0]);
          
          // Ensure tone is present
          if (!parsedResult.tone) {
            // First try to extract tone from analysis text
            const extractedTone = extractToneFromAnalysis(parsedResult.analysis);
            if (extractedTone) {
              parsedResult.tone = extractedTone;
            } else {
              parsedResult.tone = deriveToneFromEmotions(parsedResult.emotions || [], parsedResult.sentiment);
            }
          }
          
          return new Response(
            JSON.stringify(parsedResult),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (innerError) {
          console.error('JSON parsing error:', innerError);
          
          // Create a manually constructed object as fallback
          const fallbackResult = {
            sentiment: content.includes('"sentiment": "positive"') ? "positive" : 
                      content.includes('"sentiment": "negative"') ? "negative" : "neutral",
            confidence: parseInt(content.match(/"confidence": (\d+)/)?.[1] || "50"),
            emotions: [],
            analysis: content,
            potentially_confusing_elements: [],
            tone: "formal" // Default tone
          };
          
          // Try to extract emotions array
          const emotionsMatch = content.match(/"emotions": \[(.*?)\]/);
          if (emotionsMatch) {
            try {
              fallbackResult.emotions = JSON.parse('[' + emotionsMatch[1] + ']');
            } catch (e) {
              // If parsing fails, try to extract strings manually
              const emotionItems = emotionsMatch[1].match(/"([^"]*)"/g);
              if (emotionItems) {
                fallbackResult.emotions = emotionItems.map(e => e.replace(/"/g, ''));
              }
            }
          }
          
          // Try to extract tone or derive it from emotions
          let tone = null;
          const toneMatch = content.match(/"tone":\s*"(friendly|formal|excited|calm)"/i);
          if (toneMatch && toneMatch[1]) {
            tone = toneMatch[1].toLowerCase();
          } else {
            // Try to extract from analysis text first
            tone = extractToneFromAnalysis(fallbackResult.analysis);
            if (!tone) {
              tone = deriveToneFromEmotions(fallbackResult.emotions, fallbackResult.sentiment);
            }
          }
          fallbackResult.tone = tone;
          
          return new Response(
            JSON.stringify(fallbackResult),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        // Fallback if no JSON structure found
        console.warn('No JSON structure found in Anthropic response, using fallback');
        const fallbackResult = {
          sentiment: "neutral",
          confidence: 50,
          emotions: [],
          analysis: content,
          potentially_confusing_elements: [],
          tone: "formal" // Default tone
        };
        
        // Try to extract tone or derive it from emotions
        let tone = null;
        const toneMatch = content.match(/"tone":\s*"(friendly|formal|excited|calm)"/i);
        if (toneMatch && toneMatch[1]) {
          tone = toneMatch[1].toLowerCase();
        } else {
          // Try to extract from analysis text first
          tone = extractToneFromAnalysis(content);
          if (!tone) {
            tone = deriveToneFromEmotions(fallbackResult.emotions, fallbackResult.sentiment);
          }
        }
        fallbackResult.tone = tone;
        
        return new Response(
          JSON.stringify(fallbackResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (parseError) {
      console.error('Error processing Anthropic response:', parseError);
      console.log('Raw content:', content);
      
      return new Response(
        JSON.stringify({
          error: 'Could not parse analysis results',
          sentiment: "neutral",
          confidence: 50,
          emotions: [],
          analysis: "We encountered an error analyzing your text. Please try again with different wording.",
          potentially_confusing_elements: [],
          tone: "formal"
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        sentiment: "neutral",
        confidence: 50,
        emotions: [],
        analysis: "An error occurred while processing your request. Please try again.",
        potentially_confusing_elements: [],
        tone: "formal"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
