import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../../environments/environment';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  displayText?: string; // For typewriter effect
}

@Component({
  selector: 'app-ai-chat-assistant',
  templateUrl: './ai-chat-assistant.component.html',
  styleUrls: ['./ai-chat-assistant.component.scss'],
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(20px) scale(0.95)' 
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)' 
          })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            opacity: 0, 
            transform: 'translateY(10px) scale(0.95)' 
          })
        )
      ])
    ])
  ]
})
export class AiChatAssistantComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  // Configuration options
  private enableTypewriterEffect = true; // Set to false to disable typing animation
  
  // Chat state
  isChatOpen = false;
  isTyping = false;
  isOnline = true;
  hasUnreadMessage = false;
  
  // Messages and input
  messages: ChatMessage[] = [];
  currentMessage = '';
  errorMessage = '';
  
  // Quick suggestions for users
  quickSuggestions = [
    'রক্তদানের যোগ্যতা কী?',
    'কোন রক্তের গ্রুপ কার দিতে পারে?',
    'জরুরি রক্তের প্রয়োজন হলে কী করব?',
    'রক্তদানের উপকারিতা কী?'
  ];

  // AI Configuration
  private genAI!: GoogleGenerativeAI;
  private model: any;
  
  // System prompt for blood donation assistant in Bangladesh
  private readonly SYSTEM_PROMPT = `
  আপনি "রক্তসেবা AI সহায়ক" — বাংলাদেশের একটি রক্তদান সহায়তা প্ল্যাটফর্মের বুদ্ধিমান সহকারী।
  
  🎯 আপনার দায়িত্ব:
  ✅ রক্তদান সম্পর্কিত সঠিক ও নির্ভরযোগ্য তথ্য প্রদান।
  ✅ জরুরি রক্তপ্রয়োজনে দ্রুত ও কার্যকর দিকনির্দেশনা প্রদান।
  ✅ রক্তদানের প্রক্রিয়া, নিয়ম-কানুন এবং উপকারিতা সম্পর্কে তথ্য প্রদান।
  ✅ রক্তের গ্রুপ, মিল এবং সামঞ্জস্যতা ব্যাখ্যা করা।
  ✅ রক্তদান ক্যাম্প, প্ল্যাটফর্ম বা সেবা সম্পর্কিত তথ্য জানানো।
  ✅ রক্তদানের যোগ্যতা, প্রক্রিয়া ও উপকারিতা সম্পর্কে বিস্তারিত তথ্য প্রদান।
  


  
  🚫 আপনি যা করবেন না:
  ❌ চিকিৎসা পরামর্শ দেবেন না। প্রয়োজনে ব্যবহারকারীকে নিকটস্থ চিকিৎসকের কাছে যেতে বলুন।
  ❌ রক্তদান বিষয় ছাড়া অন্য কোনো বিষয়ে আলোচনা করবেন না।
  ❌ ইংরেজি ব্যবহার করবেন না — শুধুমাত্র **বাংলায়** উত্তর দিন।
  
  💬 উত্তরের ধরন:
  🗣️ ভাষা হবে ভদ্র, সম্মানজনক ও সহায়ক।
  📝 উত্তর হবে সংক্ষিপ্ত, সরাসরি এবং তথ্যবহুল।
  🏥 প্রয়োজনে স্থানীয় রক্তদান কেন্দ্রের সন্ধান দিন।
  ⚡ জরুরি অবস্থায় দ্রুত ও স্পষ্ট পদক্ষেপ জানিয়ে সহায়তা করুন।
  খুব সহজে আমাদের ওয়েবসাইট বেবহার করে রক্তের গ্রুপ বা লোকেশন সার্চ করে ডোনার পেয়ে যেতে পারেন । 
  ✅ রক্তদানের যোগ্যতা, প্রক্রিয়া ও উপকারিতা সম্পর্কে বিস্তারিত তথ্য দিন।
  ✅ রক্তদানের পরবর্তী সময়ে রক্তদানের যোগ্যতা সম্পর্কে তথ্য দিন।
  ✅ রক্ত রিলেটেড সকল প্রশ্নের উত্তর দিন।
  ✅ রক্তদানের সোসাল মিডিয়ায় টেমপ্লেট add করতে চাইলে এই টেমপ্লেট দিবেন, 
  🆘 জীবন-মরণ প্রশ্ন! জরুরি রক্তের প্রয়োজন 🩸
  🩺 রোগের ধরন: [যদি চান: থ্যালাসেমিয়া/সিজারিয়ান/অস্ত্রোপচার]
  🩸 রক্তের গ্রুপ: [A+/O-/B+ ইত্যাদি]
  📦 রক্তের পরিমাণ : [২ ইউনিট] রক্ত
  🧪 হিমোগ্লোবিন: [যদি জানেন, যেমন: 5.2 gm/dL]
  🏥 রক্ত দানের স্থান: [হাসপাতালের নাম, জেলা]
  📅 রক্ত দানের তারিখ : [তারিখ]
  ⏰ সময়: [যত দ্রুত সম্ভব]
  📞 যোগাযোগ: [নাম ও মোবাইল নম্বর]
  📌 রেফারেন্স : [নাম ও মোবাইল নম্বর]
  
  ❗ একজন মানুষ বাঁচাতে আপনার ১ ব্যাগ রক্তই যথেষ্ট হতে পারে।
  🤲 দয়া করে সাহায্যের হাত বাড়ান এবং পোস্টটি শেয়ার করুন।
  📢 আগ্রহীরা ইনবক্স করুন বা সরাসরি কল করুন।
  
  —
  🏷️ #রক্তসেবায়আমরাআছি #রক্তদাতা #মানবতা #জরুরীরক্তপ্রয়োজন #roktosebayamraachi #BloodDonation #DonateBloodSaveLife #রক্তদান #RoktoLagbe
  
  🎨 ফরম্যাটিং নির্দেশনা:
  📌 প্রতিটি বাক্য **পূর্ণচ্ছেদ (।)** দিয়ে শেষ করুন।
  📌 প্রতিটি বিষয়ের জন্য **শুধুমাত্র একটি উপযুক্ত ইমোজি** ব্যবহার করুন।
  📌 **গুরুত্বপূর্ণ** শব্দগুলোতে মাত্র একবার **বোল্ড** করুন — অপ্রয়োজনীয় * বা ** ব্যবহার করবেন না।
  📌 অপ্রয়োজনীয় **লাইন ব্রেক বা ফাঁকা স্পেসিং** পরিহার করুন।
  📌 **কমা (,) এর ব্যবহার সীমিত রাখুন**, এবং প্রতিটি বাক্য **পূর্ণচ্ছেদ (।)** দিয়ে শেষ করুন।
  📌 bullet point বা list format ব্যবহার করা যাবে।

  
  🧱 কাঠামোগত নির্দেশনা:
  ✅ প্রতিটি তথ্য **আলাদা বাক্যে** উপস্থাপন করুন।
  ✅ প্রত্যেক বাক্যের শুরুতেই **বিষয়** উল্লেখ করুন।
  ✅ তারপর বিষয়টির সম্পর্কে **সরাসরি তথ্য** প্রদান করুন।
  ✅ প্রতিটি বাক্যের শেষে **পূর্ণচ্ছেদ (।)** দিন।
  
  📌 সঠিক উদাহরণ:
  বয়স **১৮ থেকে ৬৫ বছর** হতে হবে। ওজন কমপক্ষে **৫২ কেজি** থাকতে হবে। রক্তদানের জন্য শারীরিকভাবে **সুস্থ** থাকা জরুরি। হিমোগ্লোবিনের মাত্রা **স্বাভাবিক** থাকা উচিত।
  
  ⚠️ ভুল উদাহরণ (এড়িয়ে চলুন):
  - একই emoji বারবার ব্যবহার করা যাবে না।
  - অতিরিক্ত **বা*** চিহ্ন ব্যবহার করা যাবে না।
  
  📢 অতিরিক্ত নির্দেশনা:
  যদি কেউ রক্তদান বিষয় ছাড়া অন্য কিছু জিজ্ঞেস করে, **বিনয়ের সাথে** বলুন:  
  "দুঃখিত, আমি শুধুমাত্র রক্তদান ও রক্তসেবা সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। আপনি যদি রক্তদানের বিষয়ে জানতে চান, তাহলে দয়া করে প্রশ্ন করুন।"
  `;
  

  constructor() {
    // Initialize Gemini AI using environment configuration
    // console.log('Environment API Key:', environment.geminiApiKey);
    // console.log('API Key length:', environment.geminiApiKey?.length);
    
    try {
      if (environment.geminiApiKey && 
          environment.geminiApiKey !== 'YOUR_GOOGLE_GEMINI_API_KEY' && 
          environment.geminiApiKey !== 'YOUR_PRODUCTION_GOOGLE_GEMINI_API_KEY') {
        
        // console.log('Initializing Gemini AI...');
        this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash-lite", // Changed from gemini-2.5-flash to gemini-pro
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });
        // console.log('Gemini AI initialized successfully');
        this.isOnline = true;
      } else {
        console.warn('Gemini API key not configured. AI chat will be disabled.');
        console.warn('Current API key:', environment.geminiApiKey);
        this.isOnline = false;
      }
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      this.isOnline = false;
    }
  }

  ngOnInit(): void {
    // Initialize chat but don't add welcome message immediately
    // It will be shown in the template
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Toggle chat window
  toggleChatWindow(): void {
    this.isChatOpen = !this.isChatOpen;
    this.hasUnreadMessage = false;
    
    if (this.isChatOpen) {
      // Focus input after animation
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
        this.scrollToBottom();
      }, 350);
    }
  }

  // Close chat window
  closeChatWindow(): void {
    this.isChatOpen = false;
    this.hasUnreadMessage = false;
  }

  // Send user message
  async sendUserMessage(): Promise<void> {
    if (!this.currentMessage.trim() || this.isTyping) return;
    
    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';
    this.clearError();
    
    // Add user message to chat
    this.addMessage(userMessage, true);
    
    // Send to AI
    await this.sendToAI(userMessage);
  }

  // Send message (from quick suggestions or user input)
  async sendMessage(message: string): Promise<void> {
    if (!message.trim() || this.isTyping) return;
    
    this.currentMessage = message;
    await this.sendUserMessage();
  }

  // Send message to AI
  private async sendToAI(userMessage: string): Promise<void> {
    if (!this.isOnline || !this.model) {
      // If in development and no API key, show a mock response
      if (!environment.production) {
        this.isTyping = true;
        setTimeout(() => {
          this.addMessage(
            `ধন্যবাদ আপনার প্রশ্নের জন্য: "${userMessage}"\n\n` +
            `দুঃখিত, AI সেবাটি বর্তমানে ডেভেলপমেন্ট মোডে রয়েছে। সঠিক Google Gemini API key configure করলে এটি কাজ করবে।\n\n` +
            `তবে আমি রক্তদান সম্পর্কে যেকোনো তথ্য দিতে প্রস্তুত! 🩸`,
            false
          );
          this.isTyping = false;
        }, 1500);
        return;
      }
      
      this.showError('AI সেবা বর্তমানে অনুপলব্ধ। পরে আবার চেষ্টা করুন।');
      return;
    }

    this.isTyping = true;
    
    try {
      // Create prompt with system instructions
      const fullPrompt = `${this.SYSTEM_PROMPT}\n\nব্যবহারকারীর প্রশ্ন: ${userMessage}\n\nউত্তর:`;

      // Send to Gemini AI
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const aiReply = response.text();

      // Add AI response
      const formattedReply = this.formatAIResponse(aiReply);
      this.addMessage(formattedReply, false);
      
      // Show unread indicator if chat is closed
      if (!this.isChatOpen) {
        this.hasUnreadMessage = true;
      }

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Add error message with more details in development
      let errorMessage = 'দুঃখিত, এই মুহূর্তে AI সেবায় সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন। জরুরি প্রয়োজনে সরাসরি আমাদের হটলাইনে যোগাযোগ করুন: 📞 16263';
      
      if (!environment.production) {
        errorMessage += `\n\nডেভেলপমেন্ট এরর: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
      
      this.addMessage(errorMessage, false);
    } finally {
      this.isTyping = false;
    }
  }

  // Add message to chat
  private addMessage(text: string, isUser: boolean): void {
    const message: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text,
      isUser: isUser,
      timestamp: new Date(),
      displayText: isUser ? text : '', // Start with empty display text for AI messages
      isTyping: !isUser && this.enableTypewriterEffect // AI messages start with typing effect only if enabled
    };
    this.messages.push(message);
    
    // Start typewriter effect for AI messages (if enabled)
    if (!isUser && this.enableTypewriterEffect) {
      this.startTypewriterEffect(message);
    } else if (!isUser) {
      // Show message immediately if typewriter is disabled
      message.displayText = text;
      message.isTyping = false;
    }
    
    // Auto-scroll after message is added
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Typewriter effect for AI messages
  private startTypewriterEffect(message: ChatMessage): void {
    const fullText = message.text;
    const typingSpeed = 15; // Faster: 15ms per character (was 30ms)
    let currentIndex = 1;
    
    // Clean text for smoother typing (remove HTML tags temporarily)
    const cleanText = fullText.replace(/<[^>]*>/g, '');
    
    const typeInterval = setInterval(() => {
      if (currentIndex < cleanText.length) {
        // Calculate how much of the original HTML text to show
        const progress = currentIndex / cleanText.length;
        const targetLength = Math.floor(fullText.length * progress);
        
        // Show portion of the original formatted text
        message.displayText = fullText.substring(0, targetLength);
        currentIndex += 2; // Skip 2 characters at a time for smoother effect
        
        // Smooth scroll
        requestAnimationFrame(() => this.scrollToBottom());
      } else {
        // Typing complete
        message.isTyping = false;
        message.displayText = fullText;
        clearInterval(typeInterval);
        this.scrollToBottom();
      }
    }, typingSpeed);
  }

  // Scroll to bottom of chat
  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer && this.isChatOpen) {
        const element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (error) {
      // Ignore scroll errors
    }
  }

  // Show error message
  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.clearError(), 5000);
  }

  // Clear error message
  clearError(): void {
    this.errorMessage = '';
  }

  // Track messages for ngFor performance
  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  // Format AI response for better display
  private formatAIResponse(text: string): string {
    let formattedText = text;

    // Clean up and normalize
    formattedText = formattedText.replace(/\s+/g, ' ').trim();
    
    // Remove duplicate emojis
    formattedText = formattedText.replace(/([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])\s*\1+/gu, '$1');
    
    // Split text into sentences based on '।' (Bengali full stop)
    const sentences = formattedText.split('।').filter(s => s.trim().length > 10);
    
    // Process each sentence and create structured content
    const processedSentences = sentences.map((sentence, index) => {
      sentence = sentence.trim();
      if (!sentence) return '';
      
      let emoji = '🔸';
      
      // Detect section headers based on content
      if (sentence.includes('বয়স')) emoji = '👤';
      else if (sentence.includes('ওজন')) emoji = '⚖️';
      else if (sentence.includes('শারীরিক') || sentence.includes('সুস্থতা')) emoji = '💪';
      else if (sentence.includes('হিমোগ্লোবিন')) emoji = '🩸';
      else if (sentence.includes('রক্তচাপ') || sentence.includes('পালস')) emoji = '❤️';
      else if (sentence.includes('রক্তদান') && (sentence.includes('বিরতি') || sentence.includes('শেষ'))) emoji = '⏰';
      else if (sentence.includes('অন্যান্য') || sentence.includes('শর্ত')) emoji = '📋';
      else if (sentence.includes('জীবন') || sentence.includes('বাঁচানো')) emoji = '❤️';
      else if (sentence.includes('স্বাস্থ্য') || sentence.includes('পরীক্ষা')) emoji = '🩺';
      else if (sentence.includes('মানসিক') || sentence.includes('তৃপ্তি')) emoji = '✨';
      else if (sentence.includes('হাসপাতাল') || sentence.includes('ব্লাড ব্যাংক')) emoji = '🏥';
      else if (sentence.includes('তথ্য') || sentence.includes('প্রস্তুত')) emoji = '📝';
      else if (sentence.includes('প্রচারণা') || sentence.includes('সামাজিক')) emoji = '📢';
      else if (sentence.includes('গুরুত্বপূর্ণ') || sentence.includes('সতর্কতা')) emoji = '⚠️';
      else if (sentence.includes('দাতা') || sentence.includes('গ্রহীতা')) emoji = '🩸';
      else if (index === 0) emoji = '💬';
      
      return `<div class="ai-emoji-point"><span class="point-emoji">${emoji}</span><span class="point-content">${sentence}।</span></div>`;
    });
    
    // Join processed sentences
    formattedText = processedSentences.filter(s => s.trim()).join('');
    
    // Format bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Clean up
    formattedText = formattedText.replace(/\*+/g, '');
    formattedText = formattedText.replace(/\s{2,}/g, ' ');
    
    return formattedText;
  }

  // Clear chat history
  clearChat(): void {
    this.messages = [];
    this.clearError();
  }
}
