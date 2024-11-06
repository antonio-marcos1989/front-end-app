Vue.component('user-component', {
  template: `
    <div>
      <form @submit.prevent="saveUser">
        <input type="text" v-model="user.name" placeholder="Name" class="form-control" required>
        <input type="email" v-model="user.email" placeholder="Email" class="form-control" required>
        <button type="submit" class="btn btn-primary mt-2">{{ editMode ? "Update" : "Add" }} User</button>
      </form>
      
      <ul class="list-group mt-4">
        <li v-for="user in users" :key="user.id" class="list-group-item">
          {{ user.name }} ({{ user.email }})
          <button @click="editUser(user)" class="btn btn-warning btn-sm mx-2">Edit</button>
          <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      users: [],
      user: {
        name: '',
        email: ''
      },
      editMode: false,
      editId: null
    };
  },
  methods: {
    async fetchUsers() {
      const response = await axios.get('http://localhost:8080/api/users/');
      this.users = response.data;
    },
    async saveUser() {
      if (this.editMode) {
        await axios.put(`http://localhost:8080/api/users/${this.editId}`, this.user);
      } else {
        await axios.post('http://localhost:8080/api/users', this.user);
      }
      this.resetForm();
      this.fetchUsers();
    },
    editUser(user) {
      this.user = { name: user.name, email: user.email };
      this.editMode = true;
      this.editId = user.id;
    },
    async deleteUser(id) {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      this.fetchUsers();
    },
    resetForm() {
      this.user = { name: '', email: '' };
      this.editMode = false;
      this.editId = null;
    }
  },
  mounted() {
    this.fetchUsers();
  }
});

new Vue({
  el: '#app'
});