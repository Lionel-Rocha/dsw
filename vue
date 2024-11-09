new Vue({
  el: "#transactions",
  data: {
    items: [
      { title: "Feira", value: 105, positive: false },
      { title: "Salário", value: 1875, positive: true },
      { title: "Aluguel", value: 1200, positive: false },
      { title: "Conta de Luz", value: 150, positive: false },
      { title: "Conta de Água", value: 80, positive: false },
      { title: "Transporte", value: 200, positive: false },
      { title: "Venda de Produto", value: 300, positive: true },
      { title: "Jantar com Amigos", value: 120, positive: false },
      { title: "Seguro do Carro", value: 600, positive: false },
      { title: "Investimentos", value: 1500, positive: true },
      { title: "Compra de Roupas", value: 250, positive: false },
      { title: "Pagamento de Empréstimo", value: 350, positive: false },
    ],
    newTitle: '',
    newValue: 0,
    isPositive: true,
    hoveredIndex: null
  },
  computed: {
    balance() {
      return this.items.reduce((acc, item) => {
        return acc + (item.positive ? item.value : -item.value);
      }, 0);
    }
  },
  methods: {
    add() {
      if (this.newTitle.trim() !== '' && !isNaN(this.newValue) && this.newValue !== 0) {
        const transaction = {
          title: this.newTitle,
          value: parseFloat(this.newValue),
          positive: this.isPositive
        };
        this.items.push(transaction);
        this.newTitle = '';
        this.newValue = 0;
        this.isPositive = true;
      } else {
        alert("Por favor, preencha todos os campos corretamente.");
      }
    },
    remove(index) {
      this.items.splice(index, 1);
    },
    moveUp(index) {
      if (index > 0) {
        const temp = this.items[index];
        this.items.splice(index, 1);
        this.items.splice(index - 1, 0, temp);
      }
    },
    moveDown(index) {
      if (index < this.items.length - 1) {
        const temp = this.items[index];
        this.items.splice(index, 1);
        this.items.splice(index + 1, 0, temp);
      }
    },
    calculateBalance(index) {
      // Calcula o saldo acumulado até a transação atual
      return this.items.slice(0, index + 1).reduce((acc, item) => {
        return acc + (item.positive ? item.value : -item.value);
      }, 0);
    }
  }
});
