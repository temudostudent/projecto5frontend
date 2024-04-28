import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../src/Components/CommonElements/Header';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthService from '../src/Components/Service/AuthService';

jest.mock('../src/Components/Service/AuthService'); // Mock AuthService

describe('Header', () => {
  test('renders header component', () => {
    render(
      <Router>
        <Header selectedFilter="filter" selectedOption="option" />
      </Router>
    );
    
    // Assert that the header component is rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
  
  test('handles logout correctly', async () => {
    // Mock the AuthService.logout function
    AuthService.logout.mockResolvedValue(); // Mock logout function to resolve

    render(
      <Router>
        <Header selectedFilter="filter" selectedOption="option" />
      </Router>
    );
    
    // Simulate actions to make the 'Logout' button visible
    fireEvent.click(screen.getByAltText('Profile Pic'));

    // Wait for the 'Logout' button to be visible
    await waitFor(() => screen.getByText('Logout'));

    // Click the 'Logout' button
    fireEvent.click(screen.getByText('Logout'));

    // Assert that the AuthService.logout function is called
    expect(AuthService.logout).toHaveBeenCalled();
  });
});
