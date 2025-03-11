import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Sending login request with data:', userInfo);
    
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    // Parse JSON if there is content
    const data = responseText ? JSON.parse(responseText) : {};
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export { login };