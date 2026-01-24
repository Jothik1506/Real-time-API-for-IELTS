import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import fs from 'fs/promises';
import OpenAI from 'openai';

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

/**
 * Split text into chunks for embedding
 * @param {string} text - Text to chunk
 * @param {number} chunkSize - Target chunk size in characters (default: 1000)
 * @param {number} overlap - Overlap between chunks (default: 200)
 * @returns {Array<string>} Array of text chunks
 */
export function chunkText(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let startIndex = 0;

    // Clean and normalize text
    const cleanText = text
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
        .trim();

    while (startIndex < cleanText.length) {
        const endIndex = Math.min(startIndex + chunkSize, cleanText.length);
        let chunk = cleanText.slice(startIndex, endIndex);

        // Try to end at a sentence boundary
        if (endIndex < cleanText.length) {
            const lastPeriod = chunk.lastIndexOf('.');
            const lastNewline = chunk.lastIndexOf('\n');
            const breakPoint = Math.max(lastPeriod, lastNewline);

            if (breakPoint > chunkSize * 0.5) {
                chunk = chunk.slice(0, breakPoint + 1);
                startIndex += breakPoint + 1;
            } else {
                startIndex += chunkSize - overlap;
            }
        } else {
            startIndex = cleanText.length;
        }

        if (chunk.trim().length > 0) {
            chunks.push(chunk.trim());
        }
    }

    return chunks;
}

/**
 * Generate embeddings for text chunks using OpenAI
 * @param {Array<string>} chunks - Text chunks to embed
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Array<Array<number>>>} Array of embeddings
 */
export async function generateEmbeddings(chunks, apiKey) {
    if (!apiKey) {
        throw new Error('API Key required for generating embeddings');
    }

    const openai = new OpenAI({ apiKey });

    try {
        const embeddings = [];

        // Process in batches to avoid rate limits
        const batchSize = 20;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: batch,
            });

            const batchEmbeddings = response.data.map(item => item.embedding);
            embeddings.push(...batchEmbeddings);

            console.log(`Generated embeddings for chunks ${i + 1}-${Math.min(i + batchSize, chunks.length)} of ${chunks.length}`);
        }

        return embeddings;
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw new Error('Failed to generate embeddings');
    }
}

/**
 * Process PDF file: extract text, chunk, and generate embeddings
 * @param {string} filePath - Path to PDF file
 * @param {string} fileName - Original file name
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} Processed document data
 */
export async function processPDF(filePath, fileName, apiKey) {
    try {
        console.log(`Processing PDF: ${fileName}`);

        // Extract text
        const text = await extractTextFromPDF(filePath);
        console.log(`Extracted ${text.length} characters from PDF`);

        // Chunk text
        const chunks = chunkText(text);
        console.log(`Split into ${chunks.length} chunks`);

        // Generate embeddings
        const embeddings = await generateEmbeddings(chunks, apiKey);
        console.log(`Generated ${embeddings.length} embeddings`);

        return {
            fileName,
            filePath,
            text,
            chunks,
            embeddings,
            processedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
}
