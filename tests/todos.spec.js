const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/todoPage');

test.describe('TodoMVC Tests - Classic Version', () => {
  let todoPage;
  const todos = ['Buy groceries', 'Buy groceries2', 'JGVJG']; 

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page, 'classic');
    await todoPage.goto();

    for (const todo of todos) {
      await todoPage.addTodo(todo);
    }
  });

  test('TC17: Add todos and validate exact texts', async () => {
    await expect(todoPage.todoItems).toHaveCount(todos.length);
    for (let i = 0; i < todos.length; i++) {
      await expect(todoPage.todoItems.nth(i)).toHaveText(todos[i]);
    }
  });

  test('TC18: Validate the count of list items', async () => {
    const itemCount = await todoPage.todoItems.count();
    expect(itemCount).toBe(todos.length);
  });

  test('TC19: Validate text in the bottom-left matches list length', async () => {
    await expect(todoPage.todoCountText).toHaveText(`${todos.length} items left!`);
  });

  test('TC20: Mark one item as completed and validate it is crossed out in Completed filter', async () => {
    await todoPage.toggleTodo(1);
    await todoPage.filters.completed.click();
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveClass(/completed/);
    await expect(todoPage.todoItems.first()).toHaveText('Buy groceries2');
  });

  test('TC21: Mark multiple items as completed and validate they are crossed out in Completed filter', async () => {
    const completedIndices = [0, 2];
    const expectedTexts = ['Buy groceries', 'JGVJG'];
    for (const index of completedIndices) {
      await todoPage.toggleTodo(index);
    }
    await todoPage.filters.completed.click();
    await expect(todoPage.todoItems).toHaveCount(completedIndices.length);
    for (let i = 0; i < completedIndices.length; i++) {
      const item = todoPage.todoItems.nth(i);
      await expect(item).toHaveClass(/completed/);
      await expect(item).toHaveText(expectedTexts[i]);
    }
  });

  test('TC22: Click Clear Completed and validate only active items remain', async () => {
    const completedIndices = [0, 2];
    for (const index of completedIndices) {
      await todoPage.toggleTodo(index);
    }
    await todoPage.clearCompletedButton.click();
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveText(todos[1]);
  });

  test('TC23: All filter shows all todos regardless of status', async () => {
    const completedIndices = [1];
    await todoPage.toggleTodo(completedIndices[0]);
    await todoPage.filters.all.click();
    await expect(todoPage.todoItems).toHaveCount(todos.length);
    for (let i = 0; i < todos.length; i++) {
      const todo = todoPage.todoItems.nth(i);
      if (completedIndices.includes(i)) {
        await expect(todo).toHaveClass(/completed/);
      } else {
        await expect(todo).not.toHaveClass(/completed/);
      }
    }
  });

  test('TC24: Active filter only shows uncompleted todos', async () => {
    const completedIndices = [0, 2];
    for (const index of completedIndices) {
      await todoPage.toggleTodo(index);
    }
    await todoPage.filters.active.click();
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveText(todos[1]);
  });

  test('TC25: Completed filter only shows marked complete todos', async () => {
    const completedIndices = [0, 2];
    for (const index of completedIndices) {
      await todoPage.toggleTodo(index);
    }
    await todoPage.filters.completed.click();
    await expect(todoPage.todoItems).toHaveCount(completedIndices.length);
    for (let i = 0; i < completedIndices.length; i++) {
      const expectedText = todos[completedIndices[i]];
      const item = todoPage.todoItems.nth(i);
      await expect(item).toHaveText(expectedText);
      await expect(item).toHaveClass(/completed/);
    }
  });

  test('TC26: Validate title "todos" is visible and correct', async ({ page }) => {
    const titleLocator = page.locator('h1');
    await expect(titleLocator).toBeVisible();
    await expect(titleLocator).toHaveText('todos');
  });

  test('TC27: Validate Footer:- All, Active, Completed, and Clear completed buttons are visible and correctly labeled', async ({ page }) => {
    const filterLabels = ['All', 'Active', 'Completed'];
    for (const label of filterLabels) {
      const locator = page.locator('.filters a', { hasText: label });
      await expect(locator).toBeVisible();
      await expect(locator).toHaveText(label);
    }
    const clearCompleted = page.locator('button.clear-completed');
    await expect(clearCompleted).toBeVisible();
    await expect(clearCompleted).toHaveText('Clear completed');
  });

  test('TC28: Validate input field and placeholder text', async ({ page }) => {
    const todoPage = new TodoPage(page, 'classic');
    await todoPage.goto();
    await expect(todoPage.newTodoInput).toBeVisible();
    await expect(todoPage.newTodoInput).toBeEditable();
    await expect(todoPage.newTodoInput).toHaveAttribute('placeholder', 'What needs to be done?');
  });
});

test.describe('Long value accept/ emoji Test Cases - Classic Version', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page, 'classic');
    await todoPage.goto();
  });

  test('TC29: Add a long input string (200 chars)', async () => {
    const longText = 'a'.repeat(2000);
    await todoPage.addTodo(longText);
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveText(longText);
  });

  test('TC30: Add input with emojis and verify proper rendering', async () => {
    const emojiText = '🙂'.repeat(50);
    await todoPage.addTodo(emojiText);
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveText(emojiText);
  });

  test('TC31: Input with leading/trailing spaces should be trimmed or rejected', async () => {
    const spacedText = '   hello world   a  ';
    await todoPage.addTodo(spacedText);
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first()).toHaveText(spacedText.trim());
  });
});

test.describe('Negative Test Cases - Classic Version', () => {
  test('TC32: Try adding a blank or space-only task', async ({ page }) => {
    const todoPage = new TodoPage(page, 'classic');
    await todoPage.goto();
    await todoPage.newTodoInput.press('Enter');
    await todoPage.newTodoInput.fill('     ');
    await todoPage.newTodoInput.press('Enter');
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(page.locator('.footer')).toHaveCount(0);
  });
});
