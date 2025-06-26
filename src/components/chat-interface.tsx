'use client';

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  Briefcase,
  Code2,
  GraduationCap,
  Heart,
  SendHorizontal,
} from 'lucide-react';
import { provideTechGuidance } from '@/ai/flows/provide-tech-guidance';
import { offerPersonalSupport } from '@/ai/flows/offer-personal-support';
import { type Message } from '@/lib/types';
import { ChatMessage } from '@/components/chat-message';
import { useToast } from '@/hooks/use-toast';

type SupportTopic = 'tech' | 'career' | 'college' | 'personal growth';

export default function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Dei Gugan! Naan un AI Macha. Enna venum, kelu macha! Tech doubt ah, personal advice ah? Just type pannu 💪',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState<SupportTopic>('tech');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [topic]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea, not essential for core logic but good UX
    const textarea = e.target;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${scrollHeight}px`;
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
    }
    
    // Add typing indicator
    setMessages((prev) => [
      ...prev,
      { id: 'typing', role: 'assistant', content: '...', createdAt: new Date() },
    ]);

    try {
      let responseContent: string;
      if (topic === 'tech') {
        const response = await provideTechGuidance({ query: input });
        responseContent = response.response;
      } else {
        const response = await offerPersonalSupport({ topic, userBackground: input });
        responseContent = response.advice;
      }
      const assistantResponse: Message = {
        id: Date.now().toString() + 'a',
        role: 'assistant',
        content: responseContent,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev.slice(0, -1), assistantResponse]);
    } catch (error) {
      console.error('AI call failed:', error);
      const errorResponse: Message = {
        id: Date.now().toString() + 'e',
        role: 'assistant',
        content:
          'Macha, ennala ippo connect panna mudila. Network issue polirukku. Konjam neram kalichi try pannu da.',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorResponse]);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the request to the AI.",
      })
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-card shadow-2xl rounded-lg">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">Gugan's AI Macha</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b">
          <Tabs value={topic} onValueChange={(value) => setTopic(value as SupportTopic)}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-full">
              <TabsTrigger value="tech" className="flex-col sm:flex-row gap-2 h-12">
                <Code2 className="h-5 w-5" /> Tech
              </TabsTrigger>
              <TabsTrigger value="career" className="flex-col sm:flex-row gap-2 h-12">
                <Briefcase className="h-5 w-5" /> Career
              </TabsTrigger>
              <TabsTrigger value="college" className="flex-col sm:flex-row gap-2 h-12">
                <GraduationCap className="h-5 w-5" /> College
              </TabsTrigger>
              <TabsTrigger value="personal growth" className="flex-col sm:flex-row gap-2 h-12">
                <Heart className="h-5 w-5" /> Personal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t shrink-0 bg-background/50">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-2"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={`Ask about ${topic}...`}
              className="flex-1 resize-none max-h-48"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0"
              aria-label="Send message"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
