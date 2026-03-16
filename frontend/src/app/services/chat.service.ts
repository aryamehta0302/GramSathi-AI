import { Injectable, signal } from '@angular/core';
import { Message, Conversation } from '../models/models';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private conversations = signal<Conversation[]>([
    {
      id: '1',
      title: 'Crop Disease Identification',
      lastMessage: 'Can you help identify this leaf spot pattern?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      title: 'Weather Forecast Query',
      lastMessage: 'What will the rainfall be like next week?',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      title: 'Soil Health Analysis',
      lastMessage: 'My soil pH is 5.2, what should I do?',
      timestamp: new Date(Date.now() - 86400000),
    },
  ]);

  private messages = signal<Message[]>([]);
  private isTyping = signal(false);
  private activeConversationId = signal<string | null>('1');

  readonly conversationList = this.conversations.asReadonly();
  readonly messageList = this.messages.asReadonly();
  readonly aiTyping = this.isTyping.asReadonly();
  readonly activeConversation = this.activeConversationId.asReadonly();

  private mockAIResponses = [
    "Based on the symptoms you've described, this appears to be a case of bacterial leaf blight. I recommend applying copper-based fungicides and ensuring proper drainage in your field. Would you like me to suggest specific products available in your area?",
    "The weather data for your region suggests moderate rainfall expected in the coming week. I'd recommend preparing your irrigation schedule accordingly and ensuring your drainage channels are clear.",
    "Your soil analysis indicates a slightly acidic pH level. I'd suggest applying agricultural lime at 2-3 tonnes per hectare. Additionally, incorporating organic matter like well-decomposed compost can help buffer the pH over time.",
    "That's a great question! For optimal crop yield, I recommend practicing crop rotation with legumes to naturally replenish nitrogen levels. Would you like a detailed rotation plan for your farm size?",
    "I understand your concern. Water management is crucial during this season. Let me provide you with a comprehensive irrigation schedule based on your crop type and current weather patterns.",
  ];

  constructor() {
    // Load initial messages for the first conversation
    this.loadMessagesForConversation('1');
  }

  /**
   * Get conversations list.
   * TODO: Replace with HttpClient.get(`${environment.apiUrl}/conversations`)
   */
  getConversations(): Conversation[] {
    return this.conversations();
  }

  /**
   * Load messages for a conversation.
   * TODO: Replace with HttpClient.get(`${environment.apiUrl}/conversations/${id}/messages`)
   */
  loadMessagesForConversation(conversationId: string): void {
    this.activeConversationId.set(conversationId);

    // Mock initial messages
    const mockMessages: Message[] = [
      {
        id: '1',
        conversationId,
        content: 'Hello! I need help with my crops.',
        role: 'user',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: '2',
        conversationId,
        content: "Namaste! I'm Gram Sathi AI, your agricultural assistant. 🌾 I'm here to help you with crop management, soil analysis, weather updates, and more. How can I assist you today?",
        role: 'ai',
        timestamp: new Date(Date.now() - 55000),
      },
    ];

    this.messages.set(mockMessages);
  }

  /**
   * Send a message and receive AI response.
   * TODO: Replace with HttpClient.post(`${environment.apiUrl}/chat/send`, { content, conversationId })
   */
  async sendMessage(content: string): Promise<void> {
    const conversationId = this.activeConversationId() || '1';

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, userMessage]);

    // Simulate AI typing
    this.isTyping.set(true);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // Add AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      conversationId,
      content: this.mockAIResponses[Math.floor(Math.random() * this.mockAIResponses.length)],
      role: 'ai',
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, aiResponse]);
    this.isTyping.set(false);

    // Update conversation list
    this.conversations.update(convs =>
      convs.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: content, timestamp: new Date() }
          : c,
      ),
    );
  }

  /**
   * Create a new conversation.
   * TODO: Replace with HttpClient.post(`${environment.apiUrl}/conversations`, {})
   */
  createNewConversation(): void {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: 'Start a new conversation...',
      timestamp: new Date(),
    };

    this.conversations.update(convs => [newConv, ...convs]);
    this.activeConversationId.set(newConv.id);
    this.messages.set([
      {
        id: '1',
        conversationId: newConv.id,
        content: "Namaste! 🙏 I'm Gram Sathi AI, your intelligent farming companion. Ask me anything about crops, soil, weather, or agricultural practices!",
        role: 'ai',
        timestamp: new Date(),
      },
    ]);
  }
}
