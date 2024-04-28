import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../src/Pages/Chat';
import { userStore } from '../src/Stores/UserStore';
import { useMessageStore } from '../src/Stores/MessageStore'; 
import MessageService from '../src/Components/Service/MessageService'; 
import '@testing-library/jest-dom';

jest.mock('../src/Components/Service/MessageService'); 
jest.mock('../src/Stores/UserStore', () => ({
  __esModule: true,
  userStore: jest.fn(),
}));
jest.mock('../src/Stores/MessageStore', () => ({
  __esModule: true,
  useMessageStore: jest.fn(),
}));

describe('Chat', () => {
  beforeEach(() => {
    userStore.mockReturnValue({
      token: "mockToken",
      userData: { username: "mockUsername", photoURL: "mockPhotoURL" },
    });
    useMessageStore.mockReturnValue({ messages: [], addMessage: jest.fn() });
  });

  test('renders chat component', () => {
    render(<Chat receiverUsername="mockReceiverUsername" />);
    expect(screen.getByTestId('chat')).toBeInTheDocument();
  });

  test('handles input change correctly', async () => {
    await act(async () => {
      render(<Chat receiverUsername="mockReceiverUsername" />);
    });

    fireEvent.change(screen.getByPlaceholderText('Type here...'), { target: { value: 'Hello' } });
    expect(screen.getByPlaceholderText('Type here...')).toHaveValue('Hello');
  });

  test('handles form submission correctly', async () => {
    MessageService.sendMessage.mockResolvedValue('mockResponse');

    await act(async () => {
      render(<Chat receiverUsername="mockReceiverUsername" />);
    });

    fireEvent.change(screen.getByPlaceholderText('Type here...'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByTestId('send-message-button'));

    await act(async () => {
      await waitFor(() => expect(MessageService.sendMessage).toHaveBeenCalled());
    });

    expect(useMessageStore().addMessage).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mockResponse',
      title: 'mockUsername',
      text: 'Hello',
      status: 'sent',
      avatar: 'mockPhotoURL',
      titleColor: '#D7693C',
    }));

    expect(screen.getByPlaceholderText('Type here...')).toHaveValue('');
  });
});
