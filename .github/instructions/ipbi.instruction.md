# IPBI Mode Instructions - Input-to-Plan-Build-Iterate

## Overview

IPBI (Input-to-Plan-Build-Iterate) is a development workflow that emphasizes careful planning before implementation. This mode requires creating a detailed implementation plan in `.github/ai-docs/plan.md` before writing any code.

## Purpose

- Transform high-level requirements into actionable, reviewable plans
- Provide clear visibility into what will be implemented
- Enable review and approval before code changes
- Maintain a single source of truth for implementation steps

## Plan Format

### Structure

Plans use a **bulleted list format** where:

- **Top-level bullets** = file paths or environments (e.g., `Terminal`, `src/config/config.ts`)
- **Sub-bullets** = descriptive steps explaining what will be done
- **Code snippets** = concrete implementation code for each step

### Example Plan Format

```markdown
# Feature: Add User Authentication Module

> **Context**: Implement JWT-based authentication for the API
>
> **Requirements**:
>
> - Secure token generation and validation
> - User login and logout endpoints
> - Protected route middleware

## Directory Structure

- Create directory `src/modules/auth/`
- Create directory `src/middleware/`

## File Implementation Plan

### `package.json`

- Add jsonwebtoken dependency
- Add bcrypt dependency for password hashing
- Update scripts section with auth-related commands

### `Terminal`

- Run npm install to install new dependencies
- Run database migration to add users table

### `src/config/env.ts`

- Add JWT_SECRET environment variable
- Add JWT_EXPIRATION_TIME configuration
- Export new auth configuration object

### `src/modules/auth/auth.service.ts`

- Create AuthService class
- Add generateToken method for JWT creation
- Add validateToken method for JWT verification
- Add hashPassword method using bcrypt
- Add comparePassword method for login validation
- Export AuthService instance

### `src/modules/auth/auth.controller.ts`

- Create AuthController class
- Add login endpoint handler
- Add logout endpoint handler
- Add token refresh endpoint handler
- Integrate with AuthService for business logic

### `src/middleware/auth.middleware.ts`

- Create authentication middleware function
- Extract token from Authorization header
- Validate token using AuthService
- Attach user information to request object
- Handle authentication errors with proper status codes

### `src/routes/auth.routes.ts`

- Define POST /auth/login route
- Define POST /auth/logout route
- Define POST /auth/refresh route
- Apply validation middleware to routes
- Export configured router

### `tests/modules/auth/auth.service.test.ts`

- Create test suite for AuthService
- Test generateToken creates valid JWT
- Test validateToken rejects invalid tokens
- Test hashPassword creates secure hashes
- Test comparePassword validates credentials correctly
```

## Key Principles

### 1. Context Over Code

Each section should include:

- **What** will be added/changed
- **Why** it's needed
- **How** it relates to other components
- **Code snippets** showing the exact implementation

### 2. Completeness

Include all files that will be touched:

- New files to create
- Existing files to modify
- Configuration updates
- Terminal commands
- Test files

### 3. Logical Grouping

Group related changes:

- File-by-file organization
- Related steps under each file
- Dependencies clearly noted

### 4. Actionable Steps

Each step should be:

- Clear and specific
- Independent or with noted dependencies
- Implementable by someone reading the plan

## Workflow

### 1. Planning Phase

- Read requirements carefully
- Research existing codebase patterns
- Identify all affected files
- Write plan to `.github/ai-docs/plan.md`
- **STOP**: Ask for review before implementing

### 2. Review Gate

- Present plan for approval
- Ask: "Is the generated plan/code design good to go?"
- Wait for explicit confirmation
- Address feedback if needed

### 3. Implementation Phase

- Execute plan exactly as approved
- Implement changes file by file
- Follow existing code conventions
- Test as you go

### 4. Iteration

- If issues arise, update plan
- Get re-approval for significant changes
- Keep plan as single source of truth

## Benefits

### For Reviewers

- Easy to understand scope
- Can spot issues before implementation
- Clear visibility into changes

### For Implementers

- Clear roadmap to follow
- Reduced decision fatigue
- Better estimation of work

### For Teams

- Shared understanding
- Documentation of decisions
- Reusable patterns

## Anti-Patterns

❌ **Don't:**

- Write vague steps without code examples
- Skip files that will be modified
- Use placeholder comments like "// add logic here"
- Start coding before plan approval
- Ignore existing patterns

✅ **Do:**

- Describe changes clearly with code snippets
- List all affected files
- Use specific, implementable code
- Wait for approval
- Follow project conventions

## Plan Location

All plans must be written to:

```
.github/ai-docs/plan.md
```

This is the **single source of truth** for implementation plans.

## Integration with Mode Instructions

When running in IPBI mode:

1. The system automatically creates plans in the required format
2. Plans must be approved before implementation
3. Deviations from the approved plan require re-approval
4. The plan serves as documentation post-implementation

## Related Files

- `.trae/rules/ipbi.rules.md` - Enforcement rules for IPBI mode
- `CLAUDE.md` - Project-specific conventions
- `.github/copilot-instructions.md` - Code generation guidelines
