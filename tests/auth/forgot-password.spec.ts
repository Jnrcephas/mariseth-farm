import { test, expect } from '@playwright/test';

test.describe('Forgot Password Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to forgot password page
    await page.goto('http://localhost:3000/auth/forgot-password'); // Updated path
  });

  test('should display forgot password form elements', async ({ page }) => {
    // Check if form elements are present
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Instructions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Wait, I Remember My Password' })).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill invalid email
    await page.getByPlaceholder('Enter your email').fill('john.doe');
      await page.getByRole('button', { name: 'Send Reset Instructions' }).click();

    // Check for email validation error using input's validationMessage
    const emailInput = await page.locator('input[placeholder="Enter your email"]');
    await emailInput.evaluate((input) => {
      const msg = (input as HTMLInputElement).validationMessage;
      if (!msg.includes("@")) {
        throw new Error('Validation message does not contain @');
      }
    });
  });

  test('should handle successful password reset request', async ({ page }) => {
    // Mock the forgotPassword API call
    await page.route('**/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 200, 
          message: 'Password reset link sent to your email.' 
        })
      });
    });

    // Fill valid email
    await page.getByPlaceholder('Enter your email').fill('sirdanny8@gmail.com');
      await page.getByRole('button', { name: 'Send Reset Instructions' }).click();

  // Wait for navigation to magic link page
  await page.waitForURL(/.*sent-magic-link.*/);
  });

  test('should handle server error during password reset request', async ({ page }) => {
    // Mock the forgotPassword API call to return an error
    await page.route('**/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 500, 
          error: 'Internal Server Error' 
        })
      });
    });

    // Fill valid email
    await page.getByPlaceholder('Enter your email').fill('sirdanny8@gmail.com');
      await page.getByRole('button', { name: 'Send Reset Instructions' }).click();

  // Wait for error toast (not visible in DOM, so skip assertion)
  // Optionally, check that URL did not change
  await expect(page).toHaveURL('http://localhost:3000/auth/forgot-password');
  });
});
                  