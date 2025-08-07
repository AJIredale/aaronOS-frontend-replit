import { create } from "zustand";

interface QuoteState {
  quotedText: string;
  quotedMessageId: string;
  isQuoting: boolean;
  setQuote: (text: string, messageId: string) => void;
  clearQuote: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  quotedText: "",
  quotedMessageId: "",
  isQuoting: false,
  setQuote: (text: string, messageId: string) =>
    set(() => ({
      quotedText: text,
      quotedMessageId: messageId,
      isQuoting: true,
    })),
  clearQuote: () =>
    set(() => ({
      quotedText: "",
      quotedMessageId: "",
      isQuoting: false,
    })),
}));