/**
 * Activepieces Code Piece: Social Media Formatting Firewall & Idempotency Engine
 * Author: AppSolve Central
 * Purpose: Enforces strict 280-character Twitter limits, formats LinkedIn markdown, and generates SHA-256 idempotency hash.
 */

import { createHash } from 'crypto';

interface RawRepurposerInputs {
  source_title: string;
  source_url: string;
  raw_twitter_thread: string | string[];
  raw_linkedin_post: string;
  raw_newsletter_digest: string;
}

interface NormalizedRepurposerOutput {
  content_hash: string;
  source_title: string;
  source_url: string;
  twitter_thread: string[];
  twitter_thread_count: number;
  linkedin_post: string;
  newsletter_digest: string;
  validation_status: 'PASSED' | 'TRUNCATED_AND_PASSED';
  processed_at: string;
}

function splitTweetAtSentence(text: string, maxLength = 260): string[] {
  if (text.length <= maxLength) return [text.trim()];

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).trim().length <= maxLength) {
      currentChunk = (currentChunk + ' ' + sentence).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (sentence.length > maxLength) {
        // Fallback word split if single sentence exceeds limit
        const words = sentence.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).trim().length <= maxLength) {
            wordChunk = (wordChunk + ' ' + w).trim();
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = w;
          }
        }
        currentChunk = wordChunk;
      } else {
        currentChunk = sentence.trim();
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

export const code = async (inputs: { raw: RawRepurposerInputs }): Promise<NormalizedRepurposerOutput> => {
  const raw = inputs.raw || {};
  const title = (raw.source_title || 'Untitled Source').trim();
  const url = (raw.source_url || 'https://youtube.com').trim();

  // 1. Generate Deterministic SHA-256 Idempotency Hash (prevents duplicate runs on RSS re-polls)
  const hashKey = `${title.toLowerCase()}|${url.toLowerCase()}`;
  const content_hash = 'HASH_' + createHash('sha256').update(hashKey).digest('hex').substring(0, 16).toUpperCase();

  // 2. Parse & Validate Twitter Thread Array
  let threadArray: string[] = [];
  let wasTruncated = false;

  if (Array.isArray(raw.raw_twitter_thread)) {
    threadArray = raw.raw_twitter_thread.map(t => String(t).trim());
  } else if (typeof raw.raw_twitter_thread === 'string') {
    try {
      const parsed = JSON.parse(raw.raw_twitter_thread);
      if (Array.isArray(parsed)) {
        threadArray = parsed.map(t => String(t).trim());
      } else {
        threadArray = [raw.raw_twitter_thread.trim()];
      }
    } catch {
      threadArray = raw.raw_twitter_thread.split(/\n\n+/).map(t => t.trim());
    }
  }

  // Enforce 280-char strict limit (target 260 for numbering buffer)
  const sanitizedThread: string[] = [];
  for (const tweet of threadArray) {
    if (tweet.length > 275) {
      wasTruncated = true;
      const chunks = splitTweetAtSentence(tweet, 260);
      sanitizedThread.push(...chunks);
    } else {
      sanitizedThread.push(tweet);
    }
  }

  // Append thread numbering: e.g. "1/8 ...", "2/8 ..."
  const totalTweets = sanitizedThread.length;
  const numberedThread = sanitizedThread.map((tweet, idx) => {
    const prefix = `${idx + 1}/${totalTweets} `;
    return tweet.startsWith(`${idx + 1}/`) ? tweet : prefix + tweet;
  });

  // 3. Normalize LinkedIn Post Formatting
  let linkedin = (raw.raw_linkedin_post || '').trim();
  // Ensure double line breaks between paragraphs for readability
  linkedin = linkedin.replace(/\r\n/g, '\n').replace(/\n(3,)/g, '\n\n');

  // 4. Normalize Newsletter Digest
  const newsletter = (raw.raw_newsletter_digest || '').trim();

  return {
    content_hash,
    source_title: title,
    source_url: url,
    twitter_thread: numberedThread,
    twitter_thread_count: totalTweets,
    linkedin_post: linkedin,
    newsletter_digest: newsletter,
    validation_status: wasTruncated ? 'TRUNCATED_AND_PASSED' : 'PASSED',
    processed_at: new Date().toISOString()
  };
};
