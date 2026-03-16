import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Message, Conversation, BackendChatResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private conversations = signal<Conversation[]>([]);
  private messages = signal<Message[]>([]);
  private isTyping = signal(false);
  private activeConversationId = signal<string | null>(null);

  readonly conversationList = this.conversations.asReadonly();
  readonly messageList = this.messages.asReadonly();
  readonly aiTyping = this.isTyping.asReadonly();
  readonly activeConversation = this.activeConversationId.asReadonly();

  constructor(private http: HttpClient) {}

  getConversations(): Conversation[] {
    return this.conversations();
  }

  loadMessagesForConversation(conversationId: string): void {
    this.activeConversationId.set(conversationId);

    // Restore messages from local state for the selected conversation
    // (conversations & messages live client-side since backend only has /chat)
    if (this.messages().length === 0 || this.messages()[0]?.conversationId !== conversationId) {
      this.messages.set([
        {
          id: '1',
          conversationId,
          content:
            "Namaste! I'm Gram Sathi AI, your agricultural assistant. 🌾 I'm here to help you with crop management, soil analysis, weather updates, and more. How can I assist you today?",
          role: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }

  /**
   * Send a message to the backend /chat/ endpoint and display the response.
   */
  async sendMessage(content: string): Promise<void> {
    const conversationId = this.activeConversationId() || '1';

    // Add user message to the UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, userMessage]);

    // Show typing indicator while the backend processes the request
    this.isTyping.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<BackendChatResponse>(`${environment.apiUrl}/chat/`, {
          message: content,
        }),
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        conversationId,
        content: response.answer,
        role: 'ai',
        timestamp: new Date(),
        sources: response.sources,
      };

      this.messages.update(msgs => [...msgs, aiResponse]);
    } catch {
      // If the backend is unreachable, show a friendly error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId,
        content:
          'Sorry, I could not reach the server. Please make sure the backend is running on ' +
          environment.apiUrl,
        role: 'ai',
        timestamp: new Date(),
      };
      this.messages.update(msgs => [...msgs, errorMessage]);
    } finally {
      this.isTyping.set(false);
    }

    // Update conversation list
    this.conversations.update(convs =>
      convs.map(c =>
        c.id === conversationId ? { ...c, lastMessage: content, timestamp: new Date() } : c,
      ),
    );
  }

  /**
   * Create a new conversation (client-side only).
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
        content:
          "Namaste! 🙏 I'm Gram Sathi AI, your intelligent farming companion. Ask me anything about crops, soil, weather, or agricultural practices!",
        role: 'ai',
        timestamp: new Date(),
      },
    ]);
  }
}
