
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
            content: `Analyze the sentiment and tone of the following text. 
            Be detailed and specific about the emotions detected, and specify whether the overall sentiment is positive, negative, or neutral.
            Provide a confidence score from 0-100 for your analysis.
            Also, highlight any parts that might be confusing or ambiguous for neurodiverse individuals.
            Format the response as JSON with the following structure:
            {
              "sentiment": "positive|negative|neutral",
              "confidence": number from 0-100,
              "emotions": ["emotion1", "emotion2", ...],
              "analysis": "detailed explanation",
              "potentially_confusing_elements": ["element1", "element2", ...]
            }
            
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
          return new Response(
            JSON.stringify(parsedResult),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (innerError) {
          console.error('JSON parsing error:', innerError);
          
          // Try to clean the JSON string by escaping quotes in text fields
          let jsonStr = jsonMatch[0];
          
          // Create a manually constructed object as fallback
          const fallbackResult = {
            sentiment: content.includes('"sentiment": "positive"') ? "positive" : 
                      content.includes('"sentiment": "negative"') ? "negative" : "neutral",
            confidence: parseInt(content.match(/"confidence": (\d+)/)?.[1] || "50"),
            emotions: [],
            analysis: content,
            potentially_confusing_elements: []
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
          potentially_confusing_elements: []
        };
        
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
          potentially_confusing_elements: []
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
        potentially_confusing_elements: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
