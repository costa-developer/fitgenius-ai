import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gender, age, weight, goal } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build prompt based on user data
    const systemPrompt = `You are a certified fitness trainer creating personalized workout plans. Generate a complete workout with exercises that match the user's profile and goals. Return ONLY valid JSON with this exact structure:
{
  "name": "workout name",
  "difficulty": "beginner|intermediate|advanced",
  "duration_minutes": number,
  "total_calories": number,
  "exercises": [
    {
      "name": "exercise name",
      "sets": number,
      "reps": number,
      "rest_seconds": number
    }
  ]
}`;

    const userPrompt = `Create a personalized workout for:
- Gender: ${gender}
- Age: ${age}
- Weight: ${weight}kg
- Goal: ${goal.replace("_", " ")}

Generate 6-8 exercises appropriate for their fitness level. Include a mix of compound and isolation exercises.`;

    console.log("Calling Lovable AI for workout generation...");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    const workoutData = JSON.parse(
      aiResponse.choices[0].message.content
    );

    return new Response(JSON.stringify(workoutData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-workout:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
