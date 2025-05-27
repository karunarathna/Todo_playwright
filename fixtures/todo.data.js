exports.todoElements = {
    classic:{
    newTodoInput: '#todo-input',
    readTodoInput: 'input.new-todo',
    todoListItem: '.todo-list li',
    toggleCheckbox: '.toggle',
    toggleAllCheckbox: '.toggle-all',
    clearCompletedButton: '.clear-completed',
    todoCount: '.todo-count',
    todoCountText: '.todo-count',  
    filters: {
      all: 'a[href="#/"]',
      active: 'a[href="#/active"]',
      completed: 'a[href="#/completed"]',
      },
    },
    typescriptReact: {
        newTodoInput: 'input[placeholder="What needs to be done?"]', // this is for the separate URL locators 
        todoListItem: '.todo-list li',
        toggleCheckbox: 'input[type="checkbox"]',
        clearCompletedButton: 'button.clear-completed',
        todoCountText: '.todo-count',
        footer: '.footer',
        filters: {
          all: 'a[href="#/"]',
          active: 'a[href="#/active"]',
          completed: 'a[href="#/completed"]',

          
        },
    }

  };
  