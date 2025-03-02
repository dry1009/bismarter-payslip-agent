
import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionTopic {
  title: string;
  suggestions: string[];
}

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onSuggestionClick }) => {
  // Topics with suggestions in Hebrew
  const topics: SuggestionTopic[] = [
    {
      title: "תלוש השכר שלי",
      suggestions: [
        "מה המשמעות של ניכויים בתלוש?",
        "איך מחושבות שעות נוספות?",
        "האם התשלום על חופשה שלי תקין?"
      ]
    },
    {
      title: "זכויות עובדים",
      suggestions: [
        "כמה ימי חופשה מגיעים לי בשנה?",
        "מהן הזכויות שלי לגבי דמי הבראה?",
        "איך מחושבים דמי מחלה?"
      ]
    },
    {
      title: "תהליכים וטפסים",
      suggestions: [
        "איך אני מגיש בקשה לשעות נוספות?",
        "איך אוכל לעדכן את פרטי חשבון הבנק שלי?",
        "אילו טפסים נדרשים להחזר הוצאות?"
      ]
    }
  ];

  return (
    <div className="flex flex-col space-y-4 w-full max-w-3xl mx-auto p-4 animate-fade-in">
      {topics.map((topic, topicIndex) => (
        <div key={topicIndex} className="w-full">
          <h3 className="text-md font-medium mb-2 text-gray-700">{topic.title}</h3>
          <div className="grid grid-cols-1 gap-2">
            {topic.suggestions.map((suggestion, suggestionIndex) => (
              <Button
                key={suggestionIndex}
                variant="outline"
                className="justify-start text-right h-auto py-3 px-4 whitespace-normal border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSuggestions;
