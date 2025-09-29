import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, answer } = await req.json()

    if (!user_id || !answer) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Verifying security answer for user:', user_id)

    // Get the user's security answer using service role (bypasses RLS)
    const { data: userAnswer, error: queryError } = await supabaseClient
      .from('user_security_answers')
      .select(`
        answer_hash,
        security_questions!inner(question)
      `)
      .eq('user_id', user_id)
      .limit(1)
      .single()

    if (queryError) {
      console.error('Error getting security answer:', queryError)
      return new Response(
        JSON.stringify({ error: 'Security answer not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userAnswer) {
      console.error('No security answer found for user')
      return new Response(
        JSON.stringify({ error: 'Security answer not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hash the provided answer and compare
    const hashedAnswer = btoa(answer.toLowerCase().trim())
    console.log('Expected hash:', userAnswer.answer_hash)
    console.log('Provided hash:', hashedAnswer)

    const isValid = userAnswer.answer_hash === hashedAnswer

    return new Response(
      JSON.stringify({ 
        isValid, 
        question: (userAnswer as any).security_questions?.question 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})