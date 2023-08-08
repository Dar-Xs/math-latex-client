import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (
    body.key !== process.env.AccessKey ||
    !body.question ||
    !body.hint ||
    !body.answer
  ) {
    return NextResponse.json({
      success: false,
      message: 'Invalid input',
      data: {},
    });
  }

  const myHeaders = new Headers();
  myHeaders.append('Cache-Control', 'no-store');
  myHeaders.append(
    'Authorization',
    `Bearer ${process.env.OPENAI_API_KEY}`,
  );
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    messages: [
      {
        role: 'system',
        content:
          'You are a math teacher and you are checking student solutions to a problem titled:\n' +
          body.question +
          'The answer analysis that comes with the question is:\n' +
          body.hint +
          'Now the student will start to try to answer the question; If it is wrong, please tell him where the wrong point is, how to write the correct content, what knowledge points are involved, and tell him in detail; if it is correct, please tell him what to do next, what knowledge points are involved, how the thinking is, correct How to do the practice, and specifically talk about what the knowledge points look like. The language he uses is Chinese, please use the same language to respond.',
      },
      {
        role: 'user',
        content: body.answer,
      },
    ],
    stream: true,
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    presence_penalty: 0,
    frequency_penalty: 0,
    top_p: 1,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  fetch('https://api.openai.com/v1/chat/completions', requestOptions)
    .then((response: any) => {
      const newHeaders = new Headers(response.headers);
      newHeaders.delete('www-authenticate');
      // to disable nginx buffering
      newHeaders.set('X-Accel-Buffering', 'no');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    })
    .catch((error: any) => {
      console.log(error);
      return NextResponse.json({
        success: false,
        message: error.message,
        data: {},
      });
    });
}

// export const runtime = 'edge';
export const config = {
  runtime: 'edge',
};
