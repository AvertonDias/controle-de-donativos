'use server';
/**
 * @fileOverview A Genkit flow for analyzing historical contribution data,
 * forecasting future totals, and identifying trends in congregation contributions.
 *
 * - smartProjectionTool - A function that initiates the projection and trend analysis.
 * - SmartProjectionToolInput - The input type for the smartProjectionTool function.
 * - SmartProjectionToolOutput - The return type for the smartProjectionTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema definition
const SmartProjectionToolInputSchema = z.object({
  historicalData: z.array(
    z.object({
      date: z.string().describe('Date of the contribution in YYYY-MM-DD format.'),
      worldwideWork: z.number().describe('Worldwide Work contribution for the day.'),
      congregation: z.number().describe('Congregation contribution for the day.'),
    })
  ).describe('An array of historical daily contribution records.'),
  projectionPeriod: z.string().optional().describe('The period for which to project totals, e.g., "next month", "next quarter". Defaults to "next month" if not specified.'),
});
export type SmartProjectionToolInput = z.infer<typeof SmartProjectionToolInputSchema>;

// Output schema definition
const SmartProjectionToolOutputSchema = z.object({
  forecasts: z.object({
    worldwideWork: z.number().describe('Projected total for Worldwide Work for the specified period.'),
    congregation: z.number().describe('Projected total for Congregation for the specified period.'),
    total: z.number().describe('Projected total for all contributions for the specified period.'),
  }).describe('Forecasted contribution totals for the specified period.'),
  trends: z.array(z.string()).describe('A list of observed trends and patterns in the historical contribution data.'),
});
export type SmartProjectionToolOutput = z.infer<typeof SmartProjectionToolOutputSchema>;

// Wrapper function to call the Genkit flow
export async function smartProjectionTool(
  input: SmartProjectionToolInput
): Promise<SmartProjectionToolOutput> {
  return smartProjectionToolFlow(input);
}

// Genkit Prompt definition
const smartProjectionToolPrompt = ai.definePrompt({
  name: 'smartProjectionToolPrompt',
  input: {schema: SmartProjectionToolInputSchema},
  output: {schema: SmartProjectionToolOutputSchema},
  prompt: `You are an expert financial analyst specializing in church ledger management.\nYour task is to analyze historical contribution data, forecast future totals, and identify trends.\n\nHere is the historical contribution data:\n\`\`\`json\n{{{json historicalData}}}\n\`\`\`\n\nBased on this data, please:\n1.  Forecast the 'worldwideWork', 'congregation', and 'total' contributions for the {{{projectionPeriod}}} (default to next month if not specified).\n2.  Identify and list any significant trends in the 'worldwideWork' and 'congregation' contributions. Focus on patterns, growth, decline, or seasonality.\n\nProvide your output strictly in the following JSON format. Ensure all fields in the output schema are present and correctly typed:\n`,
});

// Genkit Flow definition
const smartProjectionToolFlow = ai.defineFlow(
  {
    name: 'smartProjectionToolFlow',
    inputSchema: SmartProjectionToolInputSchema,
    outputSchema: SmartProjectionToolOutputSchema,
  },
  async (input) => {
    const { output } = await smartProjectionToolPrompt({
      ...input,
      // Provide a default for projectionPeriod if not present
      projectionPeriod: input.projectionPeriod || 'next month',
    });
    return output!; // The prompt output is guaranteed to conform to the schema
  }
);
