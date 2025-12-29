import type { ActionFunctionArgs } from 'react-router'
import OpenAI from 'openai'
import { data } from 'react-router'
import { getSystemPrompt } from '~/lib/knowledge-base'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 })
  }

  // Check multiple common environment variable names for the API key
  // eslint-disable-next-line node/prefer-global/process
  let apiKey = process.env.OPEN_AI_KEY

  if (!apiKey) {
    console.error('SERVER ERROR: OpenAI API Key is missing. Checked: OPEN_AI_KEY, OPENAI_API_KEY, VITE_OPEN_AI_KEY.')
    return data({ error: 'Server configuration error: Missing API Key' }, { status: 500 })
  }

  // Sanitize key: remove whitespace and potential wrapping quotes
  apiKey = apiKey.trim().replace(/^["']|["']$/g, '')

  // DIAGNOSTIC: Raw fetch to see if it's the library or the key
  // try {
  //   const rawResp = await fetch('https://api.openai.com/v1/models', {
  //     headers: {
  //       Authorization: `Bearer ${apiKey}`,
  //     },
  //   })

  //   const rawData = await rawResp.text()
  //   if (!rawResp.ok) {
  //     return data({
  //       error: 'Raw Fetch Auth Failed',
  //       status: rawResp.status,
  //       statusText: rawResp.statusText,
  //       body: rawData,
  //       keyLength: apiKey.length,
  //       keyPrefix: apiKey.substring(0, 7),
  //     }, { status: 401 })
  //   }
  // }
  // catch (fetchErr: any) {
  //   return data({
  //     error: 'Raw Fetch Network Error',
  //     details: fetchErr.message,
  //   }, { status: 500 })
  // }

  const openai = new OpenAI({ apiKey })

  try {
    const body = await request.json()
    const userMessage = body.message

    if (!userMessage) {
      return data({ error: 'Message is required' }, { status: 400 })
    }

    // Fetch the latest system prompt (from Blobs or default)
    let systemPrompt
    try {
      systemPrompt = await getSystemPrompt()
    }
    catch (kbError: any) {
      console.error('Knowledge Base Error:', kbError)
      return data({
        error: 'Knowledge Base Failure',
        details: kbError.message,
        source: 'Netlify Blobs',
      }, { status: 500 })
    }

    // Verify basic connectivity
    // try {
    //   await openai.models.list()
    // }
    // catch (modelError: any) {
    //   console.error('Model List Error:', modelError)
    //   return data({
    //     error: 'OpenAI Auth Check Failed',
    //     details: 'Could not list models. Key might be invalid or quota exceeded.',
    //     debug: {
    //       message: modelError.message,
    //       name: modelError.name,
    //       stack: modelError.stack, // Be careful exposing this in prod!
    //       type: modelError.type,
    //       code: modelError.code,
    //       param: modelError.param,
    //       fullString: String(modelError),
    //       raw: JSON.parse(JSON.stringify(modelError, Object.getOwnPropertyNames(modelError))),
    //     },
    //   }, { status: 401 })
    // }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t process your request at this time.'

    return data({ response: aiResponse })
  }
  catch (error: any) {
    console.error('OpenAI API Error:', error)
    // eslint-disable-next-line node/prefer-global/process
    const keyHint = process.env.OPEN_AI_KEY ? `${process.env.OPEN_AI_KEY.substring(0, 3)}...` : 'MISSING'

    return data({
      error: 'OpenAI API Failure',
      keyPrefix: keyHint,
      source: 'OpenAI',
      debug: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        type: error.type,
        code: error.code,
        param: error.param,
        fullString: String(error),
        raw: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
      },
    }, { status: 500 })
  }
}
