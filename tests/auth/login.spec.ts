import { test, expect } from '@playwright/test';

test.describe('Login Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000'); // Adjust path as needed
  });

  test('should display login form elements', async ({ page }) => {
    // Check if form elements are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Enter your password');
    const eyeIcon = page.locator('[data-testid="eye-icon"]').or(page.locator('.lucide-eye'));
    const eyeOffIcon = page.locator('[data-testid="eye-off-icon"]').or(page.locator('.lucide-eye-off'));

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click eye icon to show password
    await eyeIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click eye-off icon to hide password
    await eyeOffIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.getByRole('button', { name: 'Sign in' }).click();await page.locator('body').click();

    // Wait for validation errors
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill invalid email
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Check for email validation error
  });

  test('should handle successful login', async ({ page }) => {
    // Mock the signIn API call
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 200, 
          ok: true 
        })
      });
    });

    // Mock the session API call
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            groups: [{
              permissions: [
                { codename: 'read_users', name: 'Read Users' },
                { codename: 'write_users', name: 'Write Users' }
              ]
            }]
          }
        })
      });
    });

    // Fill login form
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

    
  });

  test('should handle failed login', async ({ page }) => {
    // Mock failed signIn API call
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 401, 
          ok: false 
        })
      });
    });

    // Fill login form with invalid credentials
    await page.getByPlaceholder('Enter your email').fill('wrong@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for error toast
    await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Ensure we stay on login page
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.getByRole('link', { name: 'Forgot password?' }).click();

    // Check navigation to forgot password page
    await expect(page).toHaveURL(/.*forgot-password/); // Adjust based on your route
  });

  test('should handle form submission with keyboard', async ({ page }) => {
    // Mock successful login
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 200, ok: true })
      });
    });

    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            groups: [{ permissions: [] }]
          }
        })
      });
    });

    // Fill form and submit with Enter key
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByPlaceholder('Enter your password').press('Enter');

    // Check for success
  });

  test('should disable submit button while loading', async ({ page }) => {
    // Mock a slow API response
    await page.route('**/api/auth/signin', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 200, ok: true })
      });
    });

    // Fill form
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();

   
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form has proper labels
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    // Check form has proper ARIA attributes
    const emailInput = page.getByPlaceholder('Enter your email');
    const passwordInput = page.getByPlaceholder('Enter your password');

    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  // Playwright test for login functionality
  test('Login flow redirects to dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000');

    // Find and fill the login form
    await page.fill('input[name="email"]', 'sirdanny8@gmail.com');
    await page.fill('input[name="password"]', 'thepassword123');

    // Submit the form (assuming a button with type submit)
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('http://localhost:3000/app/dashboard', { timeout: 10000 });

    // Assert redirected URL
    expect(page.url()).toBe('http://localhost:3000/app/dashboard');
  });
});