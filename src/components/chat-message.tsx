'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { type Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  if (message.id === 'typing') {
    return (
      <div className="flex items-end gap-2 animate-in fade-in">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="rounded-lg p-3 bg-muted text-muted-foreground">
          <div className="flex gap-1.5 items-center justify-center h-5">
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'rounded-lg p-3 text-sm max-w-[80%]',
          isAssistant
            ? 'bg-muted text-muted-foreground rounded-tl-none'
            : 'bg-primary text-primary-foreground rounded-tr-none'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {!isAssistant && (
         <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className='bg-primary text-primary-foreground'>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
