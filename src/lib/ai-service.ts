import { ChatMessage } from './data';
import { supabase } from '@/integrations/supabase/client';

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages },
  });

  if (error) {
    throw new Error(error.message || 'Failed to get AI response');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.reply || 'No response received.';
}
