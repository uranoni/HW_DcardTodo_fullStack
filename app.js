const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
var cors = require('cors')
var app = express();
app.use(cors())
app.use(express.static(__dirname + '/www'));
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/todolist', {

});




app.use(express.static(__dirname + '/www'));
//bodyParser 前端傳過來的資料要做解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//
var Schema = new mongoose.Schema({
  todoname: { type: String },
  content: [{
    id: String,
    completed: Boolean,
    text: String
  }]
});
var Todo = mongoose.model('Todo', Schema);
const initTodo = () => {
  Todo.find({ 'todoname': 'mytodo' }).then((result) => {
    if (result.length == 0) {
      var todos = new Todo({
        "todoname": "mytodo",
        "content": [{
          id: "1",
          completed: false,
          text: "first task"
        }]
      })
      todos.save().then(() => {
        console.log("init mongodb success");
      }).catch((err) => {
        console.log(err)
      })
    }
    else {
      console.log("already success")
    }

  })
}
initTodo();
app.post('/rewrite', (req, res) => {
  console.log(req.body)
  var rewritetodo = req.body
  Todo.findOneAndUpdate({ todoname: "mytodo" }, { $set: { content: rewritetodo } }, function (error, result) {
    if (!error) {
      // If the document doesn't exist
      if (!result) {

        res.status(401).send('can not create')

      }
    }
    else {
      const msg = "更新成功";
      res.send(result, msg)
    }
  });

})

app.get('/getTodo', (req, res) => {
  Todo.find().then((result) => {
    console.log(result[0])
    data = result[0]
    res.send(data)
  }).catch((err) => {
    res.status(404).send('not found')
  })
})
app.listen(8888, () => {
  console.log("http://localhost:8888")
})
