# IPBI Rules - Enforcement Guidelines

## Rule: Plan-First Development

### Requirement

All feature development and significant changes MUST follow the IPBI workflow:

1. **Plan** → 2. **Review** → 3. **Implement** → 4. **Iterate**

### Enforcement

- Plans MUST be written to `.github/ai-docs/plan.md` before implementation
- Plans MUST NOT contain code snippets
- Plans MUST use the bulleted list format described in `.github/instructions/ipbi.instruction.md`
- Implementation MUST NOT begin without explicit approval

## Rule: Plan Format

### Structure Requirements

- **Top-level bullets**: File paths or environments only
    - Examples: `src/config/env.ts`, `Terminal`, `tests/auth/auth.spec.ts`
- **Sub-bullets**: Descriptive steps with code snippets
    - Must describe what will be added/changed
    - Must include concrete code implementation
    - Must be specific and actionable

### Forbidden Patterns

❌ Vague descriptions without code examples
❌ Placeholder comments like "// TODO: implement"
❌ Missing file paths
❌ Skipping files that will be modified

### Required Patterns

✅ Clear file paths
✅ Descriptive action steps
✅ Code snippets for implementation

### File Coverage

Plans MUST include:

- All new files to be created
- All existing files to be modified
- All terminal commands to be run
- All test files to be added/updated
- All configuration changes

### Context Requirements

Plans MUST include:

- High-level context explaining the feature/change
- Requirements and goals
- Dependencies between files
- Testing strategy

## Rule: Review Gate

### Before Implementation

- Present plan for review
- Ask explicitly: "Is the generated plan/code design good to go?"
- Wait for confirmation
- Do NOT proceed without approval

### During Implementation

- Follow approved plan exactly
- If deviations needed, update plan and get re-approval
- Keep plan synchronized with actual implementation

## Rule: Plan Location

### Single Source of Truth

- Primary location: `.github/ai-docs/plan.md`
- Only one active plan file
- Historical plans can be archived but must not conflict

### File Organization

```
.github/
  ai-docs/
    plan.md          ← Current active plan
    archive/         ← Optional: historical plans
```

## Validation Checklist

Before submitting a plan for review:

- [ ] Plan is in `.github/ai-docs/plan.md`
- [ ] Code snippets are included for all implementations
- [ ] All affected files listed
- [ ] Steps are clear and actionable
- [ ] Context explains the why
- [ ] Dependencies noted
- [ ] Test strategy included
- [ ] Follows project conventions

## Integration Points

### With Project Conventions

Plans MUST respect:

- File naming from `.github/copilot-instructions.md`
- Module structure from `CLAUDE.md`
- Import patterns from project conventions
- Fixture chain from test architecture

### With Testing Strategy

Plans MUST include:

- Test files for new features
- Test scenarios description
- Testing approach (unit/integration/e2e)
- Expected test coverage

## Enforcement Actions

### Plan Issues

If plan does not meet requirements:

- Reject with specific feedback
- Request revision
- Do NOT proceed to implementation

### Implementation Deviations

If implementation diverges from approved plan:

- Stop implementation
- Update plan
- Request re-approval
- Resume after approval

## Examples

### Good Plan Structure

```markdown
### `src/services/user.service.ts`

- Create UserService class
- Add getUserById method to fetch user by ID
- Add updateUser method with validation
- Add deleteUser method with soft delete
- Integrate with database repository
- Export UserService instance
```

### Bad Plan Structure

````markdown
### `src/services/user.service.ts`

- Add code for user management

```typescript
class UserService {
	getUserById(id: string) {
		// implementation
	}
}
```
````

```

## Exceptions

IPBI mode may be skipped for:
- Trivial changes (typos, formatting)
- Documentation-only updates
- Emergency hotfixes (with post-hoc documentation)

All other changes MUST follow IPBI workflow.

## Monitoring

Teams should track:
- Plan approval time
- Implementation accuracy vs plan
- Deviation frequency
- Plan quality over time

## References

- See `.github/instructions/ipbi.instruction.md` for detailed format guidelines
- See `CLAUDE.md` for project-specific conventions
- See `.github/copilot-instructions.md` for code generation rules
```
