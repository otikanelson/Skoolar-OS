# Contributing to Skoolar

Thank you for your interest in contributing to Skoolar! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/skoolar.git
   cd skoolar
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Setup

Follow the setup instructions in the main [README.md](README.md) to get your development environment running.

## 🎯 Contribution Guidelines

### Code Style

- **Backend (NestJS/TypeScript)**:
  - Follow TypeScript best practices
  - Use dependency injection
  - Write unit tests for services
  - Use DTOs for validation
  - Follow NestJS module structure

- **Frontend (React/TypeScript)**:
  - Use functional components with hooks
  - Follow React best practices
  - Use Tailwind CSS for styling
  - Keep components small and focused
  - Use TypeScript for type safety

### Commit Messages

Follow conventional commit format:
```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(results): correct grade calculation logic
docs(readme): update installation instructions
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**:
   ```bash
   # Backend
   cd educore-os/backend
   npm test
   
   # Frontend
   cd educore-os/frontend
   npm test
   ```
4. **Update the README.md** if you're adding new features
5. **Create a Pull Request** with a clear title and description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, Node version, etc.
6. **Screenshots**: If applicable
7. **Error Messages**: Full error messages and stack traces

## 💡 Suggesting Features

When suggesting features:

1. **Use Case**: Explain the problem this feature solves
2. **Proposed Solution**: Describe your proposed solution
3. **Alternatives**: Any alternative solutions considered
4. **Additional Context**: Screenshots, mockups, etc.

## 🧪 Testing

### Backend Tests
```bash
cd educore-os/backend
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

### Frontend Tests
```bash
cd educore-os/frontend
npm test                # Run all tests
npm test -- --watch    # Watch mode
```

## 📝 Code Review Process

1. At least one maintainer must approve the PR
2. All CI checks must pass
3. Code must follow style guidelines
4. Tests must be included for new features
5. Documentation must be updated

## 🔒 Security

If you discover a security vulnerability, please email security@skoolar.com instead of creating a public issue.

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You!

Your contributions help make Skoolar better for everyone. We appreciate your time and effort!
