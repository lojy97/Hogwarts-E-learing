// src/services/apiService.ts

import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your backend URL

// Helper function to handle API calls
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Fetch all conversations for a specific chat room
  getConversationByChatRoom: async (chatRoomId: string) => {
    try {
      const response = await apiClient.get(`/conversations/${chatRoomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation by chat room:', error);
      throw error;
    }
  },

  // Fetch a conversation by its ID
  getConversationById: async (conversationId: string) => {
    try {
      const response = await apiClient.get(`/conversations/by-id/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation by ID:', error);
      throw error;
    }
  },

  // Create a new conversation
  createConversation: async (chatRoomId: string, participants: string[]) => {
    try {
      const response = await apiClient.post('/conversations', { chatRoomId, participants });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Add a message to a conversation
  addMessageToConversation: async (conversationId: string, messageId: string) => {
    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, { messageId });
      return response.data;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  },

  // Fetch saved chats for a user (for example, chat history)
  getSavedChats: async (userId: string) => {
    try {
      const response = await apiClient.get(`/chats/saved/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved chats:', error);
      throw error;
    }
  },

  // Post a new forum (announcement or discussion)
  createForumPost: async (chatRoomId: string, userId: string, content: string) => {
    try {
      const response = await apiClient.post(`/forums/${chatRoomId}`, {
        userId,
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  },

  // Edit a forum post
  editForumPost: async (forumPostId: string, content: string) => {
    try {
      const response = await apiClient.put(`/forums/${forumPostId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error editing forum post:', error);
      throw error;
    }
  },

  // Delete a forum post (instructor only)
  deleteForumPost: async (forumPostId: string) => {
    try {
      const response = await apiClient.delete(`/forums/${forumPostId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting forum post:', error);
      throw error;
    }
  },
};

