import OpenAI from 'openai';
import { env } from './env';
import type { Resume } from '@/types/resume.types';

const openai = new OpenAI({
  apiKey: env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made through a backend
});

interface GenerateCoverLetterParams {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  resume: Resume;
}

export async function generateCoverLetter({
  recipientName,
  recipientTitle,
  companyName,
  companyAddress,
  jobTitle,
  resume,
}: GenerateCoverLetterParams): Promise<string> {
  try {
    // Create a prompt that includes all relevant information
    const prompt = `Write a professional cover letter with the following details:

Sender Information:
- Name: ${resume.contactInfo.fullName}
- Email: ${resume.contactInfo.email}
- Phone: ${resume.contactInfo.phone}
- Location: ${resume.contactInfo.location}

Recipient Information:
- Name: ${recipientName}
- Title: ${recipientTitle}
- Company: ${companyName}
- Address: ${companyAddress}
- Job Title: ${jobTitle}

Work Experience:
${resume.workExperience
  .map(
    (exp) => `- ${exp.position} at ${exp.company} (${exp.startDate} to ${
      exp.current ? 'Present' : exp.endDate
    })
  ${exp.description.map((desc) => `  • ${desc}`).join('\n')}`
  )
  .join('\n')}

Education:
${resume.education
  .map(
    (edu) =>
      `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} to ${edu.endDate})`
  )
  .join('\n')}

Skills:
${resume.skills.map((skill) => `- ${skill.name} (${skill.level})`).join('\n')}

Please write a compelling cover letter that:
1. Uses a professional business letter format
2. Highlights relevant experience and skills for the ${jobTitle} position
3. Shows enthusiasm for working at ${companyName}
4. Demonstrates understanding of the company's needs
5. Includes a call to action in the closing paragraph
6. Maintains a professional yet personable tone
7. Is concise and focused (around 300-400 words)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional cover letter writer. Create compelling, personalized cover letters that highlight the candidate\'s relevant experience and qualifications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const coverLetterContent = completion.choices[0]?.message?.content;

    if (!coverLetterContent) {
      throw new Error('Failed to generate cover letter content');
    }

    return coverLetterContent;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error(
      'Failed to generate cover letter. Please check your API key and try again.'
    );
  }
}