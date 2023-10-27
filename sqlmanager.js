import fs from 'fs';

import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  host: process.env.HOST,
});

async function executeQuery(query) {
  try {
    const res = await pool.query(query);
    return res;
  }
  catch (error) {
    console.error(error);
  }
}

export function addTask(taskName) {
  var query = "INSERT INTO tasks (taskName) VALUES ('" + taskName + "');";
  executeQuery(query);
}

export function clearTasks() {
  var query = "DELETE FROM tasks;";
  executeQuery(query);
}

async function getTasks() {
  var query = "SELECT taskName FROM tasks;";
  var res = await executeQuery(query);

  var tasks = [];

  for (var i = 0; i < res.rows.length; i++) {
    tasks.push(res.rows[i]["taskname"]);
  }
  
  return tasks;
}

export async function constructTaskView() {
  var tasks = await getTasks();
  
  var res = fs.readFileSync("taskview.html");
  var res = res.toString();

  var taskList = "<ol>";

  for (var i = 0; i < tasks.length; i++) {
    taskList = taskList + "<li>" + tasks[i] + "</li>"
  }

  taskList = taskList + "</ol>";

  res = res.replace("[taskList]", taskList);

  return res;
}