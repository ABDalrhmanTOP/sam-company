import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface Faq {
  id: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category?: string;
  is_active: boolean | number;
  order: number;
}

interface DynamicFaqsProps {
  language: string;
  category?: string;
  limit?: number;
}

export function DynamicFaqs({ language, category, limit }: DynamicFaqsProps) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/faqs`);
        const allFaqs = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // Filter by active status
        let filteredFaqs = allFaqs.filter((faq: Faq) => {
          const isActive = faq.is_active === true || (typeof faq.is_active === 'number' && faq.is_active === 1);
          return isActive;
        });

        // Filter by category if provided
        if (category) {
          filteredFaqs = filteredFaqs.filter((faq: Faq) => faq.category === category);
        }

        // Sort by order
        filteredFaqs.sort((a: Faq, b: Faq) => (a.order || 0) - (b.order || 0));

        // Apply limit if provided
        if (limit) {
          filteredFaqs = filteredFaqs.slice(0, limit);
        }

        setFaqs(filteredFaqs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-2"></div>
            <div className="h-20 bg-muted/50 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{language === 'ar' ? 'لا توجد أسئلة متاحة حالياً' : 'No FAQs available at the moment'}</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faqs.map((faq) => {
        const question = language === 'ar' ? faq.question_ar : faq.question_en;
        const answer = language === 'ar' ? faq.answer_ar : faq.answer_en;

        return (
          <AccordionItem 
            key={faq.id} 
            value={`item-${faq.id}`}
            className="border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-start gap-4 w-full text-left">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold text-lg">{question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              <div className="pl-12 text-muted-foreground leading-relaxed">
                {answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
