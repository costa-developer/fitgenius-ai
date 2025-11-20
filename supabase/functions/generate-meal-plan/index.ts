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
    const { gender, age, weight, goal, diet_preference } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build prompt based on user data
    const systemPrompt = `You are a certified nutritionist creating personalized meal plans. Generate a complete day of meals with accurate macros. Return ONLY valid JSON with this exact structure:
{
  "meals": [
    {
      "name": "meal name",
      "meal_type": "breakfast|lunch|dinner|snack",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "ingredients": ["ingredient1", "ingredient2", ...]
    }
  ]
}`;

    const dietInfo = diet_preference !== "none" 
      ? `Must be ${diet_preference} compatible.` 
      : "";

    const userPrompt = `Create a daily meal plan for:
- Gender: ${gender}
- Age: ${age}
- Weight: ${weight}kg
- Goal: ${goal.replace("_", " ")}
- Diet: ${diet_preference}

${dietInfo}

Generate 3 main meals (breakfast, lunch, dinner) and 1-2 snacks. Include accurate calorie and macro calculations for each meal. List all ingredients.`;

    console.log("Calling Lovable AI for meal plan generation...");

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

    const mealData = JSON.parse(
      aiResponse.choices[0].message.content
    );

    return new Response(JSON.stringify(mealData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-meal-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
