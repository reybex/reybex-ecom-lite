/**
 * Authentication service interface
 * Dependency Inversion: Depend on abstractions, not concretions
 */

export class IAuthService {
  /**
   * Login with credentials
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    throw new Error('login method must be implemented')
  }

  /**
   * Logout user
   * @returns {void}
   */
  logout() {
    throw new Error('logout method must be implemented')
  }

  /**
   * Check authentication status
   * @returns {Promise<boolean>} Authentication status
   */
  async checkAuth() {
    throw new Error('checkAuth method must be implemented')
  }

  /**
   * Get current user
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    throw new Error('getCurrentUser method must be implemented')
  }

  /**
   * Get authentication token
   * @returns {string|null} Token or null
   */
  getToken() {
    throw new Error('getToken method must be implemented')
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    throw new Error('isAuthenticated method must be implemented')
  }
}
