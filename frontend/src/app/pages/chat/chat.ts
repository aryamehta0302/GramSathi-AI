import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatPage implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  newMessage = '';
  sidebarOpen = signal(true);
  private shouldScroll = false;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  async sendMessage(): Promise<void> {
    const content = this.newMessage.trim();
    if (!content) return;

    this.newMessage = '';
    this.shouldScroll = true;

    await this.chatService.sendMessage(content);
    this.shouldScroll = true;

    // Refocus input after sending
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus();
    }, 100);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  selectConversation(id: string): void {
    this.chatService.loadMessagesForConversation(id);
    this.shouldScroll = true;
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      this.sidebarOpen.set(false);
    }
  }

  newChat(): void {
    this.chatService.createNewConversation();
    this.shouldScroll = true;
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  getTimeStr(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getRelativeTime(date: Date): string {
    const now = new Date().getTime();
    const diff = now - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // ignore
    }
  }
}
