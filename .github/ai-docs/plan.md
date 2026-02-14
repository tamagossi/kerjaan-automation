# Test Plan: PK136 Epic 2 - Form Creation - Basic Information (C.5.1)

> **Context**: Create automation tests for the Form Creation page stepper and leave confirmation flow. This implements testing for SDD C.5.1 which includes:
>
> - 5-step form creation stepper display
> - Step 1 (Basic Configuration) active state on page load
> - Steps 2-5 visible as upcoming steps
> - Leave confirmation modal with cancel and confirm actions

> **Testing Strategy**:
>
> - Add tests to existing `form.spec.ts` file
> - Combine Test Cases 1, 2, and 3 from SDD into one comprehensive test scenario
> - Test complete leave flow with both cancel and confirm actions
> - Use WHITELISTED_CREDENTIALS for authentication
> - Login once, then directly navigate to create form page (skip form list navigation)

## File Updates Plan

### `tests/fe/shared/constants/route.ts`

- Add form creation routes under SUBMISSIONS namespace
    - Add TASK_OPERATIONS nested object
    - Add DIGITAL_FORMS nested object with LIST and CREATE routes
    - CREATE route points to `/settings/task-operations/forms/create`
    - LIST route points to `/settings/task-operations/forms`

    ```typescript
    export const ROUTES = {
    	EMPLOYEE: '/agents',
    	SETTINGS: '/settings',
    	NO_ACCESS: '/no-access',
    	LEGACY: {
    		FORM_TEMPLATE: '/digital-forms',
    		FORM_ASSIGNMENT: '/digital-forms/assignment',
    	},
    	SUBMISSIONS: {
    		TASK_OPERATIONS: {
    			DIGITAL_FORMS: {
    				LIST: '/settings/task-operations/forms',
    				CREATE: '/settings/task-operations/forms/create',
    			},
    		},
    	},
    };
    ```

### `tests/fe/submission/(form)/form.page.ts`

- Add locators for form creation page elements
    - Add stepper component locator
    - Add step indicator locators (Step 1 through Step 5)
    - Add leave button locator in page header
    - Add leave confirmation modal locators (cancel button, leave button, modal title)
    - Add step content area locator

    ```typescript
    export class DynamicFormPage extends BasePage {
    	readonly taskOperationSettingMenu: Locator;
    	readonly digitalFormMenu: Locator;

    	// Form Creation Page Locators
    	readonly stepperComponent: Locator;
    	readonly step1Button: Locator;
    	readonly step2Button: Locator;
    	readonly step3Button: Locator;
    	readonly step4Button: Locator;
    	readonly step5Button: Locator;
    	readonly leaveButton: Locator;
    	readonly leaveModalTitle: Locator;
    	readonly leaveModalCancelButton: Locator;
    	readonly leaveModalLeaveButton: Locator;
    	readonly leaveModalContentTitle: Locator;

    	constructor(page: Page) {
    		super(page);
    		this.taskOperationSettingMenu = page.getByText('Task Operations');
    		this.digitalFormMenu = page.getByText('Digital Form');

    		// Stepper locators
    		this.stepperComponent = page.getByTestId('form-creation-stepper');
    		this.step1Button = page.locator('#create_form-stepper_1-basic_configuration-button');
    		this.step2Button = page.locator('#create_form-stepper_2-form_builder-button');
    		this.step3Button = page.locator('#create_form-stepper_3-logic_jump-button');
    		this.step4Button = page.locator('#create_form-stepper_4-preview-button');
    		this.step5Button = page.locator('#create_form-stepper_5-form_assignment-button');

    		// Leave button locators
    		this.leaveButton = page.getByTestId('create_form-leave-button');

    		// Leave modal locators
    		this.leaveModalTitle = page.getByTestId('form-creation-leave-confirmation-modal-title');
    		this.leaveModalCancelButton = page.getByTestId('form-creation-leave-confirmation-modal-cancel-btn');
    		this.leaveModalLeaveButton = page.getByTestId('form-creation-leave-confirmation-modal-leave-btn');
    		this.leaveModalContentTitle = page.getByTestId('form-creation-leave-confirmation-modal-content-title');
    	}
    ```

- Add navigation methods
    - Add `navigateToFormCreation()` method to directly navigate to create page
    - Add `navigateToFormList()` method to navigate to form list page
    - Add `clickLeaveButton()` method to trigger leave confirmation modal

    ```typescript
    	async navigateToFormCreation() {
    		await this.page.goto('/settings/task-operations/forms/create');
    	}

    	async navigateToFormList() {
    		await this.page.goto('/settings/task-operations/forms');
    	}

    	async clickLeaveButton() {
    		await this.leaveButton.click();
    	}
    ```

- Add verification methods for stepper
    - Add `verifyStepperVisible()` method to check if 5-step stepper component displays
    - Add `verifyAllStepsVisible()` method to verify all 5 steps are shown in stepper
    - Add `verifyStepDisabled(stepNumber)` method to check if specific step is disabled
    - Add `verifyStepContentDisplayed()` method to check step content contains expected text

    ```typescript
    	async verifyStepperVisible() {
    		await expect(this.stepperComponent).toBeVisible();
    	}

    	async verifyAllStepsVisible() {
    		await expect(this.step1Button).toBeVisible();
    		await expect(this.step2Button).toBeVisible();
    		await expect(this.step3Button).toBeVisible();
    		await expect(this.step4Button).toBeVisible();
    		await expect(this.step5Button).toBeVisible();
    	}

    	async verifyStepDisabled(stepNumber: number) {
    		const stepButtonMap = {
    			2: this.step2Button,
    			3: this.step3Button,
    			4: this.step4Button,
    			5: this.step5Button,
    		};
    		const stepButton = stepButtonMap[stepNumber as keyof typeof stepButtonMap];
    		await expect(stepButton).toBeDisabled();
    	}

    	async verifyStepContentDisplayed(expectedText: string) {
    		await expect(this.page.getByText(expectedText)).toBeVisible();
    	}
    ```

- Add verification methods for leave modal
    - Add `verifyLeaveModalVisible()` method to check modal appears on screen
    - Add `verifyLeaveModalHidden()` method to check modal is not displayed
    - Add `clickCancelInLeaveModal()` method to click Cancel button in modal
    - Add `clickLeaveInLeaveModal()` method to click Leave button in modal

    ```typescript
    	async verifyLeaveModalVisible() {
    		await expect(this.leaveModalTitle).toBeVisible();
    	}

    	async verifyLeaveModalHidden() {
    		await expect(this.leaveModalTitle).toBeHidden();
    	}

    	async clickCancelInLeaveModal() {
    		await this.leaveModalCancelButton.click();
    	}

    	async clickLeaveInLeaveModal() {
    		await this.leaveModalLeaveButton.click();
    	}
    ```

### `tests/fe/submission/(form)/form.spec.ts`

- Add new test describe block for PK136 Epic 2 - Form Creation - Basic Information

- Test Scenario 1: Form creation stepper initial state (combines TC1, TC2, TC3)
    - Login with WHITELISTED_CREDENTIALS from form.constant.ts
    - Wait for route change after login
    - Navigate directly to form creation page using navigateToFormCreation method
    - Verify Create Form page loads successfully
    - Verify 5-step progress indicator is displayed on page
    - Verify all 5 steps are visible in the stepper component
    - Verify Step 1 content displays "Basic Configuration Content"
    - Verify Step 2 is disabled (upcoming step)
    - Verify Step 3 is disabled (upcoming step)
    - Verify Step 4 is disabled (upcoming step)
    - Verify Step 5 is disabled (upcoming step)

    ```typescript
    test.describe('PK136 Epic 2 - Form Creation - Basic Information', () => {
    	test('TS.1: Form creation stepper displays correctly on page load', async ({
    		loginPage,
    		dynamicFormPage,
    	}) => {
    		await loginPage.visit();
    		await loginPage.login(WHITELISTED_CREDENTIALS.EMAIL, WHITELISTED_CREDENTIALS.PASSWORD);
    		await loginPage.waitForChangeRoute();

    		await dynamicFormPage.navigateToFormCreation();

    		await dynamicFormPage.verifyStepperVisible();

    		await dynamicFormPage.verifyAllStepsVisible();

    		await dynamicFormPage.verifyStepContentDisplayed('Basic Configuration Content');

    		await dynamicFormPage.verifyStepDisabled(2);
    		await dynamicFormPage.verifyStepDisabled(3);
    		await dynamicFormPage.verifyStepDisabled(4);
    		await dynamicFormPage.verifyStepDisabled(5);
    	});
    ```

- Test Scenario 2: Leave confirmation flow - Cancel action
    - Login with WHITELISTED_CREDENTIALS from form.constant.ts
    - Wait for route change after login
    - Navigate directly to form creation page using navigateToFormCreation method
    - Click Leave button in page header
    - Verify leave confirmation modal appears
    - Verify modal title displays "Leave Confirmation"
    - Verify modal contains warning message "Are you sure you want to leave this page?"
    - Click Cancel button in modal
    - Verify modal closes and disappears
    - Verify user remains on form creation page (URL unchanged)
    - Verify stepper is still displayed on page

    ```typescript
    test('TS.2: Leave confirmation modal - Cancel action keeps user on page', async ({
    	loginPage,
    	dynamicFormPage,
    	page,
    }) => {
    	await loginPage.visit();
    	await loginPage.login(WHITELISTED_CREDENTIALS.EMAIL, WHITELISTED_CREDENTIALS.PASSWORD);
    	await loginPage.waitForChangeRoute();

    	await dynamicFormPage.navigateToFormCreation();

    	await dynamicFormPage.clickLeaveButton();

    	await dynamicFormPage.verifyLeaveModalVisible();

    	await expect(dynamicFormPage.leaveModalContentTitle).toHaveText(
    		'Are you sure you want to leave this page?'
    	);

    	await dynamicFormPage.clickCancelInLeaveModal();

    	await dynamicFormPage.verifyLeaveModalHidden();

    	await expect(page).toHaveURL(/\/settings\/task-operations\/forms\/create/);

    	await dynamicFormPage.verifyStepperVisible();
    });
    ```

- Test Scenario 3: Leave confirmation flow - Confirm action
    - Login with WHITELISTED_CREDENTIALS from form.constant.ts
    - Wait for route change after login
    - Navigate directly to form creation page using navigateToFormCreation method
    - Click Leave button in page header
    - Verify leave confirmation modal appears
    - Click Leave button in modal
    - Verify user is redirected to form list page
    - Verify URL matches form list route at `/settings/task-operations/forms`

    ```typescript
    	test('TS.3: Leave confirmation modal - Leave action redirects to form list', async ({
    		loginPage,
    		dynamicFormPage,
    		page,
    	}) => {
    		await loginPage.visit();
    		await loginPage.login(WHITELISTED_CREDENTIALS.EMAIL, WHITELISTED_CREDENTIALS.PASSWORD);
    		await loginPage.waitForChangeRoute();

    		await dynamicFormPage.navigateToFormCreation();

    		await dynamicFormPage.clickLeaveButton();

    		await dynamicFormPage.verifyLeaveModalVisible();

    		await dynamicFormPage.clickLeaveInLeaveModal();

    		await expect(page).toHaveURL(/\/settings\/task-operations\/forms/);
    	});
    });
    ```

## Additional Notes

### IPBI Documentation Files

The following IPBI mode documentation files have been created:

- `.github/instructions/ipbi.instruction.md` - Detailed IPBI mode format instructions
- `.trae/rules/ipbi.rules.md` - Enforcement rules for IPBI mode conventions
- `CLAUDE.md` - Updated with IPBI mode section under "Adding New Modules"

These files establish the plan-first development workflow for future feature implementations.
