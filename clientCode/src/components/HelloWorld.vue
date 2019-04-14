<template>
  <v-container>
    <h1>剩餘數量{{todos.length}}</h1>

    <v-text-field v-model="newtask" label="新增自己的清單" solo @keydown.enter="addTodo"></v-text-field>
    <template v-for="(task, idx) in todos">
      <v-list-tile :key="`${idx}-${task.text}`">
        <v-list-tile-action>
          <v-checkbox v-model="task.completed" color="info darken-3">
            <template v-slot:label>
              <div
                :class="task.completed && 'grey--text' || 'text--primary'"
                class="ml-3"
                v-text="`id:  ${task.id}`"
              ></div>
            </template>
          </v-checkbox>
        </v-list-tile-action>
        <div style="color:red" v-html="`${task.text}`"></div>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="open(task,idx)">點我修改</v-btn>
        <v-btn color="error" @click="deletetask(task,idx)">刪除此項目</v-btn>
        <v-scroll-x-transition>
          <v-icon v-if="task.completed" color="success">check</v-icon>
        </v-scroll-x-transition>
      </v-list-tile>
    </template>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>{{taskobj.id}}</v-card-title>

        <v-card-text>
          <v-text-field solo v-model="taskobj.text"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" flat @click="fixTask()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-btn color="success" @click="syncdb">同步資料庫</v-btn>
      <v-btn color="info" @click="clearcomplete">清除已完成項目</v-btn>
      <v-btn color="error" @click="cleartodo">清空todo</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    taskobj: {},
    taskobjidx: 0,
    dialog: false,
    newtask: "",
    // fix: "",
    todos: [
      {
        id: "1",
        text: "您好",
        completed: false
      }
    ]
  }),
  mounted: function() {
    this.axios({
      url: "/getTodo",
      method: "get"
    })
      .then(res => {
        this.todos = res.data.content;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    addTodo() {
      var value = this.newtask;
      this.newtask = "";

      const nid = this.$dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.todos.push({
        id: nid,
        text: value,
        completed: false
      });
    },
    open(task, idx) {
      this.dialog = true;
      this.taskobj = task;
      this.taskobjidx = idx;
    },

    fixTask() {
      this.dialog = false;
    },
    deletetask(task, idx) {
      this.todos.splice(idx, 1);
    },
    clearcomplete() {
      const newarray = this.todos;
      const result = newarray.filter(obj => obj.completed == false);
      this.todos = result;
    },
    cleartodo() {
      this.todos = [];
    },
    syncdb() {
      this.axios({
        url: "/rewrite",
        method: "post",
        data: this.todos
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>
