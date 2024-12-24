import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {

  getConversationByChatRoom: async (chatRoomId: string) => {
    try {
      const response = await apiClient.get(`/conversations/${chatRoomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation by chat room:', error);
      throw error;
    }
  },


  getConversationById: async (conversationId: string) => {
    try {
      const response = await apiClient.get(`/conversations/by-id/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation by ID:', error);
      throw error;
    }
  },

  
  createConversation: async (chatRoomId: string, participants: string[]) => {
    try {
      const response = await apiClient.post('/conversations', { chatRoomId, participants });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

 
  addMessageToConversation: async (conversationId: string, messageId: string) => {
    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, { messageId });
      return response.data;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  },

  
  getSavedChats: async (userId: string) => {
    try {
      const response = await apiClient.get(`/chats/saved/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved chats:', error);
      throw error;
    }
  },


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


  editForumPost: async (forumPostId: string, content: string) => {
    try {
      const response = await apiClient.put(`/forums/${forumPostId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error editing forum post:', error);
      throw error;
    }
  },

 
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

