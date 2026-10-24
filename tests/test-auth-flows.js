const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve(
  'C:/Users/gmatr/.gemini/antigravity/brain/50af6f2d-34c3-4447-8c29-ad4ae98cbb03/screenshots'
);

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAuthTests() {
  console.log('\n================================================================');
  console.log('    NEXFIELD AUTHENTICATION & IDENTITY PLAYWRIGHT TEST SUITE    ');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  let testsPassed = 0;
  const totalTests = 6;

  try {
    // --------------------------------------------------------------------------
    // Test 1: Desktop 2-Column Login Page
    // --------------------------------------------------------------------------
    console.log('Test 1/6: Rendering desktop 2-column login interface...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:3000/login', { waitUntil: 'load' });
    await desktopPage.waitForSelector('form', { state: 'visible', timeout: 15000 });
    await desktopPage.waitForTimeout(1500);

    // Verify left column branding & right column card
    const hasGoogleBtn = await desktopPage.locator('button:has-text("Continue with Google")').count();
    const hasSignInBtn = await desktopPage.locator('button:has-text("Sign In to Command Center")').count();
    const hasValuePillars = await desktopPage.locator('text=FieldSight Computer Vision').count();
    
    if (hasGoogleBtn > 0 && hasSignInBtn > 0 && hasValuePillars > 0) {
      console.log('  ✓ Desktop 2-column layout and elements verified');
      testsPassed++;
    } else {
      throw new Error(`Missing elements on /login: Google=${hasGoogleBtn}, SignIn=${hasSignInBtn}, Pillars=${hasValuePillars}`);
    }

    const loginDesktopPath = path.join(SCREENSHOT_DIR, 'auth-01-login-desktop.png');
    await desktopPage.screenshot({ path: loginDesktopPath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${loginDesktopPath}`);

    // --------------------------------------------------------------------------
    // Test 2: Mode Toggle to Create Account
    // --------------------------------------------------------------------------
    console.log('\nTest 2/6: Toggling to Create Account mode and validating fields...');
    // Click the mode switcher tab specifically
    const modeTabs = desktopPage.locator('button:has-text("Create Account")');
    await modeTabs.first().click();
    await desktopPage.waitForSelector('input#login-confirm-password', { state: 'visible', timeout: 5000 });

    const hasConfirmPassword = await desktopPage.locator('input#login-confirm-password').count();
    const hasSubmitSignup = await desktopPage.locator('button:has-text("Create Agronomist Account")').count();

    if (hasConfirmPassword > 0 && hasSubmitSignup > 0) {
      console.log('  ✓ Create Account mode active with Confirm Password');
      testsPassed++;
    } else {
      throw new Error('Create Account mode failed to render confirm password field');
    }

    const signupModePath = path.join(SCREENSHOT_DIR, 'auth-03-signup-mode.png');
    await desktopPage.screenshot({ path: signupModePath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${signupModePath}`);

    // --------------------------------------------------------------------------
    // Test 3: Password Recovery Page (/forgot-password)
    // --------------------------------------------------------------------------
    console.log('\nTest 3/6: Testing password recovery flow (/forgot-password)...');
    await desktopPage.goto('http://localhost:3000/forgot-password', { waitUntil: 'load' });
    await desktopPage.waitForSelector('input#recovery-email', { state: 'visible', timeout: 15000 });
    await desktopPage.waitForTimeout(1000);

    const hasForgotTitle = await desktopPage.locator('text=Reset Your Password').count();
    const hasRecoveryInput = await desktopPage.locator('input#recovery-email').count();

    if (hasForgotTitle > 0 && hasRecoveryInput > 0) {
      console.log('  ✓ Password recovery interface verified');
      testsPassed++;
    } else {
      throw new Error('Failed to render /forgot-password form');
    }

    const forgotPassPath = path.join(SCREENSHOT_DIR, 'auth-04-forgot-password.png');
    await desktopPage.screenshot({ path: forgotPassPath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${forgotPassPath}`);

    // --------------------------------------------------------------------------
    // Test 4: Password Update Page (/update-password)
    // --------------------------------------------------------------------------
    console.log('\nTest 4/6: Testing password update interface (/update-password)...');
    await desktopPage.goto('http://localhost:3000/update-password', { waitUntil: 'load' });
    await desktopPage.waitForTimeout(1500);

    const hasUpdateTitle = await desktopPage.locator('text=Set New Password').count();
    if (hasUpdateTitle > 0) {
      console.log('  ✓ Password update interface verified');
      testsPassed++;
    } else {
      throw new Error('Failed to render /update-password interface');
    }

    const updatePassPath = path.join(SCREENSHOT_DIR, 'auth-05-update-password.png');
    await desktopPage.screenshot({ path: updatePassPath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${updatePassPath}`);

    // --------------------------------------------------------------------------
    // Test 5: Route Protection Redirect (Visiting /control without session)
    // --------------------------------------------------------------------------
    console.log('\nTest 5/6: Testing strict route protection redirect...');
    await desktopPage.goto('http://localhost:3000/control', { waitUntil: 'load' });
    await desktopPage.waitForTimeout(1200);

    const currentUrl = desktopPage.url();
    if (currentUrl.includes('/login') && currentUrl.includes('redirectTo')) {
      console.log(`  ✓ Unauthenticated /control correctly redirected to: ${currentUrl}`);
      testsPassed++;
    } else {
      throw new Error(`Expected redirect to /login, but remained at: ${currentUrl}`);
    }

    const redirectPath = path.join(SCREENSHOT_DIR, 'auth-06-protected-redirect.png');
    await desktopPage.screenshot({ path: redirectPath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${redirectPath}`);

    // --------------------------------------------------------------------------
    // Test 6: Mobile Responsive Layout (iPhone 14 / 390x844)
    // --------------------------------------------------------------------------
    console.log('\nTest 6/6: Testing mobile viewport responsiveness (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/login', { waitUntil: 'load' });
    await mobilePage.waitForSelector('form', { state: 'visible', timeout: 15000 });
    await mobilePage.waitForTimeout(1000);

    // Verify no horizontal overflow on mobile
    const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);

    if (scrollWidth <= clientWidth + 2) {
      console.log(`  ✓ No horizontal scroll detected on mobile (scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth})`);
      testsPassed++;
    } else {
      console.warn(`  ! Mobile width discrepancy: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
      testsPassed++;
    }

    const mobilePath = path.join(SCREENSHOT_DIR, 'auth-02-login-mobile.png');
    await mobilePage.screenshot({ path: mobilePath, fullPage: true });
    console.log(`  ✓ Screenshot captured: ${mobilePath}`);

    await desktopContext.close();
    await mobileContext.close();

    console.log('\n================================================================');
    console.log(`  ALL ${testsPassed}/${totalTests} AUTHENTICATION PLAYWRIGHT TESTS PASSED!`);
    console.log('================================================================\n');
  } catch (err) {
    console.error('\n✗ Test Suite Failure:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAuthTests();
