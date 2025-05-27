const { todoElements } = require('../../fixtures/todo.data');

class TodoPage {
  constructor(page, version = 'classic') {
    this.page = page;
    this.selectors = todoElements[version]; 

    // Locators are based on the selected version
    this.newTodoInput = page.locator(this.selectors.newTodoInput);
    this.readTodoInput = this.selectors.readTodoInput
      ? page.locator(this.selectors.readTodoInput)
      : null;

    this.todoItems = page.locator(this.selectors.todoListItem);
    this.toggleCheckboxSelector = this.selectors.toggleCheckbox;
    this.todoCountText = page.locator(this.selectors.todoCountText);
    this.todoCount = page.locator(this.selectors.todoCount);
    this.clearCompletedButton = page.locator(this.selectors.clearCompletedButton);
    this.toggleAllCheckbox = page.locator(this.selectors.toggleAllCheckbox);

    this.filters = {
      all: page.locator(this.selectors.filters.all),
      active: page.locator(this.selectors.filters.active),
      completed: page.locator(this.selectors.filters.completed),
    };
  }

  async goto() {
    const url =
      this.selectors === todoElements.typescriptReact
        ? 'https://todomvc.com/examples/typescript-react/#/'
        : 'https://todomvc.com/examples/react/dist/';
    await this.page.goto(url);
  }

  async addTodo(todoText) {
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press('Enter');
  }

  async toggleTodo(index = 0) {
    await this.todoItems.nth(index).locator(this.toggleCheckboxSelector).check();
  }

  async deleteTodo(index = 0) {
    const todo = this.todoItems.nth(index);
    await todo.hover();
    await todo.locator('.destroy').click();
  }
}

module.exports = { TodoPage };
