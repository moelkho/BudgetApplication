class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // metode pour soumettre le budget
  submitBudgetForm(){
    const value = this.budgetInput.value;
    if(value==='' || value <0)
    {
      this.budgetFeedback.classList.add('showItem'); 
      this.budgetFeedback.innerHTML = `<p> Veuillez saisir un budget superieur ou egal a zero</p>`;
      const valThis = this;
      setTimeout(function(){
  // la const valThis pointe vers la classe UI
        valThis.budgetFeedback.classList.remove('showItem');

    }  ,4000);
    }else{
      this.budgetAmount.textContent = value;
      this.budgetInput.value='';
      this.showBalance();

    }

  }
  // afficher la balance
  showBalance(){
   
    const expenses = this.totalExpenses();
    const total = parseInt(this.budgetAmount.textContent) - expenses;
    this.balanceAmount.textContent = total;
    if(total<0){
      this.balance.classList.remove('showGreen','showBlack');
      this.balance.classList.add('showRed');

    }

      else if(total>0){
      this.balance.classList.remove('showRed','showBlack');
      this.balance.classList.add('showGreen');
      
    } else if(total===0){
      this.balance.classList.remove('showRed','showGreen');
      this.balance.classList.add('showBlack');
      
    }

  }

  // soumettre les depenses

  submitExpenseForm()
  {
    const expensesValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if(expensesValue ==''|| amountValue == '' || amountValue < 0){

      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p> Les champs ne doivent pas etre nuls ou negatifs</p>`;
      const valThis = this;
      setTimeout(() => {
        valThis.expenseFeedback.classList.remove('showItem');
      }, 4000);
    }else{
      let amount = parseInt(amountValue);
      this.expenseInput.value="";
      this.amountInput.value="";
// creer un objet depense
      let expense = {
        id : this.itemID,
        title : expensesValue,
        amount : amount
      }
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();

    }

  }

  // ajouter une depense
  addExpense(expense){
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML= `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>
    `
    this.expenseList.appendChild(div);

  }
  // totale des depenses
  totalExpenses(){
    let total =0 ;
    if(this.itemList.length>0){
      total = this.itemList.reduce(function(accumulator,currentValue){
        accumulator += currentValue.amount; 
        return accumulator;
      },0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  //editer les depenses
  editExpense(element){
      let id = parseInt(element.dataset.id);
      let parent = element.parentElement.parentElement.parentElement;
      //retirer du DOM
     this.expenseList.removeChild(parent);
      // retirer de la liste
     let expense = this.itemList.filter(function(item){
      return item.id === id;
     });

     // creer une liste temporaire avec le reste des elements de la liste
     let tempList = this.itemList.filter(function(item){
      return item.id !== id;
     });

     this.itemList = tempList;
     this.showBalance();

     // afficher la valeur de la depense selectionnee dans la forme ou on entre les depenses
     this.expenseInput.value = expense[0].title;
     this.amountInput.value = expense[0].amount;
    
  }

   //supprimer les depenses
   deleteExpense(element){
    let id = parseInt(element.dataset.id);
      let parent = element.parentElement.parentElement.parentElement;
      //retirer du DOM
     this.expenseList.removeChild(parent);
  
     let tempList = this.itemList.filter(function(item){
      return item.id !== id;
     });

     this.itemList = tempList;
     this.showBalance();

  }
}

function eventListeners() {
const budgetForm = document.getElementById('budget-form');
const expenseForm= document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

// nouvelle instance de la classe UI
const ui = new UI();

// ajouter d'un event Listener ( submit) a Budget Form

budgetForm.addEventListener('submit',function(event){
  /* preventDefault() annule le comportement par defaut 
  d'un objet si il est annulable, le comportement sera traiter
  explicitement
  */
event.preventDefault();
ui.submitBudgetForm();

});

// ajouter d'un event Listener ( submit) a Expense Form
expenseForm.addEventListener('submit',function(event){

  event.preventDefault();
  ui.submitExpenseForm();
});

// ajouter d'un event Listener ( click) a Expense List
expenseList.addEventListener('click',function(event){
  if(event.target.parentElement.classList.contains('edit-icon')){
    ui.editExpense(event.target.parentElement);
  }
  
  if(event.target.parentElement.classList.contains('delete-icon')){
    ui.deleteExpense(event.target.parentElement);
  }
  
});

}

document.addEventListener('DOMContentLoaded', function(){

  eventListeners();
})
