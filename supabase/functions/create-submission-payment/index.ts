
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { openCallId, submissionData } = await req.json();

    // Check if this is user's first submission
    const { data: isFirstResult } = await supabaseClient
      .rpc('is_first_submission', { user_id: user.id });
    
    const isFirstSubmission = isFirstResult;
    const amount = isFirstSubmission ? 0 : 200; // $2.00 in cents

    if (amount === 0) {
      // Create free submission directly
      const { data: submission, error } = await supabaseClient
        .from('submissions')
        .insert({
          open_call_id: openCallId,
          artist_id: user.id,
          submission_data: submissionData,
          payment_status: 'free',
          payment_amount: 0,
          is_first_submission: true,
          submission_title: submissionData.title,
          submission_description: submissionData.description,
          artist_statement: submissionData.artistStatement
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        submissionId: submission.id,
        paymentRequired: false 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Stripe for paid submissions
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        openCallId,
        userId: user.id,
        submissionTitle: submissionData.title
      }
    });

    // Create pending submission
    const { data: submission, error } = await supabaseClient
      .from('submissions')
      .insert({
        open_call_id: openCallId,
        artist_id: user.id,
        submission_data: submissionData,
        payment_status: 'pending',
        payment_amount: amount,
        is_first_submission: false,
        stripe_payment_intent_id: paymentIntent.id,
        submission_title: submissionData.title,
        submission_description: submissionData.description,
        artist_statement: submissionData.artistStatement
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true,
      submissionId: submission.id,
      clientSecret: paymentIntent.client_secret,
      paymentRequired: true,
      amount: amount / 100
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
