import { jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    try {
      const token = this.getToken();
      return token ? jwtDecode(token) : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loggedIn() {
    console.log('Checking if logged in');
    const token = this.getToken();
    console.log('Token exists:', !!token);
    const notExpired = token && !this.isTokenExpired(token);
    console.log('Token not expired:', notExpired);
    return notExpired;
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<{exp?: number}>(token);
      console.log('Token decoded:', decoded);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log('Token is expired');
        return true;
      } else {
        console.log('Token is valid');
        return false;
      }
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    console.log('Setting token in localStorage:', idToken.substring(0, 10) + '...');
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    console.log('Removing token and redirecting to login');
    localStorage.removeItem('id_token');
    window.location.assign('/login');
  }
}

export default new AuthService();